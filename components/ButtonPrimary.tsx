import Link from "next/link";
import { Icon } from "./Icon";

type ButtonPrimaryProps = {
  label: string;
  icon?: boolean;
  href?: string; // 있으면 링크로 동작한다
  onClick?: () => void;
};

// Figma 컴포넌트 Button/Primary: 화면 아래에 가로로 꽉 차게, 스크롤돼도 아래에 붙는다
export function ButtonPrimary({ label, icon = false, href, onClick }: ButtonPrimaryProps) {
  const classes =
    "button-md sticky bottom-(--space-34) flex h-[56px] w-full shrink-0 items-center justify-center gap-(--space-8) rounded-(--radius-md) bg-(--color-primary) px-(--space-24) text-(--text-on-primary)";
  const content = (
    <>
      {icon && <Icon name="plus" size={20} />}
      {label}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
