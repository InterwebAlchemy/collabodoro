"use client";

export interface StartButtonProps {
  isRunning: boolean;
  start: () => void;
}

export default function StartButton({ start, isRunning }: StartButtonProps) {
  const onClick = () => {
    start();
  };

  return <button onClick={onClick}>{isRunning ? "Stop" : "Start"}</button>;
}
