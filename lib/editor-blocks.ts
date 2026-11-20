import type { BodyBlock, TextPart } from "./memos";

// 편집기(contentEditable)의 내용 ↔ 저장용 구조(BodyBlock[])
// 저장할 때 HTML을 그대로 저장하지 않고 대제목·소제목·문단·목록·굵게만 뽑아 둔다.

function isBoldElement(el: Element): boolean {
  const tag = el.nodeName;
  if (tag === "B" || tag === "STRONG") return true;
  const weight = (el as HTMLElement).style?.fontWeight;
  return weight === "bold" || Number(weight) >= 600;
}

function normalizeParts(parts: TextPart[]): TextPart[] {
  const merged: TextPart[] = [];
  for (const p of parts) {
    const text = p.text.replace(/ /g, " ").replace(/[\r\n]+/g, " ");
    if (!text) continue;
    const last = merged[merged.length - 1];
    if (last && !!last.bold === !!p.bold) last.text += text;
    else merged.push({ text, bold: p.bold ? true : undefined });
  }
  if (merged.length > 0) {
    merged[0].text = merged[0].text.replace(/^\s+/, "");
    merged[merged.length - 1].text = merged[merged.length - 1].text.replace(/\s+$/, "");
  }
  return merged.filter((p) => p.text.length > 0);
}

export function domToBlocks(root: HTMLElement): BodyBlock[] {
  const blocks: BodyBlock[] = [];
  let parts: TextPart[] = [];

  const flush = () => {
    const normalized = normalizeParts(parts);
    parts = [];
    if (normalized.some((p) => p.text.trim().length > 0)) {
      blocks.push({ type: "paragraph", parts: normalized });
    }
  };

  const walk = (node: Node, bold: boolean) => {
    if (node.nodeType === Node.TEXT_NODE) {
      parts.push({ text: node.nodeValue ?? "", bold });
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    switch (el.nodeName) {
      case "BR":
        flush();
        return;
      case "H1":
      case "H2": {
        flush();
        const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
        if (text) blocks.push({ type: "heading", text });
        return;
      }
      case "H3":
      case "H4":
      case "H5":
      case "H6": {
        flush();
        const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
        if (text) blocks.push({ type: "subheading", text });
        return;
      }
      case "UL":
      case "OL": {
        flush();
        const items = Array.from(el.children)
          .map((li) => (li.textContent ?? "").replace(/\s+/g, " ").trim())
          .filter(Boolean);
        if (items.length > 0) blocks.push({ type: "list", items });
        return;
      }
      case "P":
      case "DIV":
        flush();
        el.childNodes.forEach((c) => walk(c, bold));
        flush();
        return;
      default: {
        const next = bold || isBoldElement(el);
        el.childNodes.forEach((c) => walk(c, next));
      }
    }
  };

  root.childNodes.forEach((c) => walk(c, false));
  flush();
  return blocks;
}

// 저장된 구조를 편집기에 다시 채운다 (textContent만 써서 HTML이 끼어들 수 없다)
export function blocksToDom(root: HTMLElement, blocks: BodyBlock[]) {
  root.replaceChildren();
  for (const block of blocks) {
    if (block.type === "heading" || block.type === "subheading") {
      const el = document.createElement(block.type === "heading" ? "h2" : "h3");
      el.textContent = block.text;
      root.appendChild(el);
    } else if (block.type === "paragraph") {
      const p = document.createElement("p");
      for (const part of block.parts) {
        if (part.bold) {
          const b = document.createElement("b");
          b.textContent = part.text;
          p.appendChild(b);
        } else {
          p.appendChild(document.createTextNode(part.text));
        }
      }
      root.appendChild(p);
    } else {
      const ul = document.createElement("ul");
      for (const item of block.items) {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      }
      root.appendChild(ul);
    }
  }
}
