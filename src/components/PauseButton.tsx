"use client";

import { useTimer } from "../contexts/TimerContext";

export interface PauseButtonProps {
  className?: string;
}

export default function PauseButton({ className }: PauseButtonProps) {
  const { handlePause, isPaused } = useTimer();

  return (
    <button onClick={handlePause} className={className}>
      {isPaused ? "Resume" : "Pause"}
    </button>
  );
}
