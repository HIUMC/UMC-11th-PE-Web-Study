import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { RootLayout } from "../components/layout/root-layout";
import "../index.css";

const geist = localFont({
  src: "./fonts/Geist.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "UMCine | 영화 둘러보기", template: "%s | UMCine" },
  description: "인기 영화를 찾고 즐겨찾기와 나만의 평점을 기록해 보세요.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "UMCine",
    description: "인기 영화 검색과 나만의 즐겨찾기, 평점 기록",
    type: "website",
    locale: "ko_KR",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="ko"><body className={geist.variable}>
    <Providers><RootLayout>{children}</RootLayout></Providers>
  </body></html>;
}
