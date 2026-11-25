import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMCine",
  description: "TMDB 영화 정보를 찾아보고 즐겨찾기와 평점을 남기는 UMCine",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            {/* Header의 usePathname은 /movies/[movieId]처럼 빌드 시 알 수 없는 경로에서
                요청 시점까지 값을 알 수 없으므로 Suspense로 감쌈 (cacheComponents 규칙) */}
            <Suspense fallback={null}>
              <Header />
            </Suspense>
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
