"use client";

import { useSavedMemos } from "@/lib/local-memos";

const BASE_COUNT = 128; // 시안의 기본 메모 수. 새로 저장할 때마다 하나씩 늘어난다.

export function MemoCount() {
  const saved = useSavedMemos();
  return <span className="text-(--color-primary)">{BASE_COUNT + (saved?.length ?? 0)}개</span>;
}
