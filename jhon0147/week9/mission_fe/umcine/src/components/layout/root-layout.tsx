import type { ReactNode } from "react";
import { Suspense } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen min-w-80 flex-col bg-[#f6f8fb] font-sans text-slate-900 antialiased">
      <Suspense fallback={<header className="min-h-18 border-b border-slate-200 bg-white" />}><Header /></Suspense>
      {children}
      <Footer />
    </div>
  );
}
