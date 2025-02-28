interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  buttonClasses?: string;
}

export default function IconButton({
  icon,
  label,
  onClick,
  buttonClasses,
  disabled = false,
}: IconButtonProps) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={`flex gap-1 items-center align-middle border border-solid p-2 rounded-md border-[var(--btn-border-color)] hover:ring-2 hover:ring-[var(--btn-border-color)] transition-[border-color,box-shadow] duration-300 ${buttonClasses} md:disabled:pointer-events-none md:disabled:opacity-50`}
      disabled={disabled}
    >
      {icon}
      <span className="text-lg sr-only">{label}</span>
    </button>
  );
}
