"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORIES,
  addSavedMemo,
  clearDraft,
  newMemoId,
  readDraft,
  writeDraft,
} from "@/lib/local-memos";
import { blocksToDom, domToBlocks } from "@/lib/editor-blocks";
import type { MemoLabel } from "@/lib/memos";
import { ButtonFormat } from "./ButtonFormat";
import { ButtonPrimary } from "./ButtonPrimary";
import { Chip } from "./Chip";
import { IconButton } from "./IconButton";

// 색 라벨 고르기 (Figma 컴포넌트 Label/Dot)
const COLORS: { label: MemoLabel; name: string; dot: string }[] = [
  { label: "blue", name: "파랑", dot: "bg-(--label-blue)" },
  { label: "green", name: "초록", dot: "bg-(--label-green)" },
  { label: "orange", name: "주황", dot: "bg-(--label-orange)" },
  { label: "pink", name: "분홍", dot: "bg-(--label-pink)" },
];

const NO_FORMAT = { bold: false, heading: false, subheading: false, list: false };

function NavBar({ saved }: { saved: boolean }) {
  return (
    <nav className="flex items-center justify-between">
      <IconButton icon="chevron-left" label="뒤로가기" href="/" />
      <p aria-live="polite" className="caption-sm whitespace-nowrap text-(--text-muted)">
        {saved ? "자동 저장됨" : ""}
      </p>
    </nav>
  );
}

const SCREEN =
  "mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-(--space-16) px-(--space-16) pt-(--space-48) pb-(--space-34)";

function MemoEditorForm() {
  const router = useRouter();
  // 브라우저에서만 만들어지므로 저장소를 바로 읽어도 된다 (아래 WriteScreen 참고)
  const [draft] = useState(readDraft);

  const [title, setTitle] = useState(draft?.title ?? "");
  const [category, setCategory] = useState<string>(draft?.category ?? CATEGORIES[0]);
  const [label, setLabel] = useState<MemoLabel>(draft?.label ?? "blue");
  const [format, setFormat] = useState(NO_FORMAT);
  const [bodyEmpty, setBodyEmpty] = useState(!draft || draft.body.length === 0);
  const [bodyVersion, setBodyVersion] = useState(0);
  const [draftSaved, setDraftSaved] = useState(false);
  const [error, setError] = useState("");

  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const savedRef = useRef(false); // 저장하기를 누른 뒤엔 초안을 다시 쓰지 않는다

  // 초안이 있으면 본문을 채운다
  useEffect(() => {
    if (draft && bodyRef.current) blocksToDom(bodyRef.current, draft.body);
  }, [draft]);

  // 커서가 있는 곳의 서식을 서식 막대에 보여 준다 (Button/Format의 Active)
  const updateFormat = useCallback(() => {
    const root = bodyRef.current;
    const sel = window.getSelection();
    if (!root || !sel || sel.rangeCount === 0 || !root.contains(sel.anchorNode)) return;
    let heading = false;
    let subheading = false;
    let list = false;
    for (let n: Node | null = sel.anchorNode; n && n !== root; n = n.parentNode) {
      if (n.nodeName === "H2") heading = true;
      if (n.nodeName === "H3") subheading = true;
      if (n.nodeName === "LI" || n.nodeName === "UL") list = true;
    }
    setFormat({
      bold: !heading && !subheading && document.queryCommandState("bold"),
      heading,
      subheading,
      list,
    });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", updateFormat);
    return () => document.removeEventListener("selectionchange", updateFormat);
  }, [updateFormat]);

  const onBodyChange = useCallback(() => {
    const root = bodyRef.current;
    if (!root) return;
    setBodyEmpty((root.textContent ?? "").trim() === "" && !root.querySelector("li"));
    setBodyVersion((v) => v + 1);
    setError("");
  }, []);

  const run = (command: string, value?: string) => {
    bodyRef.current?.focus();
    document.execCommand(command, false, value);
    onBodyChange();
    updateFormat();
  };

  // 자동 저장: 바꾼 뒤 잠깐 쉬면 초안으로 저장한다
  useEffect(() => {
    const timer = setTimeout(() => {
      if (savedRef.current) return;
      const body = bodyRef.current ? domToBlocks(bodyRef.current) : [];
      if (!title.trim() && body.length === 0) {
        clearDraft();
        setDraftSaved(false);
        return;
      }
      setDraftSaved(writeDraft({ title, category, label, body }));
    }, 500);
    return () => clearTimeout(timer);
  }, [title, category, label, bodyVersion]);

  const onSave = () => {
    if (!title.trim()) {
      setError("제목을 입력해 주세요.");
      titleRef.current?.focus();
      return;
    }
    const body = bodyRef.current ? domToBlocks(bodyRef.current) : [];
    const ok = addSavedMemo({
      id: newMemoId(),
      title: title.trim(),
      category,
      label,
      body,
      createdAt: Date.now(),
    });
    if (!ok) {
      setError("이 브라우저에 저장하지 못했어요. 저장 공간이 막혀 있는지 확인해 주세요.");
      return;
    }
    savedRef.current = true;
    clearDraft();
    router.push("/");
  };

  return (
    <main className={SCREEN}>
      <NavBar saved={draftSaved} />

      <div className="flex flex-1 flex-col gap-(--space-12)">
        {/* 제목 입력 칸 (Input/Field) */}
        <label className="flex flex-col gap-(--space-4) rounded-(--radius-lg) bg-(--surface-card) px-(--space-20) py-(--space-16) focus-within:inset-ring-2 focus-within:inset-ring-(--color-primary)">
          <span className="caption-sm text-(--text-muted)">제목</span>
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
            placeholder="제목을 입력하세요"
            className="title-md w-full bg-transparent text-(--text-primary) outline-none placeholder:text-(--text-muted)"
          />
        </label>

        <div className="flex flex-col gap-(--space-12) px-(--space-8) py-(--space-4)">
          <div role="group" aria-label="분류" className="flex items-center gap-(--space-8)">
            <span className="caption-sm whitespace-nowrap text-(--text-muted)">분류</span>
            {CATEGORIES.map((c) => (
              <Chip key={c} label={c} selected={category === c} onClick={() => setCategory(c)} />
            ))}
          </div>
          <div role="group" aria-label="색" className="flex items-center gap-(--space-8)">
            <span className="caption-sm whitespace-nowrap text-(--text-muted)">색</span>
            {COLORS.map((c) => (
              <button
                key={c.label}
                type="button"
                aria-label={c.name}
                aria-pressed={label === c.label}
                onClick={() => setLabel(c.label)}
                className={`flex size-[32px] shrink-0 items-center justify-center rounded-(--radius-full) border-2 ${
                  label === c.label ? "border-(--color-primary)" : "border-transparent"
                }`}
              >
                <span className={`size-[22px] rounded-(--radius-full) ${c.dot}`} />
              </button>
            ))}
          </div>
        </div>

        {/* 본문 편집기 (Editor/Toolbar + 본문) */}
        <div className="flex flex-col overflow-clip rounded-(--radius-lg) border-2 border-transparent bg-(--surface-card) focus-within:border-(--color-primary)">
          <div role="toolbar" aria-label="서식" className="flex h-[52px] items-center gap-(--space-4) px-(--space-12)">
            <ButtonFormat label="B" title="굵게" active={format.bold} onClick={() => run("bold")} />
            <ButtonFormat
              label="제목"
              title="제목"
              active={format.heading}
              onClick={() => run("formatBlock", format.heading ? "<p>" : "<h2>")}
            />
            <ButtonFormat
              label="소제목"
              title="소제목"
              active={format.subheading}
              onClick={() => run("formatBlock", format.subheading ? "<p>" : "<h3>")}
            />
            <ButtonFormat
              label="목록"
              title="목록"
              active={format.list}
              onClick={() => run("insertUnorderedList")}
            />
          </div>
          <div className="h-px bg-(--border-default)" />
          <div className="relative px-(--space-20) py-(--space-16)">
            {bodyEmpty && (
              <p
                aria-hidden
                className="body-md pointer-events-none absolute text-(--text-muted)"
              >
                내용을 입력하세요
              </p>
            )}
            <div
              ref={bodyRef}
              role="textbox"
              aria-multiline="true"
              aria-label="본문"
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              className="editor-body min-h-[160px] outline-none"
              onFocus={() => document.execCommand("defaultParagraphSeparator", false, "p")}
              onInput={onBodyChange}
              onKeyUp={updateFormat}
              onMouseUp={updateFormat}
              onPaste={(e) => {
                // 다른 곳의 서식이 딸려 오지 않게 글자만 붙인다
                e.preventDefault();
                document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
              }}
            />
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="caption-md text-center text-(--label-pink)">
          {error}
        </p>
      )}
      <ButtonPrimary label="저장하기" onClick={onSave} />
    </main>
  );
}

const noopSubscribe = () => () => {};

// 저장소는 브라우저에서만 읽을 수 있어서, 브라우저에서 화면이 이어진 뒤에 편집기를 만든다.
export function WriteScreen() {
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  if (!isClient) {
    return (
      <main className={SCREEN}>
        <NavBar saved={false} />
      </main>
    );
  }
  return <MemoEditorForm />;
}
