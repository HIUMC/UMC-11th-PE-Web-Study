import { LoginPage } from "../../screens/auth/login-page";
import { Suspense } from "react";
export default function Page() { return <Suspense fallback={<p className="notice">불러오는 중…</p>}><LoginPage/></Suspense>; }

