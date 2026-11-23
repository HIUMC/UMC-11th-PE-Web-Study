import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// 여러 페이지가 공통으로 쓰는 메타데이터입니다.
// title.template 덕분에 각 페이지는 자기 이름만 적으면 " | UMCine"가 붙습니다.
export const metadata: Metadata = {
  title: {
    default: "UMCine",
    template: "%s | UMCine",
  },
  description: "TMDB 데이터로 영화를 찾아보고 평점과 즐겨찾기를 남기는 서비스예요.",
  openGraph: {
    title: "UMCine",
    description: "영화를 찾아보고 평점과 즐겨찾기를 남겨보세요.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
