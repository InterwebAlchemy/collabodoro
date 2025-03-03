"use client";

import IconButton from "./IconButton";
import {
  IconRefresh,
  IconClipboard,
  IconShare2,
  IconPlugConnectedX,
  IconX,
} from "@tabler/icons-react";

import ConnectionStatus from "./ConnectionStatus";
import { usePeer } from "../contexts/PeerContext";
import { APPLICATION_URL } from "../constants/url";

/**
 * Props for the HostSessionForm component
 */
export interface HostSessionFormProps {
  isConnecting: boolean;
  errorMessage: string | null;
  onCancel: () => void;
  onReset: (connectType?: "host" | "join") => void;
  onClose: () => void;
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
  isConnecting,
  errorMessage,
  onCancel,
  onReset,
  onClose,
}: HostSessionFormProps) {
  const { isHosting, isPeerReady, peerId, isInitializing } = usePeer();
  const shareUrl = new URL(APPLICATION_URL);

  const isReady = isPeerReady && !isInitializing;

  if (peerId) {
    shareUrl.searchParams.set("join", peerId);
  }

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
        <p className="text-sm text-gray-600">Join Link</p>
        <div className="flex gap-2 items-center">
          <code
            className={`p-2 rounded text-sm flex-1 overflow-x-auto border border-[var(--btn-border-color)]${
              !isReady ? " animate-pulse text-gray-500 border-gray-500" : ""
            }`}
          >
            {isReady ? shareUrl.toString() : "Generating Session ID..."}
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
            buttonClasses={
              !isReady ? "opacity-50 border-gray-500 text-gray-500" : ""
            }
            disabled={!isReady}
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
              disabled={!isReady}
              buttonClasses={
                !isReady ? "opacity-50 border-gray-500 text-gray-500" : ""
              }
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
          <code
            className={`p-2 rounded text-sm flex-1 overflow-x-auto border border-[var(--btn-border-color)]${
              !isReady ? " animate-pulse text-gray-500 border-gray-500" : ""
            }`}
          >
            {isReady ? peerId?.trim() : "Generating Session ID..."}
          </code>
          <IconButton
            icon={<IconClipboard size={20} />}
            label="Copy to clipboard"
            onClick={() => {
              try {
                navigator.clipboard.writeText(peerId?.trim() ?? "");
              } catch (error) {
                console.error("Failed to copy text:", error);
              }
            }}
            buttonClasses={
              !isReady ? "opacity-50 border-gray-500 text-gray-500" : ""
            }
            disabled={!isReady}
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
              disabled={!isReady}
              buttonClasses={
                !isReady ? "opacity-50 border-gray-500 text-gray-500" : ""
              }
            />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Users can join your session with this ID.
        </p>
      </div>

      <div className="flex justify-between mt-2">
        <IconButton
          icon={
            isHosting ? (
              <IconPlugConnectedX size={20} />
            ) : (
              <IconRefresh size={20} />
            )
          }
          label={isHosting ? "Disconnect" : "Reset Connection"}
          onClick={() => {
            if (isHosting) {
              onCancel();
            } else {
              onReset("host");
            }
          }}
          disabled={!isReady}
          buttonClasses="hover:ring-red-500 hover:color-red-500"
        />

        {(errorMessage || isConnecting) && (
          <IconButton
            icon={<IconRefresh size={20} />}
            label="Reset Connection"
            onClick={() => {
              onReset("host");
            }}
            disabled={!isReady}
          />
        )}
      </div>
    </div>
  );
}
