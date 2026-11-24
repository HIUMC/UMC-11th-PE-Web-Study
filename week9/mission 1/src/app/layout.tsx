import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "./providers";
import "@/index.css";
export const metadata: Metadata = {
 title: "UMCine | 영화 목록",
 description: "UMCine에서 영화 목록을 둘러보고 좋아하는 영화를 북마크하세요.",
 icons: { icon: "/icons/movie-icons/movie.svg" },
};
export default function RootLayout({ children }: { children: ReactNode }) {
 return <html lang="ko"><body><Providers><div className="flex min-h-dvh flex-col bg-[#f6f7f9] font-sans text-[#191b20]"><Header />{children}<Footer /></div></Providers></body></html>;
}
