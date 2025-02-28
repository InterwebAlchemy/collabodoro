import React from "react";
import HostSessionForm from "./HostSessionForm";
import JoinSessionForm from "./JoinSessionForm";

/**
 * Props for the SessionForm component
 */
export interface SessionFormProps {
  peerId: string | null;
  isConnecting: boolean;
  isInitializing: boolean;
  errorMessage: string | null;
  onJoin: (remotePeerId: string) => void;
  onCancel: () => void;
  onReset: () => void;
}

/**
 * Combined form that renders either a host form or join form based on peer ID
 */
export default function SessionForm({
  peerId,
  isConnecting,
  isInitializing,
  errorMessage,
  onJoin,
  onCancel,
  onReset,
}: SessionFormProps) {
  if (peerId || isInitializing) {
    return (
      <HostSessionForm
        peerId={peerId ?? "Starting session..."}
        isConnecting={isConnecting}
        isInitializing={isInitializing}
        errorMessage={errorMessage}
        onCancel={onCancel}
        onReset={onReset}
      />
    );
  } else {
    return (
      <JoinSessionForm
        peerId="" // Pass empty string as this prop is required but unused in JoinSessionForm
        isConnecting={isConnecting}
        isInitializing={isInitializing}
        errorMessage={errorMessage}
        onJoin={onJoin}
        onCancel={onCancel}
        onReset={onReset}
      />
    );
  }
}
