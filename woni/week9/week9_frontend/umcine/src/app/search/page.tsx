import { Suspense } from "react";
import { SearchPage } from "@/screens/movies/search-page";

interface SearchRouteProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function SearchRoute({ searchParams }: SearchRouteProps) {
  return (
    <Suspense>
      <SearchScreen searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchScreen({ searchParams }: SearchRouteProps) {
  const { query: rawQuery } = await searchParams;
  // 기존 validateSearch 규칙: 문자열이면 사용, 아니면 undefined (배열이면 첫 값)
  const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;

  return <SearchPage query={query} />;
}
