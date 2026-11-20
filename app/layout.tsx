import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "메모",
  description: "메모를 쓰고 모아 보는 앱",
  applicationName: "메모",
  // 아이폰: 홈 화면에 추가하면 주소창 없이 열리고 이름이 "메모"로 보인다
  appleWebApp: { capable: true, title: "메모", statusBarStyle: "default" },
};

// 상태 표시줄 색: surface/page
export const viewport: Viewport = {
  themeColor: "#f2f4f6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
