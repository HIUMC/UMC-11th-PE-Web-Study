import { Suspense } from "react";
import { getMovies } from "@/api/movies/get-movies";
import { MovieGrid } from "@/components/movies/movie-grid";
import { Pagination } from "@/components/movies/pagination";

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-16">
      <h1 className="mt-8 mb-5 text-[28px] font-semibold text-neutral-900">
        영화 목록
      </h1>
      <Suspense fallback={<p className="py-20 text-center text-neutral-500">영화 목록을 불러오는 중이에요.</p>}>
        <MovieListSection searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

/**
 * useQuery 대신 Server Component에서 바로 await 합니다.
 * 페이지 번호는 useState가 아니라 URL(`?page=`)이 들고 있습니다.
 */
async function MovieListSection({ searchParams }: HomePageProps) {
  const { page: pageParam } = await searchParams;
  const parsedPage = Number(pageParam ?? "1");
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  try {
    const data = await getMovies({ page });
    const movies = data.results;
    const totalPages = Math.min(data.total_pages, 500); // TMDB는 500페이지까지만 제공합니다

    if (movies.length === 0) {
      return (
        <p className="py-20 text-center text-neutral-500">조건에 맞는 영화가 없어요.</p>
      );
    }

    return (
      <>
        <MovieGrid movies={movies} />
        <Pagination
          page={page}
          totalPages={totalPages}
          buildHref={(nextPage) => `/?page=${nextPage}`}
        />
      </>
    );
  } catch {
    return (
      <p className="py-20 text-center text-red-600">영화 목록을 불러오지 못했어요.</p>
    );
  }
}
