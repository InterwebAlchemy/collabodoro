"use client";

import { IconDeviceWatchStats2 } from "@tabler/icons-react";
import IconButton from "./IconButton";
import { useTimer } from "../contexts/TimerContext";

export default function ResetButton(): React.ReactElement {
  const { handleReset } = useTimer();

  const onClick = () => {
    handleReset();
  };

  return (
    <IconButton
      icon={<IconDeviceWatchStats2 />}
      label="Reset"
      onClick={onClick}
    />
  );
}
