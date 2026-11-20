import Link from "next/link";
import { Icon } from "./Icon";

type IconButtonProps = {
  icon: "chevron-left" | "pin-24" | "share" | "more";
  label: string; // 스크린 리더용 이름
  href?: string; // 있으면 링크로 동작한다
  className?: string; // 아이콘 색은 글자색을 따른다
};

// Figma 컴포넌트 Button/Icon: 40×40 누르는 영역 가운데에 24px 아이콘
export function IconButton({ icon, label, href, className }: IconButtonProps) {
  const classes = `flex size-[40px] shrink-0 items-center justify-center rounded-(--radius-sm) text-(--text-primary) ${className ?? ""}`;
  const content = <Icon name={icon} size={24} />;
  if (href) {
    return (
      <Link href={href} aria-label={label} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} className={classes}>
      {content}
    </button>
  );
}
