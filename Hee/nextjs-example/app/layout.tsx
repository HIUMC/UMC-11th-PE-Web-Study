import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/header";

export const metadata: Metadata = { title: "UMCine", description: "영화를 찾고 북마크하는 UMCine" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="ko"><body><Suspense fallback={<div className="h-16 border-b bg-white"/>}><Header /></Suspense>{children}</body></html>;
}
