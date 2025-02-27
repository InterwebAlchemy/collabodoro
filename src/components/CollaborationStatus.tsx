import { usePeer } from "../contexts/PeerContext";

interface CollaborationStatusProps {
  className?: string;
}

export default function CollaborationStatus({
  className = "",
}: CollaborationStatusProps) {
  const { isPeerConnected, isHost, peerId, connectedPeerId } = usePeer();

  if (!isPeerConnected) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="font-medium">
        {isHost ? "Hosting Pomodoro Session" : "Connected to Pomodoro Session"}
      </span>
      {connectedPeerId && (
        <span className="text-gray-500">
          {isHost ? "with" : "as"}
          <code className="mx-1 px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">
            {isHost ? connectedPeerId : peerId}
          </code>
        </span>
      )}
    </div>
  );
}
