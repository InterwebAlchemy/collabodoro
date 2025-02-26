export interface PauseButtonProps {
  pause: () => void;
  isPaused: boolean;
}

export default function PauseButton({ pause, isPaused }: PauseButtonProps) {
  return <button onClick={pause}>{isPaused ? "Resume" : "Pause"}</button>;
}
