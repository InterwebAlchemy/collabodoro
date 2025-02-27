"use client";

import { useTimer } from "../contexts/TimerContext";

export interface ResetButtonProps {
  className?: string;
}

export default function ResetButton({ className }: ResetButtonProps) {
  const { handleReset } = useTimer();

  const onClick = () => {
    handleReset();
  };

  return (
    <button onClick={onClick} className={className}>
      Reset
    </button>
  );
}
