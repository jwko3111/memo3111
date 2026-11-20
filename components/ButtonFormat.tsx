type ButtonFormatProps = {
  label: string;
  title: string; // 스크린 리더용 설명
  active: boolean;
  onClick: () => void;
};

// Figma 컴포넌트 Button/Format (State=Default / Active)
// 누를 때 글자 선택이 풀리지 않도록 마우스를 눌렀을 때의 초점 이동을 막는다.
export function ButtonFormat({ label, title, active, onClick }: ButtonFormatProps) {
  return (
    <button
      type="button"
      aria-label={title}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`label-md flex h-[36px] items-center justify-center whitespace-nowrap rounded-(--radius-sm) px-(--space-12) ${
        active
          ? "bg-(--label-blue-soft) text-(--color-primary)"
          : "text-(--text-secondary)"
      }`}
    >
      {label}
    </button>
  );
}
