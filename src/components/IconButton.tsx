interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: (() => void) | (() => Promise<void>);
  disabled?: boolean;
  buttonClasses?: string;
  labelClasses?: string;
  showLabel?: boolean;
}

export default function IconButton({
  icon,
  label,
  onClick,
  buttonClasses,
  labelClasses,
  disabled = false,
  showLabel = false,
}: IconButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick?.();
    }
  };

  return (
    <button
      title={label}
      onClick={handleClick}
      className={`flex gap-2 items-center align-middle border border-solid p-2 rounded-md border-[var(--btn-border-color)] hover:ring-2 hover:ring-[var(--btn-border-color)] transition-[border-color,box-shadow] duration-300 ${buttonClasses} md:disabled:pointer-events-none md:disabled:opacity-50`}
      disabled={disabled}
    >
      {icon}
      <span
        className={`text-gray-500 ${
          !showLabel ? "sr-only" : ""
        } ${labelClasses}`}
      >
        {label}
      </span>
    </button>
  );
}
