"use client";

import IconButton from "./IconButton";
import {
  IconX,
  IconRefresh,
  IconClipboard,
  IconShare2,
} from "@tabler/icons-react";

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
  const shareUrl = new URL(process.env.NEXT_PUBLIC_APPLICATION_URL!);
  shareUrl.searchParams.set("join", peerId);

  const shareSessionIdData: ShareData = {
    text: `Let's share a Pomodoro session:
      
      1. Head to ${shareUrl.hostname}.
      2. Click the Join button
      3. Enter the Session ID: ${peerId}`,
  };

  const shareUrlData: ShareData = {
    title: "Join my Collabodoro",
    text: "Let's share a Pomodoro session.",
    url: shareUrl.toString(),
  };

  const canShareSessionId =
    typeof window?.navigator?.canShare === "function" &&
    window?.navigator?.canShare(shareSessionIdData);

  const canShareUrl =
    typeof window?.navigator?.canShare === "function" &&
    window?.navigator?.canShare(shareUrlData);

  return (
    <div className="flex flex-col gap-4 p-4 border border-[var(--btn-border-color)] rounded-md bg-[var(--background)]">
      <ConnectionStatus
        isConnecting={isConnecting}
        errorMessage={errorMessage}
      />

      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-600">Join Link</p>
        <div className="flex gap-2 items-center">
          <code className="p-2 rounded text-sm flex-1 overflow-x-auto border border-[var(--btn-border-color)]">
            {shareUrl.toString()}
          </code>
          <IconButton
            icon={<IconClipboard size={20} />}
            label="Copy to clipboard"
            onClick={() => {
              try {
                navigator.clipboard.writeText(shareUrl.toString());
              } catch (error) {
                console.error("Failed to copy text:", error);
              }
            }}
            disabled={isInitializing || isConnecting}
          />
          {canShareUrl && (
            <IconButton
              icon={<IconShare2 size={20} />}
              label="Share"
              onClick={async () => {
                await navigator.share(shareUrlData).catch((error) => {
                  console.error("Failed to share:", error);
                });
              }}
              disabled={isInitializing || isConnecting}
            />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Users can automatically join your session with this URL.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-600">Session ID</p>
        <div className="flex gap-2 items-center">
          <code className="p-2 rounded text-sm flex-1 overflow-x-auto border border-[var(--btn-border-color)]">
            {peerId.trim()}
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
            disabled={isInitializing || isConnecting}
          />
          {canShareSessionId && (
            <IconButton
              icon={<IconShare2 size={20} />}
              label="Share"
              onClick={async () => {
                await navigator.share(shareSessionIdData).catch((error) => {
                  console.error("Failed to share:", error);
                });
              }}
              disabled={isInitializing || isConnecting}
            />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Users can join your session with this ID.
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
