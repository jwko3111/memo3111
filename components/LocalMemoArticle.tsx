"use client";

import { toDetail, useSavedMemos } from "@/lib/local-memos";
import { ARTICLE_CARD, MemoArticleView } from "./MemoArticleView";

// 이 브라우저에 저장한 메모의 상세. 저장소는 브라우저에서만 읽을 수 있다.
export function LocalMemoArticle({ id }: { id: string }) {
  const saved = useSavedMemos();

  if (saved === null) return <div className={ARTICLE_CARD} />; // 아직 읽는 중

  const memo = saved.find((m) => m.id === id);
  if (!memo) {
    return (
      <div className={ARTICLE_CARD}>
        <p className="body-md text-(--text-secondary)">
          이 브라우저에서 메모를 찾지 못했어요. 다른 브라우저에서 저장한 메모는 볼 수 없어요.
        </p>
      </div>
    );
  }
  return <MemoArticleView memo={toDetail(memo)} />;
}
