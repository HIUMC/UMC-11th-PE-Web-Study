import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupPage } from "../../screens/auth/signup-page";
export const metadata: Metadata = { title: "회원가입" };
export default function Page() { return <Suspense fallback={<main className="p-6" role="status">불러오는 중이에요.</main>}><SignupPage /></Suspense>; }
