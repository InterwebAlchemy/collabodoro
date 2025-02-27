import { useState, useEffect } from "react";
import { usePeer } from "../contexts/PeerContext";

interface PeerConnectionProps {
  className?: string;
}

export default function PeerConnection({
  className = "",
}: PeerConnectionProps) {
  const {
    peerId,
    connectedPeerId,
    isPeerConnected,
    isHost,
    initializePeer,
    connectToPeer,
    disconnectPeer,
    connectionError,
  } = usePeer();

  const [remotePeerId, setRemotePeerId] = useState("");
  const [showConnectionUI, setShowConnectionUI] = useState(false);
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
    setShowConnectionUI(true);
  };

  const handleJoinSession = () => {
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
    setShowConnectionUI(false);
    setIsConnecting(false);
    setLocalError(null);
  };

  // Display error message (prioritize context error over local error)
  const errorMessage = connectionError || localError;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {!isPeerConnected && !showConnectionUI && (
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={handleHostSession}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Host a Pomodoro Session
          </button>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowConnectionUI(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Join a Pomodoro Session
            </button>
          </div>
        </div>
      )}

      {showConnectionUI && !isPeerConnected && (
        <div className="flex flex-col gap-4 p-4 border border-gray-300 rounded-md">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {errorMessage}
            </div>
          )}

          {isConnecting && (
            <div className="flex items-center justify-center gap-2 py-2 text-blue-600">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Connecting...</span>
              <p className="text-xs text-gray-500 ml-2">
                This may take a few moments
              </p>
            </div>
          )}

          {peerId && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-600">Your session ID:</p>
              <div className="flex gap-2 items-center">
                <code className="bg-gray-100 p-2 rounded text-sm flex-1 overflow-x-auto">
                  {peerId}
                </code>
                <button
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(peerId);
                    } catch (error) {
                      console.error("Failed to copy text:", error);
                    }
                  }}
                  id="copy-button"
                  className="p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  title="Copy to clipboard"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Share this ID with others to let them join your session
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">Join using a session ID:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={remotePeerId}
                onChange={(e) => setRemotePeerId(e.target.value)}
                placeholder="Enter session ID"
                className="flex-1 p-2 border border-gray-300 rounded"
                disabled={isConnecting}
              />
              <button
                onClick={handleJoinSession}
                disabled={!remotePeerId.trim() || isConnecting}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300 hover:bg-blue-700 transition-colors"
              >
                {isConnecting ? "Joining..." : "Join"}
              </button>
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <button
              onClick={() => {
                setShowConnectionUI(false);
                setIsConnecting(false);
                setLocalError(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              disabled={isConnecting}
            >
              Cancel
            </button>

            {(errorMessage || isConnecting) && (
              <button
                onClick={() => {
                  disconnectPeer();
                  setIsConnecting(false);
                  setLocalError(null);
                  // Reset UI and try again
                  setTimeout(() => {
                    initializePeer();
                  }, 1000);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                disabled={isConnecting}
              >
                Reset Connection
              </button>
            )}
          </div>
        </div>
      )}

      {isPeerConnected && (
        <div className="flex flex-col gap-2 p-4 border border-gray-300 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {isHost ? "Hosting Session" : "Connected to Session"}
              </p>
              {connectedPeerId && (
                <p className="text-xs text-gray-500">
                  {isHost ? "User connected: " : "Connected to: "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">
                    {connectedPeerId}
                  </code>
                </p>
              )}
            </div>
            <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full"></div>
          </div>

          <button
            onClick={handleDisconnect}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors mt-2"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
