"use client";

import { IconDeviceWatch, IconDeviceWatchPause } from "@tabler/icons-react";
import IconButton from "./IconButton";
import { useTimer } from "../contexts/TimerContext";

export default function PauseButton(): React.ReactElement {
  const { handlePause, isPaused } = useTimer();

  return (
    <IconButton
      icon={isPaused ? <IconDeviceWatch /> : <IconDeviceWatchPause />}
      label={isPaused ? "Pause" : "Resume"}
      onClick={handlePause}
    />
  );
}
