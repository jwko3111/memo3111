"use client";

import { toListMemo, useSavedMemos } from "@/lib/local-memos";
import { RECENT_MEMOS } from "@/lib/memos";
import { MemoCard } from "./MemoCard";

// 이 브라우저에 저장한 메모가 가장 위에, 그 아래에 기본 메모가 보인다
export function RecentMemoCard() {
  const saved = useSavedMemos();
  const memos = [...(saved ?? []).map(toListMemo), ...RECENT_MEMOS];
  return <MemoCard title="최근 메모" action memos={memos} />;
}
