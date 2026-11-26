import { SearchPage } from "../../App";
import { Suspense } from "react";
export default function Page() { return <Suspense fallback={<p className="notice">검색을 준비하고 있어요…</p>}><SearchPage/></Suspense>; }

