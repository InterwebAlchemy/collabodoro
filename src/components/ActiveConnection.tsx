import React from "react";
import IconButton from "./IconButton";
import { IconPlugConnectedX } from "@tabler/icons-react";

interface ActiveConnectionProps {
  onDisconnect: () => void;
}

/**
 * Displays information about an active peer connection and disconnect option
 *
 * @param isHost - Whether the current user is hosting the session
 * @param connectedPeerId - The connected peer's ID
 * @param onDisconnect - Callback when disconnecting from the session
 * @param className - Optional additional CSS classes
 */
export default function ActiveConnection({
  onDisconnect,
}: ActiveConnectionProps) {
  return (
    <div className={`flex`}>
      <IconButton
        icon={<IconPlugConnectedX size={20} />}
        label="Disconnect"
        onClick={onDisconnect}
        buttonClasses="hover:ring-red-500 hover:color-red-500"
      />
    </div>
  );
}
