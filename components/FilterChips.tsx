"use client";

import { useState } from "react";
import { Chip } from "./Chip";

const CATEGORIES = ["전체", "업무", "개인", "아이디어"];

export function FilterChips() {
  const [selected, setSelected] = useState("전체");
  return (
    <div
      role="group"
      aria-label="메모 분류"
      className="flex items-start gap-(--space-8) px-(--space-4)"
    >
      {CATEGORIES.map((label) => (
        <Chip
          key={label}
          label={label}
          selected={selected === label}
          onClick={() => setSelected(label)}
        />
      ))}
    </div>
  );
}
