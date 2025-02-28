import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Peer, { DataConnection } from "peerjs";
import { generateSlug } from "../utils/slug";

// Define a type for the messages we'll be sending
interface TimerMessage {
  type: "START" | "PAUSE" | "RESET" | "SYNC" | "STOP";
  payload: {
    isRunning?: boolean;
    isPaused?: boolean;
    progress?: number;
    isWorking?: boolean;
    isResting?: boolean;
    timestamp?: number;
  };
}

interface PeerContextProps {
  peer: Peer | null;
  connection: DataConnection | null;
  peerId: string | null;
  connectedPeerId: string | null;
  isPeerConnected: boolean;
  isHost: boolean;
  isInitializing: boolean;
  initializePeer: () => void;
  connectToPeer: (remotePeerId: string) => void;
  disconnectPeer: () => void;
  sendMessage: (message: TimerMessage) => void;
  requestInitialState: () => void;
  connectionError: string | null;
}

interface PeerProviderProps {
  children: ReactNode;
  onMessageReceived: (data: TimerMessage) => void;
  onConnectionEstablished?: (isHost: boolean) => void;
}

const PeerContext = createContext<PeerContextProps | null>(null);

export const usePeer = () => {
  const context = useContext(PeerContext);
  if (!context) {
    throw new Error("usePeer must be used within a PeerProvider");
  }
  return context;
};

export const PeerProvider: React.FC<PeerProviderProps> = ({
  children,
  onMessageReceived,
  onConnectionEstablished,
}) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [connection, setConnection] = useState<DataConnection | null>(null);
  const [connectedPeerId, setConnectedPeerId] = useState<string | null>(null);
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const clearConnectionState = () => {
    setConnection(null);
    setConnectedPeerId(null);
    setIsPeerConnected(false);
    setConnectionError(null);
  };

  const initializePeer = async () => {
    setIsInitializing(true);

    if (peer) {
      // If there's already a peer but no connection, just reuse it
      if (!isPeerConnected) {
        return;
      }

      // Otherwise destroy the existing peer first
      peer.destroy();
    }

    clearConnectionState();
    setConnectionError(null);

    // Configure PeerJS with better connection options
    const peerOptions = {
      debug: 2, // Log level: 0 = none, 1 = errors only, 2 = warnings + errors, 3 = all
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478" },
        ],
      },
    };

    console.log("Initializing new peer with options:", peerOptions);

    const newPeer = new Peer(generateSlug(), peerOptions);

    newPeer.on("open", (id) => {
      console.log("My peer ID is:", id);
      setPeerId(id);
      setIsHost(true);
    });

    newPeer.on("connection", (conn) => {
      console.log("Incoming connection from peer:", conn.peer);

      // Close any existing connection
      if (connection) {
        console.log("Closing existing connection before accepting new one");
        connection.close();
      }

      setConnection(conn);
      setConnectedPeerId(conn.peer);
      setIsPeerConnected(true);
      setConnectionError(null);

      conn.on("open", () => {
        console.log("Connection to peer is now open:", conn.peer);
      });

      conn.on("data", (data: unknown) => {
        if (isTimerMessage(data)) {
          // If client is requesting initial state
          if (data.type === "SYNC") {
            console.log(
              isHost ? "HOST" : "CLIENT",
              "Received SYNC message with timestamp 0 from peer"
            );

            // Host will receive this message and the parent component
            // will handle responding with current state
          }

          onMessageReceived(data);
        } else {
          console.error("Received invalid message format:", data);
        }
      });

      conn.on("close", () => {
        console.log("Connection closed by peer:", conn.peer);
        clearConnectionState();
      });

      conn.on("error", (err) => {
        console.error("Connection error:", err);
        setConnectionError(`Connection error: ${err.toString()}`);
        clearConnectionState();
      });

      // Notify parent that a connection was established as host
      if (onConnectionEstablished) {
        onConnectionEstablished(true);
      }
    });

    newPeer.on("error", (err) => {
      console.error("Peer error:", err);
      setConnectionError(`Peer error: ${err.toString()}`);
      setPeer(null);
      setPeerId(null);
    });

    newPeer.on("disconnected", () => {
      console.log("Peer disconnected from server");
      setConnectionError(
        "Disconnected from signaling server. Attempting to reconnect..."
      );

      // Try to reconnect to the signaling server
      newPeer.reconnect();
    });

    newPeer.on("close", () => {
      console.log("Peer connection closed");
      setPeer(null);
      setPeerId(null);
      clearConnectionState();
    });

    setPeer(newPeer);
  };

  const connectToPeer = (remotePeerId: string) => {
    if (!peer) {
      console.error("Cannot connect: peer object not initialized");
      setConnectionError("Cannot connect: peer not initialized");
      return;
    }

    console.log("Attempting to connect to peer:", remotePeerId);
    setConnectionError(null);

    try {
      // Configure connection with reliability options
      const conn = peer.connect(remotePeerId, {
        reliable: true,
        serialization: "json",
      });

      if (!conn) {
        console.error("Failed to create connection object");
        setConnectionError("Failed to create connection");
        return;
      }

      setIsHost(false);

      // Set timeout for connection attempt
      const connectionTimeout = setTimeout(() => {
        if (!isPeerConnected) {
          console.error("Connection attempt timed out");
          setConnectionError("Connection timed out. Please try again.");
          if (conn) conn.close();
        }
      }, 15000);

      conn.on("open", () => {
        clearTimeout(connectionTimeout);
        console.log("Connected to peer:", remotePeerId);
        setConnection(conn);
        setConnectedPeerId(remotePeerId);
        setIsPeerConnected(true);
        setConnectionError(null);

        // Notify parent that a connection was established as client
        if (onConnectionEstablished) {
          onConnectionEstablished(false);
        }

        // Immediately request the initial timer state from the host
        setTimeout(() => {
          requestInitialState();
        }, 500); // Small delay to ensure connection is fully established
      });

      conn.on("data", (data: unknown) => {
        if (isTimerMessage(data)) {
          onMessageReceived(data);
        } else {
          console.error("Received invalid message format:", data);
        }
      });

      conn.on("close", () => {
        clearTimeout(connectionTimeout);
        console.log("Connection closed");
        clearConnectionState();
      });

      conn.on("error", (err) => {
        clearTimeout(connectionTimeout);
        console.error("Connection error:", err);
        setConnectionError(`Connection error: ${err.toString()}`);
        clearConnectionState();
      });
    } catch (error) {
      console.error("Exception while connecting to peer:", error);
      setConnectionError(
        `Connection failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  // Request initial timer state from the host
  const requestInitialState = () => {
    if (connection && isPeerConnected && !isHost) {
      console.log("Requesting initial timer state from host");
      try {
        // Send a special SYNC message with timestamp 0 to indicate initial state request
        connection.send({
          type: "SYNC",
          payload: {
            timestamp: 0,
          },
        });
        console.log("Initial state request sent successfully");
      } catch (error) {
        console.error("Error sending initial state request:", error);
        setConnectionError(
          `Failed to request timer state: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    } else {
      console.warn("Cannot request initial state: not connected as client");
    }
  };

  // Type guard to check if the received data is a TimerMessage
  const isTimerMessage = (data: unknown): data is TimerMessage => {
    if (typeof data !== "object" || data === null) return false;

    const msg = data as Record<string, unknown>;

    return (
      "type" in msg &&
      typeof msg.type === "string" &&
      ["START", "PAUSE", "RESET", "SYNC", "STOP"].includes(msg.type) &&
      "payload" in msg &&
      typeof msg.payload === "object" &&
      msg.payload !== null
    );
  };

  const disconnectPeer = () => {
    console.log("Disconnecting peer connection");
    if (connection) {
      connection.close();
    }

    if (peer) {
      peer.destroy();
      setPeer(null);
      setPeerId(null);
    }

    clearConnectionState();
  };

  const sendMessage = (message: TimerMessage) => {
    if (connection && isPeerConnected) {
      try {
        console.log("Sending message:", message);
        connection.send(message);
      } catch (error) {
        console.error("Error sending message:", error);
        setConnectionError(
          `Failed to send message: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    } else {
      console.warn("Cannot send message: not connected to peer");
    }
  };

  useEffect(() => {
    if (peerId) {
      if (isInitializing) {
        setIsInitializing(false);
      }
    }
  }, [peerId, isInitializing]);

  useEffect(() => {
    return () => {
      if (peer) {
        peer.destroy();
      }
    };
  }, [peer]);

  return (
    <PeerContext.Provider
      value={{
        peer,
        connection,
        peerId,
        connectedPeerId,
        isPeerConnected,
        isHost,
        isInitializing,
        initializePeer,
        connectToPeer,
        disconnectPeer,
        sendMessage,
        requestInitialState,
        connectionError,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};
