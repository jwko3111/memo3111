import Link from "next/link";
import type { Memo, MemoLabel } from "@/lib/memos";
import { Icon } from "./Icon";

// 왼쪽 칸 색은 메모의 색 라벨이다 (Figma 컴포넌트 Memo/Item의 Label 변형)
const TILE: Record<MemoLabel, string> = {
  blue: "bg-(--label-blue-soft) text-(--label-blue)",
  green: "bg-(--label-green-soft) text-(--label-green)",
  orange: "bg-(--label-orange-soft) text-(--label-orange)",
  pink: "bg-(--label-pink-soft) text-(--label-pink)",
};

// 누르면 메모 상세로 이동한다
export function MemoItem({ id, title, preview, date, label }: Memo) {
  return (
    <Link
      href={`/memo/${id}`}
      className="flex h-[72px] w-full items-center gap-(--space-16) px-(--space-20) py-(--space-12) text-left"
    >
      <span
        className={`flex size-[44px] shrink-0 items-center justify-center rounded-(--radius-sm) ${TILE[label]}`}
      >
        <Icon name="note" size={22} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-(--space-4)">
        <span className="title-md text-(--text-primary)">{title}</span>
        <span className="body-sm truncate text-(--text-secondary)">
          {preview}
        </span>
      </span>
      <span className="caption-sm shrink-0 whitespace-nowrap text-(--text-muted)">
        {date}
      </span>
    </Link>
  );
}
