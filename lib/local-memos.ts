import { useMemo, useSyncExternalStore } from "react";
import type { BodyBlock, Memo, MemoDetail, MemoLabel, TextPart } from "./memos";

// 이 브라우저(localStorage)에 저장하는 메모와 임시 저장(초안)

export const CATEGORIES = ["업무", "개인", "아이디어"] as const;
export const LABELS: MemoLabel[] = ["blue", "green", "orange", "pink"];

export type StoredMemo = {
  id: string;
  title: string;
  category: string;
  label: MemoLabel;
  body: BodyBlock[];
  createdAt: number;
};

export type Draft = {
  title: string;
  category: string;
  label: MemoLabel;
  body: BodyBlock[];
};

const SAVED_KEY = "memo.saved.v1";
const DRAFT_KEY = "memo.draft.v1";
const EVENT = "memo-storage";

// ---------- 저장소 읽기·쓰기 ----------

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

// 저장 공간을 못 쓰는 경우(시크릿 모드, 용량 초과 등)엔 false
function writeRaw(key: string, value: string | null): boolean {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
    window.dispatchEvent(new Event(EVENT));
    return true;
  } catch {
    return false;
  }
}

// ---------- 값 검사 (저장된 값은 믿지 않고 걸러서 쓴다) ----------

function sanitizeParts(value: unknown): TextPart[] {
  if (!Array.isArray(value)) return [];
  const parts: TextPart[] = [];
  for (const p of value) {
    if (p && typeof p === "object" && typeof (p as TextPart).text === "string") {
      parts.push({ text: (p as TextPart).text, bold: (p as TextPart).bold === true });
    }
  }
  return parts;
}

export function sanitizeBlocks(value: unknown): BodyBlock[] {
  if (!Array.isArray(value)) return [];
  const blocks: BodyBlock[] = [];
  for (const b of value) {
    if (!b || typeof b !== "object") continue;
    const block = b as Record<string, unknown>;
    if ((block.type === "heading" || block.type === "subheading") && typeof block.text === "string") {
      blocks.push({ type: block.type, text: block.text });
    } else if (block.type === "paragraph") {
      blocks.push({ type: "paragraph", parts: sanitizeParts(block.parts) });
    } else if (block.type === "list" && Array.isArray(block.items)) {
      blocks.push({
        type: "list",
        items: block.items.filter((i): i is string => typeof i === "string"),
      });
    }
  }
  return blocks;
}

function asLabel(v: unknown): MemoLabel {
  return LABELS.includes(v as MemoLabel) ? (v as MemoLabel) : "blue";
}

function asCategory(v: unknown): string {
  return typeof v === "string" && (CATEGORIES as readonly string[]).includes(v) ? v : CATEGORIES[0];
}

function parseSaved(raw: string): StoredMemo[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const memos: StoredMemo[] = [];
    for (const m of data) {
      if (!m || typeof m !== "object") continue;
      const r = m as Record<string, unknown>;
      if (typeof r.id !== "string" || typeof r.title !== "string" || typeof r.createdAt !== "number") continue;
      memos.push({
        id: r.id,
        title: r.title,
        category: asCategory(r.category),
        label: asLabel(r.label),
        body: sanitizeBlocks(r.body),
        createdAt: r.createdAt,
      });
    }
    return memos;
  } catch {
    return [];
  }
}

// ---------- 저장된 메모 ----------

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

// 서버에서는 null(아직 모름), 브라우저에서는 저장된 메모 목록(새것이 앞)
export function useSavedMemos(): StoredMemo[] | null {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(SAVED_KEY) ?? "",
    () => null,
  );
  return useMemo(() => (raw === null ? null : parseSaved(raw)), [raw]);
}

export function addSavedMemo(memo: StoredMemo): boolean {
  const current = parseSaved(readRaw(SAVED_KEY) ?? "");
  return writeRaw(SAVED_KEY, JSON.stringify([memo, ...current]));
}

export function newMemoId(): string {
  return `local-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

// ---------- 초안(자동 저장) ----------

export function readDraft(): Draft | null {
  const raw = readRaw(DRAFT_KEY);
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as Record<string, unknown>;
    return {
      title: typeof d.title === "string" ? d.title : "",
      category: asCategory(d.category),
      label: asLabel(d.label),
      body: sanitizeBlocks(d.body),
    };
  } catch {
    return null;
  }
}

export function writeDraft(draft: Draft): boolean {
  return writeRaw(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  writeRaw(DRAFT_KEY, null);
}

// ---------- 화면에 보일 모양으로 바꾸기 ----------

const pad = (n: number) => String(n).padStart(2, "0");

function dayWord(ts: number, now = new Date()): string {
  const d = new Date(ts);
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOf(now) - startOf(d)) / 86_400_000);
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function clock(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  return `${h < 12 ? "오전" : "오후"} ${h % 12 === 0 ? 12 : h % 12}:${pad(d.getMinutes())}`;
}

function blockText(block: BodyBlock): string {
  switch (block.type) {
    case "heading":
    case "subheading":
      return block.text;
    case "paragraph":
      return block.parts.map((p) => p.text).join("");
    case "list":
      return block.items.join(" ");
  }
}

// 목록에 보일 미리보기: 첫 문단이나 목록, 없으면 첫 제목
function previewOf(body: BodyBlock[]): string {
  const first = body.find((b) => b.type === "paragraph" || b.type === "list") ?? body[0];
  return first ? blockText(first).replace(/\s+/g, " ").trim() : "";
}

export function toListMemo(s: StoredMemo): Memo {
  return {
    id: s.id,
    title: s.title,
    preview: previewOf(s.body),
    date: dayWord(s.createdAt),
    label: s.label,
  };
}

export function toDetail(s: StoredMemo): MemoDetail {
  const text = s.body.map(blockText).join("");
  return {
    ...toListMemo(s),
    category: s.category,
    createdAt: `${new Date(s.createdAt).getMonth() + 1}월 ${new Date(s.createdAt).getDate()}일 ${clock(s.createdAt)}`,
    editedAt: `${dayWord(s.createdAt)} ${clock(s.createdAt)}`,
    charCount: text.replace(/\s/g, "").length,
    body: s.body,
  };
}
