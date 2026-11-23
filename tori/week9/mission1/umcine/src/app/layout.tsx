import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMCine",
  description: "영화 정보 및 즐겨찾기 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}