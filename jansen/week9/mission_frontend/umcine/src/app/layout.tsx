import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import Header from "@/components/layout/header";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "UMCine", template: "%s | UMCine" },
  description: "TMDB 영화 정보를 보고, 평점과 즐겨찾기를 남기는 UMCine",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AppProviders>
          {/* Header는 현재 경로를 읽는 Client Component라서 Suspense로 감싼다 */}
          <Suspense
            fallback={
              <div className="h-[91px] border-b border-line bg-white" />
            }
          >
            <Header />
          </Suspense>
          {children}
          <footer className="mt-20 border-t border-line bg-white px-20 py-6 text-right text-sm text-muted">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </footer>
        </AppProviders>
      </body>
    </html>
  );
}
