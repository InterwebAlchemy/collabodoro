import { useState, useEffect } from "react";
import { usePeer } from "../contexts/PeerContext";
import ConnectionOptions from "./ConnectionOptions";
import ActiveConnection from "./ActiveConnection";

/**
 * Main component that manages peer-to-peer connection for collaborative pomodoro sessions
 */
export default function PeerConnection() {
  const {
    peerId,
    isHost,
    isPeerConnected,
    initializePeer,
    connectToPeer,
    disconnectPeer,
    connectionError,
    isInitializing,
    isPeerReady,
  } = usePeer();

  const [isConnecting, setIsConnecting] = useState(false);
  const [pendingConnectionId, setPendingConnectionId] = useState<string | null>(
    null
  );
  const [localError, setLocalError] = useState<string | null>(null);

  // Effect to handle connection when peer is ready
  useEffect(() => {
    let isMounted = true;

    // Connect to peer if we're waiting and peer is ready
    if (pendingConnectionId && isPeerReady && !isPeerConnected) {
      console.log("Peer is ready, connecting to:", pendingConnectionId);
      const connectPeer = async () => {
        try {
          await connectToPeer(pendingConnectionId);
        } catch (error) {
          if (isMounted) {
            setLocalError(
              `Failed to connect: ${
                error instanceof Error ? error.message : String(error)
              }`
            );
          }
        } finally {
          if (isMounted) {
            setPendingConnectionId(null);
          }
        }
      };

      connectPeer();
    }

    return () => {
      isMounted = false;
    };
  }, [pendingConnectionId, isPeerReady, isPeerConnected]);

  // Manage connection state and timeouts
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (isConnecting) {
      // Clear connecting state when connection is established or an error occurs
      if (isPeerConnected || connectionError) {
        console.log(
          "Connection established or error occurred, clearing connecting state"
        );
        setIsConnecting(false);
      }
      // Set a timeout for connection attempts if still connecting
      else if (!isPeerConnected) {
        console.log("Setting connection timeout");
        timeoutId = setTimeout(() => {
          console.log("Connection timeout fired");
          setIsConnecting(false);
          setPendingConnectionId(null);
          if (!connectionError) {
            setLocalError("Connection attempt timed out. Please try again.");
          }
        }, 20000);
      }
    }

    return () => {
      if (timeoutId) {
        console.log("Clearing connection timeout");
        clearTimeout(timeoutId);
      }
    };
  }, [isConnecting, isPeerConnected, connectionError]);

  const handleHostSession = async () => {
    setLocalError(null);
    try {
      await initializePeer();
    } catch (error) {
      setLocalError(
        `Failed to initialize peer: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const handleJoinSession = async (remotePeerId: string) => {
    if (!remotePeerId.trim()) {
      setLocalError("Please enter a session ID");
      return;
    }

    setLocalError(null);
    setIsConnecting(true);
    console.log("Initializing peer to join session:", remotePeerId);

    try {
      // First initialize the peer
      await initializePeer();

      // Queue the connection to happen after peer is ready
      console.log("Peer initialized, queuing connection to:", remotePeerId);
      setPendingConnectionId(remotePeerId);
    } catch (error) {
      console.error("Failed to initialize peer:", error);
      setIsConnecting(false);
      setLocalError(
        `Failed to initialize peer: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const confirmDisconnect = () => {
    if (
      window.confirm(
        isHost
          ? `Are you sure you want to close the session?`
          : `Are you sure you want to disconnect from ${peerId}? This will end the collaboration session.`
      )
    ) {
      handleDisconnect();
    }
  };

  const handleDisconnect = () => {
    disconnectPeer();
    setIsConnecting(false);
    setLocalError(null);
    setPendingConnectionId(null);
  };

  const handleReset = async () => {
    disconnectPeer();
    setIsConnecting(false);
    setLocalError(null);
    setPendingConnectionId(null);

    try {
      // Try to reinitialize the peer after a disconnect
      await initializePeer();
    } catch (error) {
      setLocalError(
        `Failed to reset: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const handleCancel = () => {
    setIsConnecting(false);
    setLocalError(null);
    setPendingConnectionId(null);
    disconnectPeer();
  };

  // Display error message (prioritize context error over local error)
  const errorMessage = connectionError || localError;

  return (
    <div className="relative flex flex-col gap-4">
      {!isPeerConnected && (
        <ConnectionOptions
          peerId={peerId}
          isConnecting={isConnecting}
          isInitializing={isInitializing}
          errorMessage={errorMessage}
          onHostSession={handleHostSession}
          onJoinSession={handleJoinSession}
          onCancel={handleCancel}
          onReset={handleReset}
        />
      )}

      {isPeerConnected && <ActiveConnection onDisconnect={confirmDisconnect} />}
    </div>
  );
}
