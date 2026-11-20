export type MemoLabel = "blue" | "green" | "orange" | "pink";

// 홈 목록에 보이는 한 줄
export type Memo = {
  id: string;
  title: string;
  preview: string;
  date: string;
  label: MemoLabel;
};

// 본문 조각: 굵은 글씨를 섞을 수 있다
export type TextPart = { text: string; bold?: boolean };

export type BodyBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; parts: TextPart[] }
  | { type: "list"; items: string[] };

// 상세 화면에 보이는 메모
export type MemoDetail = Memo & {
  category: string;
  createdAt: string;
  editedAt: string;
  charCount: number;
  body: BodyBlock[];
};

export const MEMOS: MemoDetail[] = [
  {
    id: "design-review",
    title: "디자인 리뷰 회의록",
    preview: "검수 기준과 다음 할 일 정리",
    date: "오늘",
    label: "blue",
    category: "업무",
    createdAt: "10월 30일 오전 9:12",
    editedAt: "오늘 오전 9:12",
    charCount: 212,
    body: [
      { type: "heading", text: "회의 요약" },
      {
        type: "paragraph",
        parts: [
          { text: "시안 검수 기준을 팀 규칙으로 정리했다. 목표는 " },
          { text: "AI가 구현해도 깨지지 않는 시안", bold: true },
          { text: "이다." },
        ],
      },
      { type: "subheading", text: "결정한 것" },
      {
        type: "list",
        items: [
          "묶음은 오토레이아웃으로, 늘어날 것은 Fill",
          "색과 간격은 변수로 연결",
          "시안은 프레임 링크로 넘기기",
        ],
      },
      { type: "subheading", text: "다음 할 일" },
      {
        type: "paragraph",
        parts: [
          { text: "금요일까지", bold: true },
          { text: " 각자 맡은 화면을 채점해 온다. 점수보다 깎인 이유를 먼저 본다." },
        ],
      },
      { type: "subheading", text: "남은 질문" },
      {
        type: "paragraph",
        parts: [
          { text: "다크 모드 색은 누가 정할지, 아이콘은 직접 그릴지 다음 회의에서 정한다." },
        ],
      },
    ],
  },
  {
    id: "weekend-hike",
    title: "주말 등산 준비",
    preview: "물 두 병, 간식, 바람막이 챙기기",
    date: "어제",
    label: "green",
    category: "개인",
    createdAt: "10월 29일 오후 6:40",
    editedAt: "어제 오후 6:40",
    charCount: 150,
    body: [
      { type: "heading", text: "준비물" },
      {
        type: "paragraph",
        parts: [
          { text: "토요일 아침 7시에 출발한다. 날씨가 흐릴 수 있어 " },
          { text: "바람막이는 꼭 챙긴다.", bold: true },
        ],
      },
      { type: "subheading", text: "챙길 것" },
      { type: "list", items: ["물 두 병", "간식과 견과류", "바람막이", "여분 양말"] },
      { type: "subheading", text: "이동" },
      {
        type: "paragraph",
        parts: [{ text: "지하철로 이동해서 산 입구에서 만나기로 했다." }],
      },
    ],
  },
  {
    id: "grocery-list",
    title: "장보기 목록",
    preview: "우유, 계란, 사과, 커피 원두",
    date: "오늘",
    label: "pink",
    category: "개인",
    createdAt: "10월 30일 오전 8:05",
    editedAt: "오늘 오전 8:05",
    charCount: 140,
    body: [
      { type: "heading", text: "이번 주 장보기" },
      {
        type: "paragraph",
        parts: [
          { text: "퇴근길에 마트에 들러 " },
          { text: "우유와 계란", bold: true },
          { text: "부터 담는다." },
        ],
      },
      { type: "subheading", text: "식료품" },
      { type: "list", items: ["우유", "계란", "사과", "커피 원두"] },
      { type: "subheading", text: "잊지 말 것" },
      {
        type: "paragraph",
        parts: [{ text: "계란은 맨 마지막에 담고, 영수증은 사진으로 남겨 둔다." }],
      },
    ],
  },
  {
    id: "app-icon-idea",
    title: "앱 아이콘 아이디어",
    preview: "메모지 모서리가 접힌 모양",
    date: "오늘",
    label: "orange",
    category: "아이디어",
    createdAt: "10월 30일 오전 7:30",
    editedAt: "오늘 오전 7:30",
    charCount: 160,
    body: [
      { type: "heading", text: "방향" },
      {
        type: "paragraph",
        parts: [
          { text: "메모지 모서리가 접힌 모양을 " },
          { text: "단순한 도형", bold: true },
          { text: "으로 줄인다." },
        ],
      },
      { type: "subheading", text: "후보" },
      { type: "list", items: ["접힌 모서리 노트", "연필 끝", "말풍선 메모"] },
      { type: "subheading", text: "다음 단계" },
      {
        type: "paragraph",
        parts: [{ text: "세 가지를 흑백으로 먼저 그려 보고 하나만 색을 입힌다." }],
      },
    ],
  },
  {
    id: "books-to-read",
    title: "읽을 책",
    preview: "디자인 시스템 책 두 권",
    date: "어제",
    label: "green",
    category: "개인",
    createdAt: "10월 29일 오후 9:15",
    editedAt: "어제 오후 9:15",
    charCount: 135,
    body: [
      { type: "heading", text: "독서 목록" },
      {
        type: "paragraph",
        parts: [
          { text: "이번 달에 " },
          { text: "두 권", bold: true },
          { text: "을 끝내는 게 목표다." },
        ],
      },
      { type: "subheading", text: "책" },
      {
        type: "list",
        items: ["토큰과 컴포넌트를 다루는 책", "화면 구조와 접근성을 다루는 책"],
      },
      { type: "subheading", text: "읽는 순서" },
      {
        type: "paragraph",
        parts: [{ text: "얇은 책부터 읽고, 읽은 뒤 한 줄씩 메모를 남긴다." }],
      },
    ],
  },
];

const byId = (ids: string[]) =>
  ids.map((id) => MEMOS.find((m) => m.id === id)!);

export const PINNED_MEMOS = byId(["design-review", "weekend-hike"]);
export const RECENT_MEMOS = byId(["grocery-list", "app-icon-idea", "books-to-read"]);

export function getMemo(id: string): MemoDetail | undefined {
  return MEMOS.find((m) => m.id === id);
}
