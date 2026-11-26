import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPage } from "../../screens/auth/login-page";
import { AuthenticatedLayout } from "../../components/authenticated-layout";
export const metadata: Metadata = { title: "로그인" };
export default function Page() { return <Suspense fallback={<main className="p-6" role="status">불러오는 중이에요.</main>}><AuthenticatedLayout guestOnly><LoginPage /></AuthenticatedLayout></Suspense>; }
