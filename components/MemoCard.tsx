import { CardHeader } from "./CardHeader";
import type { Memo } from "@/lib/memos";
import { MemoItem } from "./MemoItem";

type MemoCardProps = {
  title: string;
  pin?: boolean;
  action?: boolean;
  memos: Memo[];
};

// 머리글 + 메모 줄을 담는 흰 카드
export function MemoCard({ title, pin, action, memos }: MemoCardProps) {
  return (
    <section className="flex flex-col rounded-(--radius-xl) bg-(--surface-card) py-(--space-8)">
      <CardHeader title={title} pin={pin} action={action} />
      {memos.map((memo) => (
        <MemoItem key={memo.id} {...memo} />
      ))}
    </section>
  );
}
