import { IconRouter } from "@tabler/icons-react";

import { usePeer } from "../contexts/PeerContext";

export default function CollaborationStatus() {
  const { isPeerConnected, isHost, peerId, connectedPeerId } = usePeer();

  if (!isPeerConnected) {
    return null;
  }

  return (
    <div className="md:fixed md:bottom-[20px] md:right-[20px] flex row-reverse">
      <div className="flex items-center gap-0 rounded-md px-2">
        <IconRouter size={20} className="animate-pulse" />
      </div>
      <span className="sr-only">
        {isHost ? "Hosting Pomodoro Session" : "Connected to Pomodoro Session"}
        {connectedPeerId && (
          <span className="text-gray-500">
            {isHost ? "with" : "as"}
            <code className="mx-1 px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">
              {isHost ? connectedPeerId : peerId}
            </code>
          </span>
        )}
      </span>
    </div>
  );
}
