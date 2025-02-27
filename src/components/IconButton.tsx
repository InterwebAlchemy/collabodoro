interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export default function IconButton({ icon, label, onClick }: IconButtonProps) {
  return (
    <button
      title={label}
      onClick={onClick}
      className="flex gap-1 items-center align-middle border border-gray-200 border-solid p-2 rounded-md"
    >
      {icon}
      <span className="text-lg sr-only">{label}</span>
    </button>
  );
}
