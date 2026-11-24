import type { ReactNode } from "react";
import "../index.css";
import { Header } from "@/components/layout/header";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="min-h-screen bg-gray-100">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
