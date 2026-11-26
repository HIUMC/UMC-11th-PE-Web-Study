import type { Metadata } from "next";
import { Suspense } from "react";
import { MyInfoPage } from "../../../screens/account/my-info-page";
export const metadata: Metadata = { title: "내 정보" };
export default function Page() { return <Suspense fallback={<main className="p-6" role="status">불러오는 중이에요.</main>}><MyInfoPage /></Suspense>; }
