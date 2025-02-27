interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  buttonClasses?: string;
}

export default function IconButton({
  icon,
  label,
  onClick,
  buttonClasses,
}: IconButtonProps) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={`flex gap-1 items-center align-middle border border-solid p-2 rounded-md border-[var(--btn-border-color)] hover:ring-2 hover:ring-[var(--btn-border-color)] transition-all duration-300 ${buttonClasses}`}
    >
      {icon}
      <span className="text-lg sr-only">{label}</span>
    </button>
  );
}
