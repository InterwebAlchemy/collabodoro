import { IconRouter } from "@tabler/icons-react";

import { usePeer } from "../contexts/PeerContext";

export default function CollaborationStatus() {
  const { isPeerConnected, isHost, peerId, connectedPeerIds } = usePeer();

  if (!isPeerConnected) {
    return null;
  }

  return (
    <div className="flex">
      <div className="flex items-center gap-0 rounded-md px-2">
        <IconRouter
          size={20}
          className="animate-pulse"
          title={
            isHost
              ? `Hosting as ${peerId} with ${connectedPeerIds.length} peer${
                  connectedPeerIds.length === 1 ? "" : "s"
                }`
              : `Joined as ${peerId}`
          }
        />
      </div>
      <span className="sr-only">
        {isHost ? "Hosting Pomodoro Session" : "Connected to Pomodoro Session"}
        {connectedPeerIds.length > 0 && (
          <span className="text-gray-500">
            {isHost ? "with" : "as"}
            <code className="mx-1 px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">
              {isHost
                ? `${connectedPeerIds.length} peer${
                    connectedPeerIds.length === 1 ? "" : "s"
                  }`
                : peerId}
            </code>
          </span>
        )}
      </span>
    </div>
  );
}
