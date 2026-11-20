import type { BodyBlock, MemoDetail } from "@/lib/memos";
import { Badge } from "./Badge";

export const ARTICLE_CARD =
  "flex flex-1 flex-col gap-(--space-12) rounded-(--radius-xl) bg-(--surface-card) px-(--space-20) py-(--space-24)";

function Block({ block }: { block: BodyBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="title-lg text-(--text-primary)">{block.text}</h2>;
    case "subheading":
      return <h3 className="title-md text-(--text-primary)">{block.text}</h3>;
    case "paragraph":
      return (
        <p className="body-md text-(--text-secondary)">
          {block.parts.map((part, i) =>
            part.bold ? (
              <strong key={i} className="font-bold text-(--text-primary)">
                {part.text}
              </strong>
            ) : (
              <span key={i}>{part.text}</span>
            ),
          )}
        </p>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-(--space-4)">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="body-md flex gap-(--space-8) text-(--text-secondary)"
            >
              <span aria-hidden>•</span>
              <span className="min-w-0 flex-1">{item}</span>
            </li>
          ))}
        </ul>
      );
  }
}

// 상세 화면의 흰 카드. 기본 메모와 이 브라우저에 저장한 메모가 같이 쓴다.
export function MemoArticleView({ memo }: { memo: MemoDetail }) {
  return (
    <article className={ARTICLE_CARD}>
      <div className="flex items-center gap-(--space-8)">
        <Badge label={memo.label}>{memo.category}</Badge>
        <span className="caption-sm text-(--text-muted)">{memo.createdAt}</span>
      </div>
      <h1 className="heading-lg text-(--text-primary)">{memo.title}</h1>
      <hr className="h-px border-0 bg-(--border-default)" />
      <div className="flex flex-col gap-(--space-12)">
        {memo.body.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
      <p className="caption-sm text-(--text-muted)">
        {memo.charCount}자 · {memo.editedAt} 수정
      </p>
    </article>
  );
}
