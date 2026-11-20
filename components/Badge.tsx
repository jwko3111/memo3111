import type { MemoLabel } from "@/lib/memos";

// 분류 배지. 색은 메모의 색 라벨을 따른다 (Figma 컴포넌트 Badge)
const COLOR: Record<MemoLabel, string> = {
  blue: "bg-(--label-blue-soft) text-(--label-blue)",
  green: "bg-(--label-green-soft) text-(--label-green)",
  orange: "bg-(--label-orange-soft) text-(--label-orange)",
  pink: "bg-(--label-pink-soft) text-(--label-pink)",
};

export function Badge({ label, children }: { label: MemoLabel; children: string }) {
  return (
    <span
      className={`caption-sm flex h-[26px] items-center whitespace-nowrap rounded-(--radius-full) px-(--space-8) ${COLOR[label]}`}
    >
      {children}
    </span>
  );
}
