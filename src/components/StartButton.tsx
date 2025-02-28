"use client";
import {
  IconDeviceWatchStats2,
  IconDeviceWatchCancel,
} from "@tabler/icons-react";
import IconButton from "./IconButton";
import { useTimer } from "../contexts/TimerContext";

export default function StartButton(): React.ReactElement {
  const { handleStart, isRunning } = useTimer();

  const onClick = () => {
    handleStart();
  };

  return (
    <IconButton
      icon={isRunning ? <IconDeviceWatchCancel /> : <IconDeviceWatchStats2 />}
      label={isRunning ? "Stop" : "Start"}
      onClick={onClick}
      buttonClasses={!isRunning ? "p-4" : ""}
    />
  );
}
