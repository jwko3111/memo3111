import { ButtonPrimary } from "@/components/ButtonPrimary";
import { FilterChips } from "@/components/FilterChips";
import { MemoCard } from "@/components/MemoCard";
import { MemoCount } from "@/components/MemoCount";
import { RecentMemoCard } from "@/components/RecentMemoCard";
import { PINNED_MEMOS } from "@/lib/memos";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-(--space-16) px-(--space-16) pt-(--space-64) pb-(--space-34)">
      <div className="flex flex-1 flex-col gap-(--space-16)">
        <header className="flex flex-col gap-(--space-8) px-(--space-8)">
          <p className="caption-md text-(--text-muted)">10월 30일 금요일</p>
          <h1 className="heading-xl text-(--text-primary)">
            오늘까지 메모를
            <br />
            <MemoCount /> 남겼어요
          </h1>
        </header>
        <FilterChips />
        <MemoCard title="고정한 메모" pin memos={PINNED_MEMOS} />
        <RecentMemoCard />
      </div>
      <ButtonPrimary label="새 메모 쓰기" icon href="/write" />
    </main>
  );
}
