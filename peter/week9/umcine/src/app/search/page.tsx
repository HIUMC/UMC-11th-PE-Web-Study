import { Suspense } from "react";
import { SearchPage } from "@/screens/movies/search-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  );
}
