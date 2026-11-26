import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import Providers from "./providers";
import { Header } from "../App";
import "../styles.css";
import "../search.css";
import "../bookmark.css";
import "../tmdb-credit.css";
import "../auth.css";
export const metadata: Metadata = {title:"UMCine", description:"영화 검색과 나만의 즐겨찾기"};
export default function RootLayout({children}:{children:ReactNode}) {return <html lang="ko"><body><Providers><Header/>{children}</Providers></body></html>;}

