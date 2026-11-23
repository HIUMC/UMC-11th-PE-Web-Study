import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import Providers from "./providers";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "UMCine | 영화 목록", template: "%s | UMCine" },
  description: "인기 영화를 찾고 감상 기록을 남기는 UMCine.",
  icons: { icon: "/icons/movie.svg" },
  openGraph: {
    title: "UMCine",
    description: "인기 영화를 찾고 감상 기록을 남기는 UMCine.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={GeistSans.variable}>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Suspense fallback={<header aria-hidden="true" className="min-h-[88px] border-b border-[#e9ecf2] bg-white" />}>
              <Header />
            </Suspense>
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
