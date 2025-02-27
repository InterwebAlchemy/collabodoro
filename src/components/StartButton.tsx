"use client";

import { useTimer } from "../contexts/TimerContext";

export interface StartButtonProps {
  className?: string;
}

export default function StartButton({ className }: StartButtonProps) {
  const { handleStart, isRunning } = useTimer();

  const onClick = () => {
    handleStart();
  };

  return (
    <button onClick={onClick} className={className}>
      {isRunning ? "Stop" : "Start"}
    </button>
  );
}
