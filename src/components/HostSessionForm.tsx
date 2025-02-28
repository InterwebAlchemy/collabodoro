import React from "react";
import IconButton from "./IconButton";
import { IconX, IconRefresh, IconClipboard } from "@tabler/icons-react";
import ConnectionStatus from "./ConnectionStatus";

/**
 * Props for the HostSessionForm component
 */
export interface HostSessionFormProps {
  peerId: string;
  isConnecting: boolean;
  isInitializing: boolean;
  errorMessage: string | null;
  onCancel: () => void;
  onReset: () => void;
  className?: string;
}

/**
 * Host session form that displays peer ID and allows copying to clipboard
 *
 * @param peerId - The current user's peer ID when hosting
 * @param isConnecting - Whether connection is in progress
 * @param errorMessage - Error message to display, if any
 * @param onCancel - Callback when canceling the hosting process
 * @param onReset - Callback to reset the connection
 * @param className - Optional additional CSS classes
 */
export default function HostSessionForm({
  peerId,
  isConnecting,
  isInitializing,
  errorMessage,
  onCancel,
  onReset,
}: HostSessionFormProps) {
  return (
    <div className="flex flex-col gap-4 p-4 border border-[var(--btn-border-color)] rounded-md bg-[var(--background)]">
      <ConnectionStatus
        isConnecting={isConnecting}
        errorMessage={errorMessage}
      />

      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-600">Your session ID:</p>
        <div className="flex gap-2 items-center">
          <code className="p-2 rounded text-sm flex-1 overflow-x-auto border border-[var(--btn-border-color)]">
            {peerId}
          </code>
          <IconButton
            icon={<IconClipboard size={20} />}
            label="Copy to clipboard"
            onClick={() => {
              try {
                navigator.clipboard.writeText(peerId);
              } catch (error) {
                console.error("Failed to copy text:", error);
              }
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Share this ID with others to let them join your session
        </p>
      </div>

      <div className="flex justify-between mt-2">
        <IconButton
          icon={<IconX size={20} />}
          label="Cancel"
          onClick={onCancel}
          disabled={isInitializing || isConnecting}
        />

        {(errorMessage || isConnecting) && (
          <IconButton
            icon={<IconRefresh size={20} />}
            label="Reset Connection"
            onClick={onReset}
            disabled={isInitializing || isConnecting}
          />
        )}
      </div>
    </div>
  );
}
