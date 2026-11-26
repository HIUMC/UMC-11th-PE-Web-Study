import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import Header from "../components/layout/header";
import TmdbAttribution from "../components/layout/tmdb-attribution";
import "../index.css";
import "../App.css";

export const metadata: Metadata = {
  title: { default: "UMCine | 영화 목록", template: "%s | UMCine" },
  description: "영화를 검색하고, 좋아하는 영화를 저장하고, 나만의 평점을 남겨 보세요.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ko"><body><Providers><div className="flex min-h-dvh flex-col"><Header /><div className="flex flex-1 flex-col">{children}</div><TmdbAttribution /></div></Providers></body></html>;
}
