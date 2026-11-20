import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { IconButton } from "@/components/IconButton";
import { LocalMemoArticle } from "@/components/LocalMemoArticle";
import { ARTICLE_CARD, MemoArticleView } from "@/components/MemoArticleView";
import { MEMOS, getMemo } from "@/lib/memos";

export function generateStaticParams() {
  return MEMOS.map((memo) => ({ id: memo.id }));
}

// params는 요청이 와야 알 수 있는 값이라 Suspense 안에서 읽는다
async function MemoArticle({ params }: { params: PageProps<"/memo/[id]">["params"] }) {
  const { id } = await params;
  const memo = getMemo(id);
  if (memo) return <MemoArticleView memo={memo} />;
  // 이 브라우저에서 새로 저장한 메모(local-로 시작)는 브라우저에서 읽는다
  if (id.startsWith("local-")) return <LocalMemoArticle id={id} />;
  notFound();
}

export default function MemoDetailPage({ params }: PageProps<"/memo/[id]">) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-(--space-16) px-(--space-16) pt-(--space-48) pb-(--space-34)">
      <nav className="flex items-center justify-between">
        <IconButton icon="chevron-left" label="뒤로가기" href="/" />
        <div className="flex items-start">
          <IconButton icon="pin-24" label="고정" className="text-(--color-primary)" />
          <IconButton icon="share" label="공유" />
          <IconButton icon="more" label="더보기" />
        </div>
      </nav>
      <div className="flex flex-1 flex-col">
        <Suspense fallback={<div className={ARTICLE_CARD} />}>
          <MemoArticle params={params} />
        </Suspense>
      </div>
      <ButtonPrimary label="수정하기" />
    </main>
  );
}
