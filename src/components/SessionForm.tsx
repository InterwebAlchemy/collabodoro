import HostSessionForm from "./HostSessionForm";
import JoinSessionForm from "./JoinSessionForm";
import { FormMode } from "./ConnectionOptions";

/**
 * Props for the SessionForm component
 */
export interface SessionFormProps {
  formMode: FormMode;
  isHost: boolean;
  peerId: string | null;
  isConnecting: boolean;
  isInitializing: boolean;
  errorMessage: string | null;
  isHosting: boolean;
  onJoin: (remotePeerId: string) => void;
  onCancel: () => void;
  onReset: (connectType?: "host" | "join") => void;
  onClose: () => void;
}

/**
 * Combined form that renders either a host form or join form based on peer ID
 */
export default function SessionForm({
  formMode,
  isConnecting,
  isInitializing,
  errorMessage,
  onJoin,
  onCancel,
  onReset,
  onClose,
}: SessionFormProps) {
  if (formMode === FormMode.HOST) {
    return (
      <HostSessionForm
        isConnecting={isConnecting}
        errorMessage={errorMessage}
        onClose={onClose}
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
        onClose={onClose}
        onCancel={onCancel}
        onReset={onReset}
      />
    );
  }
}
