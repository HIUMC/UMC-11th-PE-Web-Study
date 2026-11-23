import { Suspense } from "react";
import { SearchPage } from "../../screens/movies/search-page";
import RequestMessage from "../../components/movies/request-message";
import { readMoviePage } from "../../utils/movies/page-search";

export const metadata = { title: "영화 검색" };

type Props = PageProps<"/search">;

export default function SearchRoute({ searchParams }: Props) {
  return (
    <Suspense fallback={<main className="flex-1"><RequestMessage message="검색을 준비하고 있어요." /></main>}>
      <SearchScreen searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchScreen({ searchParams }: Pick<Props, "searchParams">) {
  const { query, page } = await searchParams;
  return <SearchPage query={typeof query === "string" ? query.trim() : ""} page={readMoviePage(page) ?? 1} />;
}
