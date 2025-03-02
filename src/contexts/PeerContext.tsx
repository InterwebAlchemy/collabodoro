import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Peer, { DataConnection } from "peerjs";
import { generateSlug } from "../utils/slug";
import { useAudio } from "./AudioContext";
import type { TimerMessage } from "./MessageContext";
import { CONNECTION_TIMEOUT } from "../constants/connection";

interface PeerContextProps {
  peer: Peer | null;
  connection: DataConnection | null;
  peerId: string | null;
  connectedPeerId: string | null;
  isPeerConnected: boolean;
  isHost: boolean;
  isInitializing: boolean;
  isJoining: boolean;
  isPeerReady: boolean;
  isConnected: boolean;
  initializePeer: () => Promise<void>;
  connectToPeer: (remotePeerId: string) => Promise<void>;
  disconnectPeer: () => void;
  sendMessage: (message: TimerMessage) => void;
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
  const { playSound, stopSound } = useAudio();
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [connection, setConnection] = useState<DataConnection | null>(null);
  const [connectedPeerId, setConnectedPeerId] = useState<string | null>(null);
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isPeerReady, setIsPeerReady] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [didJoin, setDidJoin] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const clearConnectionState = () => {
    setConnection(null);
    setConnectedPeerId(null);
    setIsPeerConnected(false);
    setConnectionError(null);
    setIsConnected(false);
  };

  /**
   * Set up event listeners for a peer instance
   */
  const setupPeerEventListeners = (newPeer: Peer) => {
    newPeer.on("connection", (conn) => {
      console.log("Incoming connection from peer:", conn.peer);
      playSound("JOINED");

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

        // Notify parent that a connection was established as host
        if (onConnectionEstablished) {
          onConnectionEstablished(true);
        }
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
        playSound("LEFT");
        clearConnectionState();
      });

      conn.on("error", (err) => {
        stopSound("CONNECTING");
        console.error("Connection error:", err);
        setConnectionError(`Connection error: ${err.toString()}`);
        clearConnectionState();
      });
    });

    newPeer.on("error", (err) => {
      stopSound("CONNECTING");
      console.error("Peer error:", err);
      setConnectionError(`Peer error: ${err.toString()}`);
      setPeer(null);
      setPeerId(null);
      setIsPeerReady(false);
    });

    newPeer.on("disconnected", () => {
      console.log("Peer disconnected from server");
      playSound("LEFT");
      setConnectionError(
        "Disconnected from signaling server. Attempting to reconnect..."
      );

      // Try to reconnect to the signaling server
      newPeer.reconnect();
    });

    newPeer.on("close", () => {
      console.log("Peer connection closed");
      stopSound("CONNECTING");
      playSound("DISCONNECTED");
      setPeer(null);
      setPeerId(null);
      setIsPeerReady(false);
      clearConnectionState();
    });
  };

  // Type guard to check if the received data is a TimerMessage
  const isTimerMessage = (data: unknown): data is TimerMessage => {
    if (typeof data !== "object" || data === null) return false;

    const msg = data as Record<string, unknown>;

    return (
      "type" in msg &&
      typeof msg.type === "string" &&
      ["START", "PAUSE", "RESET", "SYNC", "STOP", "COMPLETE"].includes(
        msg.type
      ) &&
      "payload" in msg &&
      typeof msg.payload === "object" &&
      msg.payload !== null
    );
  };

  /**
   * Initialize a new PeerJS instance
   * @returns Promise that resolves when the peer is ready to use
   */
  const initializePeer = async () => {
    setIsInitializing(true);
    setIsPeerReady(false);
    playSound("CONNECTING");

    if (peer) {
      console.log("Peer already exists, destroying it");
      // If there's already a peer but no connection, just reuse it
      if (!isPeerConnected) {
        console.log("Peer already exists, but no connection, reusing it");
        setIsPeerReady(true);
        setIsInitializing(false);
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

    try {
      const newPeer = new Peer(generateSlug(), peerOptions);

      await new Promise<void>((resolve, reject) => {
        // Set timeout for initialization
        const initTimeout = setTimeout(() => {
          reject(new Error("Peer initialization timed out"));
        }, CONNECTION_TIMEOUT);

        newPeer.on("open", (id) => {
          console.log("My peer ID is:", id);
          stopSound("CONNECTING");
          setPeerId(id);
          setIsHost(true);
          setIsPeerReady(true);
          clearTimeout(initTimeout);
          resolve();
        });

        newPeer.on("error", (err) => {
          clearTimeout(initTimeout);
          reject(err);
        });
      });

      // Set up event listeners for the newly created peer
      setupPeerEventListeners(newPeer);

      setPeer(newPeer);
    } catch (error) {
      stopSound("CONNECTING");
      console.error("Peer initialization error:", error);
      setConnectionError(
        `Peer initialization failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsInitializing(false);
    }
  };

  /**
   * Connect to a remote peer
   * @param remotePeerId ID of the peer to connect to
   * @returns Promise that resolves when the connection is established
   */
  const connectToPeer = async (remotePeerId: string) => {
    if (!peer || !isPeerReady) {
      console.error("Cannot connect: peer object not initialized or not ready");
      throw new Error("Cannot connect: peer not initialized or not ready");
    }

    setIsJoining(true);

    console.log("Attempting to connect to peer:", remotePeerId);
    setConnectionError(null);
    playSound("CONNECTING");

    try {
      // Configure connection with reliability options
      const conn = peer.connect(remotePeerId, {
        reliable: true,
        serialization: "json",
      });

      if (!conn) {
        throw new Error("Failed to create connection object");
      }

      setIsHost(false);

      try {
        // Wait for the connection to open
        await new Promise<void>((resolve, reject) => {
          // Set timeout for connection attempt
          const connectionTimeout = setTimeout(() => {
            reject(new Error("Connection attempt timed out"));
          }, CONNECTION_TIMEOUT);

          conn.on("open", () => {
            setDidJoin(true);
            setIsJoining(false);
            setConnectedPeerId(remotePeerId);
            setConnection(conn);
            setIsPeerConnected(true);
            setConnectionError(null);
            setIsConnected(true);
            clearTimeout(connectionTimeout);

            // Notify parent that a connection was established as client
            if (onConnectionEstablished) {
              onConnectionEstablished(false);
            }

            resolve();
          });

          conn.on("error", (err) => {
            setDidJoin(false);
            setIsJoining(false);
            setConnectedPeerId(null);
            setConnection(null);
            setIsPeerConnected(false);
            setConnectionError(null);
            setIsConnected(false);

            clearTimeout(connectionTimeout);

            reject(err);
          });
        });
      } catch (error) {
        stopSound("CONNECTING");
        console.error("Connection error:", error);
        setConnectionError(`Could not connect to host: ${peerId}`);
        setDidJoin(false);
        setIsJoining(false);
        setConnectedPeerId(null);
        setConnection(null);
        setIsPeerConnected(false);
        setConnectionError(null);
        setIsConnected(false);
      }

      // Set up data event handler
      conn.on("data", (data: unknown) => {
        if (isTimerMessage(data)) {
          onMessageReceived(data);
        } else {
          console.error("Received invalid message format:", data);
        }
      });

      // Set up close event handler
      conn.on("close", () => {
        stopSound("CONNECTING");
        console.log("Connection closed");
        clearConnectionState();
        setIsConnected(false);
      });

      conn.on("error", (err) => {
        stopSound("CONNECTING");
        console.error("Connection error:", err);
        setConnectionError(`Connection error: ${err.toString()}`);
        clearConnectionState();
        setIsConnected(false);
      });
    } catch (error) {
      stopSound("CONNECTING");
      console.error("Connection error:", error);
      setIsConnected(false);
      setConnectionError(
        `Connection failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      throw error;
    } finally {
      setIsJoining(false);
      stopSound("CONNECTING");
    }
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
      setIsPeerReady(false);
      setIsHost(false);
      setIsJoining(false);
      setConnectedPeerId(null);
      setConnection(null);
      setIsPeerConnected(false);
      setIsConnected(false);
      setConnectionError(null);
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

  // Send initial SYNC request when connected as a client
  useEffect(() => {
    if (connection && isPeerConnected && !isHost && didJoin) {
      console.log("Requesting initial timer state from host");

      try {
        // Send a special SYNC message to indicate initial state request
        connection.send({
          type: "SYNC",
          payload: {},
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
    }
  }, [connection, isPeerConnected, isHost, didJoin]);

  // Update initialization state when peerId is set
  useEffect(() => {
    if (peerId && isInitializing) {
      setIsInitializing(false);
    }
  }, [peerId, isInitializing]);

  // Clean up on unmount
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
        isJoining,
        isPeerReady,
        initializePeer,
        connectToPeer,
        disconnectPeer,
        sendMessage,
        connectionError,
        isConnected,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};
