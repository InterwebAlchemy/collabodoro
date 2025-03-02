import React, { useRef, useState } from "react";
import { IconBroadcast, IconUsersGroup } from "@tabler/icons-react";
import { useOnClickOutside } from "usehooks-ts";

import IconButton from "./IconButton";
import SessionForm from "./SessionForm";
import { usePeer } from "@/contexts/PeerContext";

/**
 * Form display mode enum to track which form is currently visible
 */
enum FormMode {
  NONE,
  HOST,
  JOIN,
}

interface ConnectionOptionsProps {
  // Connection status props
  peerId: string | null;
  isConnecting: boolean;
  isInitializing: boolean;
  errorMessage: string | null;

  // Callbacks
  onHostSession: () => void;
  onJoinSession: (remotePeerId: string) => void;
  onCancel: () => void;
  onReset: () => void;
}

/**
 * Displays options to host or join a pomodoro session and renders the appropriate form
 *
 * @param peerId - The current user's peer ID when hosting
 * @param isConnecting - Whether connection is in progress
 * @param errorMessage - Error message to display, if any
 * @param onHostSession - Callback when user wants to host a session
 * @param onJoinSession - Callback when user wants to join with a specific peer ID
 * @param onCancel - Callback when user cancels the connection process
 * @param onReset - Callback to reset the connection
 * @param className - Optional additional CSS classes
 */
export default function ConnectionOptions({
  peerId,
  isConnecting,
  isInitializing,
  errorMessage,
  onHostSession,
  onJoinSession,
  onCancel,
  onReset,
}: ConnectionOptionsProps) {
  const { isJoining } = usePeer();
  const [formMode, setFormMode] = useState<FormMode>(FormMode.NONE);
  const formRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([formRef as React.RefObject<HTMLDivElement>], () => {
    setFormMode(FormMode.NONE);
  });

  const handleHostClick = () => {
    setFormMode(FormMode.HOST);
    onHostSession();
  };

  const handleJoinClick = () => {
    setFormMode(FormMode.JOIN);
  };

  const handleCancel = () => {
    setFormMode(FormMode.NONE);
    onCancel();
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <div className="relative flex flex-col gap-4 w-full">
      {formMode !== FormMode.NONE && (
        <div
          ref={formRef}
          className="absolute left-0 md:left-[96px] bottom-0 w-full md:max-w-[420px] bg-[var(--background)] z-10"
        >
          {/* Use SessionForm for both host and join modes */}
          <SessionForm
            peerId={formMode === FormMode.HOST ? peerId : null}
            isConnecting={isConnecting}
            isInitializing={isInitializing}
            errorMessage={errorMessage}
            onJoin={onJoinSession}
            onCancel={handleCancel}
            onReset={handleReset}
          />
        </div>
      )}
      <div className="flex flex-col gap-2 w-[86px] z-1">
        <IconButton
          icon={<IconBroadcast size={20} />}
          label="Host"
          onClick={handleHostClick}
          disabled={isJoining || isInitializing || formMode === FormMode.HOST}
          showLabel
        />
        <IconButton
          icon={<IconUsersGroup size={20} />}
          label="Join"
          onClick={handleJoinClick}
          disabled={isConnecting || formMode === FormMode.JOIN}
          showLabel
        />
      </div>
    </div>
  );
}
