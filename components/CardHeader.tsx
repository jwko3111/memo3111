import { Icon } from "./Icon";

type CardHeaderProps = {
  title: string;
  pin?: boolean;
  action?: boolean;
};

// Figma 컴포넌트 Card/Header: pin을 켜면 고정 표시, action을 켜면 오른쪽에 전체 보기
export function CardHeader({ title, pin = false, action = false }: CardHeaderProps) {
  return (
    <div className="flex h-[40px] items-center gap-(--space-4) pt-(--space-12) pr-(--space-16) pb-(--space-4) pl-(--space-20)">
      {pin && <Icon name="pin" size={16} className="text-(--color-primary)" />}
      <h2 className="label-md min-w-0 flex-1 text-(--text-primary)">{title}</h2>
      {action && (
        <button
          type="button"
          className="caption-md flex shrink-0 items-center gap-(--space-4) whitespace-nowrap text-(--text-muted)"
        >
          전체 보기
          <Icon name="chevron-right" size={16} />
        </button>
      )}
    </div>
  );
}
