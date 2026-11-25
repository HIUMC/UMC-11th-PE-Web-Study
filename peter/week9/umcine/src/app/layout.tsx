import type { Metadata } from "next";
import type { ReactNode } from "react";
import Footer from "@/components/footer";
import Header from "@/components/layout/header";
import { Providers } from "./providers";
import "../index.css";

export const metadata: Metadata = {
  title: "UMCine",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
