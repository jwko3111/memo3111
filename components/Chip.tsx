type ChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

// Figma 컴포넌트 Chip (State=Default / Selected)
export function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`label-md h-[36px] shrink-0 whitespace-nowrap rounded-(--radius-full) px-(--space-16) ${
        selected
          ? "bg-(--color-primary) text-(--text-on-primary)"
          : "bg-(--surface-card) text-(--text-secondary)"
      }`}
    >
      {label}
    </button>
  );
}
