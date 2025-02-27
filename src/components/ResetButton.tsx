export interface ResetButtonProps {
  reset: () => void;
}

export default function ResetButton({ reset }: ResetButtonProps) {
  const onClick = () => {
    reset();
  };

  return <button onClick={onClick}>Reset</button>;
}
