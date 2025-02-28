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
    isPeerConnected,
    initializePeer,
    connectToPeer,
    disconnectPeer,
    connectionError,
    isInitializing,
  } = usePeer();

  const [isConnecting, setIsConnecting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Update connecting state when connection status changes
  useEffect(() => {
    if (isPeerConnected && isConnecting) {
      setIsConnecting(false);
    }

    if (connectionError && isConnecting) {
      setIsConnecting(false);
    }
  }, [isPeerConnected, connectionError, isConnecting]);

  const handleHostSession = () => {
    setLocalError(null);
    initializePeer();
  };

  const handleJoinSession = (remotePeerId: string) => {
    if (!remotePeerId.trim()) {
      setLocalError("Please enter a session ID");
      return;
    }

    setLocalError(null);
    setIsConnecting(true);

    // Initialize peer and connect
    initializePeer();

    // Small delay to ensure peer is initialized
    setTimeout(() => {
      connectToPeer(remotePeerId);
    }, 1000);

    // Reset connecting state after a timeout in case connection fails
    setTimeout(() => {
      if (isConnecting) {
        setIsConnecting(false);
        if (!connectionError) {
          setLocalError("Connection attempt timed out. Please try again.");
        }
      }
    }, 20000);
  };

  const handleDisconnect = () => {
    disconnectPeer();
    setIsConnecting(false);
    setLocalError(null);
  };

  const handleReset = () => {
    disconnectPeer();
    setIsConnecting(false);
    setLocalError(null);
    // Reset UI and try again
    setTimeout(() => {
      initializePeer();
    }, 1000);
  };

  const handleCancel = () => {
    setIsConnecting(false);
    setLocalError(null);
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

      {isPeerConnected && <ActiveConnection onDisconnect={handleDisconnect} />}
    </div>
  );
}
