import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { searchMovies } from "@/api/movies/search-movies";
import { FavoriteToggleButton } from "@/components/movies/favorite-toggle-button";
import { Pagination } from "@/components/movies/pagination";
import { SearchForm } from "@/components/movies/search-form";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";

export const metadata: Metadata = {
  title: "영화 검색",
  description: "보고 싶은 영화를 검색해 보세요.",
};

interface SearchPageProps {
  searchParams: Promise<{ query?: string; page?: string }>;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-[1200px] px-6 pb-16">
          <p className="mt-10 text-center text-neutral-500">불러오는 중이에요.</p>
        </main>
      }
    >
      <SearchPageScreen searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchPageScreen({ searchParams }: SearchPageProps) {
  const { query, page: pageParam } = await searchParams;
  const normalizedQuery = query?.trim() ?? "";
  const parsedPage = Number(pageParam ?? "1");
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  // 검색어가 없으면 TMDB를 부르지 않습니다. (기존 useQuery의 enabled와 같은 역할)
  if (!normalizedQuery) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 pb-16">
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-neutral-900">
            어떤 영화를 찾고 있나요?
          </h1>
          <div className="mt-8 w-full max-w-[720px]">
            <SearchForm query="" submitLabel="검색" placeholder="예: 스파이더맨" />
          </div>
        </div>
      </main>
    );
  }

  let results: Awaited<ReturnType<typeof searchMovies>> | null = null;
  let hasError = false;

  try {
    results = await searchMovies({ query: normalizedQuery, page });
  } catch {
    hasError = true;
  }

  const searchResults = results?.results ?? [];
  const totalPages = Math.min(results?.total_pages ?? 0, 500);

  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-16">
      <h1 className="mt-8 mb-5 text-[28px] font-semibold text-neutral-900">
        영화 검색
      </h1>

      <SearchForm query={normalizedQuery} submitLabel="다시 검색" />

      <div className="mt-6 flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-neutral-900">
          &apos;{normalizedQuery}&apos; 검색 결과
        </h2>
        {!hasError && (
          <p className="text-sm text-neutral-500">
            영화 {results?.total_results ?? 0}편
          </p>
        )}
      </div>

      {hasError ? (
        <p className="mt-10 text-center text-red-600">검색 결과를 불러오지 못했어요.</p>
      ) : searchResults.length === 0 ? (
        <p className="mt-10 text-center text-neutral-500">검색 결과가 없어요.</p>
      ) : (
        <>
          <ul className="mt-4 grid grid-cols-1 gap-x-10 lg:grid-cols-2">
            {searchResults.map((movie) => {
              const posterUrl = getTmdbPosterUrl(movie.poster_path);

              return (
                <li
                  key={movie.id}
                  className="flex gap-5 border-t border-neutral-200 py-6"
                >
                  <div className="relative h-[170px] w-[115px] shrink-0 overflow-hidden rounded-md">
                    {posterUrl ? (
                      <Image
                        className="object-cover"
                        src={posterUrl}
                        alt={`${movie.title} 포스터`}
                        fill
                        sizes="115px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-xs text-neutral-500">
                        이미지 없음
                      </div>
                    )}
                    <FavoriteToggleButton
                      movieId={movie.id}
                      className="absolute top-1 right-1 h-7 w-7 border-transparent"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <h3 className="text-lg font-bold text-neutral-900">
                      {movie.title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      {movie.original_title} · {movie.release_date}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                      {movie.overview}
                    </p>

                    <Link
                      href={`/movies/${movie.id}`}
                      className="mt-auto pt-3 text-sm font-medium text-blue-600"
                    >
                      상세 보기 →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              buildHref={(nextPage) =>
                `/search?query=${encodeURIComponent(normalizedQuery)}&page=${nextPage}`
              }
            />
          )}
        </>
      )}
    </main>
  );
}
