import type { Metadata } from "next";
import { Suspense } from "react";
import { EditMyInfoPage } from "../../../../screens/account/edit-my-info-page";
export const metadata: Metadata = { title: "내 정보 수정" };
export default function Page() { return <Suspense fallback={<main className="p-6" role="status">불러오는 중이에요.</main>}><EditMyInfoPage /></Suspense>; }
