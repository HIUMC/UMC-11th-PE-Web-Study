import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import Header from "../components/header";
import Providers from "./providers";
import "../index.css";

export const metadata: Metadata = {
  title: { default: "UMCine", template: "%s | UMCine" },
  icons: { icon: "/favicon.svg" },
  description: "인기 영화를 둘러보고, 제목으로 검색해 보세요.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <Providers>{children}</Providers>

        <footer className="footer">
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            aria-label="TMDB 웹사이트"
          >
            <Image
              src="/images/logos/tmdb-logo.svg"
              alt="TMDB"
              width={80}
              height={10}
              style={{ height: "auto" }}
              unoptimized
            />
          </a>

          <span>
            This product uses the TMDB API but is not endorsed or certified
            by TMDB.
          </span>
        </footer>
      </body>
    </html>
  );
}
