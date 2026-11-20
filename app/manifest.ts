import type { MetadataRoute } from "next";

// 홈 화면에 추가하면 주소창 없이 앱처럼 열린다 (display: standalone)
// 매니페스트는 CSS 변수를 못 읽어서 색 값을 직접 적는다: surface/page = #f2f4f6
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "메모",
    short_name: "메모",
    description: "메모를 쓰고 모아 보는 앱",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f2f4f6",
    theme_color: "#f2f4f6",
    icons: [
      { src: "/pwa/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
