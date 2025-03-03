import { useState } from "react";
import { IconDeviceWatchCode, IconX, IconRefresh } from "@tabler/icons-react";

import IconButton from "./IconButton";
import ConnectionStatus from "./ConnectionStatus";

/**
 * Props for the JoinSessionForm component
 */
export interface JoinSessionFormProps {
  peerId: string; // Added to fix the type error in ConnectionOptions
  isConnecting: boolean;
  isInitializing: boolean;
  errorMessage: string | null;
  onJoin: (remotePeerId: string) => void;
  onCancel: () => void;
  onReset: (connectType?: "host" | "join") => void;
  onClose: () => void;
}

/**
 * Join session form that allows entering a remote peer ID
 *
 * @param peerId - The current user's peer ID (unused in this component but needed for consistency)
 * @param isConnecting - Whether connection is in progress
 * @param errorMessage - Error message to display, if any
 * @param onJoin - Callback when joining a session with the entered peer ID
 * @param onCancel - Callback when canceling the joining process
 * @param onReset - Callback to reset the connection
 * @param className - Optional additional CSS classes
 */
export default function JoinSessionForm({
  isConnecting,
  isInitializing,
  errorMessage,
  onJoin,
  onReset,
  onClose,
}: JoinSessionFormProps) {
  const [remotePeerId, setRemotePeerId] = useState("");

  const handleJoin = () => {
    if (remotePeerId.trim()) {
      onJoin(remotePeerId);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border border-[var(--btn-border-color)] rounded-md bg-[var(--background)]">
      <div className="flex flex-row gap-0 justify-end">
        <IconButton
          icon={<IconX size={10} />}
          label="Close"
          onClick={onClose}
          buttonClasses="text-xs"
        />
      </div>

      <ConnectionStatus
        isConnecting={isConnecting}
        errorMessage={errorMessage}
      />

      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-600">Session ID</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={remotePeerId}
            onChange={(e) => setRemotePeerId(e.target.value)}
            placeholder="Enter session ID"
            className="flex-1 p-2 border appearance-none bg-transparent border-[var(--btn-border-color)] rounded text-[16px]"
            disabled={isInitializing || isConnecting}
            ref={(e) => {
              e?.focus();
            }}
          />
          <IconButton
            icon={<IconDeviceWatchCode size={20} />}
            label="Join"
            onClick={handleJoin}
            disabled={!remotePeerId.trim() || isInitializing || isConnecting}
          />
        </div>
      </div>

      <div className="flex justify-between mt-2">
        {(errorMessage || isConnecting) && (
          <IconButton
            icon={<IconRefresh size={20} />}
            label="Reset Connection"
            onClick={() => {
              onReset("join");
            }}
            disabled={isInitializing || isConnecting}
          />
        )}
      </div>
    </div>
  );
}
