import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import Providers from "./providers";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
import { FooterVisibility } from "../components/layout/footer-visibility";
import "../index.css";

export const metadata: Metadata = {
  title: "UMCine",
  description: "영화를 검색하고 즐겨찾기와 평점을 관리하는 서비스",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Suspense
              fallback={
                <div
                  role="status"
                  aria-label="헤더 로딩 중"
                  className="h-[72px] shrink-0 border-b border-gray-200 bg-white"
                />
              }
            >
              <Header />
            </Suspense>

            <div className="flex flex-1 flex-col bg-[#f5f6f8]">
              {children}
            </div>

            <Suspense fallback={null}>
              <FooterVisibility>
                <Footer />
              </FooterVisibility>
            </Suspense>
          </div>
        </Providers>
      </body>
    </html>
  );
}