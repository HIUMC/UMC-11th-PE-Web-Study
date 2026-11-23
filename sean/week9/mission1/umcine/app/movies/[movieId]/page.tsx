import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import { DetailFavoriteButton } from "@/components/movies/detail-favorite-button";
import { MyRatingPanel } from "@/components/movies/my-rating-panel";
import { getMovieDetailErrorMessage } from "@/utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "@/utils/movies/tmdb-image";

interface MovieDetailPageProps {
  params: Promise<{ movieId: string }>;
}

function formatRuntime(runtime: number | null) {
  if (runtime === null) return "상영 시간 정보가 없어요.";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

/**
 * 페이지마다 다른 제목과 설명을 만들어 줍니다.
 * Client Component에서는 export할 수 없는 기능이라, 페이지를 Server Component로 둔 이유 중 하나입니다.
 */
export async function generateMetadata({
  params,
}: MovieDetailPageProps): Promise<Metadata> {
  const { movieId } = await params;
  const parsedMovieId = Number(movieId);

  if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
    return { title: "영화 정보" };
  }

  try {
    const movie = await getMovieDetail(parsedMovieId);
    const posterUrl = getTmdbPosterUrl(movie.poster_path);

    return {
      title: movie.title,
      description: movie.overview || `${movie.title}의 상세 정보예요.`,
      openGraph: {
        title: movie.title,
        description: movie.overview || `${movie.title}의 상세 정보예요.`,
        images: posterUrl ? [posterUrl] : undefined,
      },
    };
  } catch {
    return { title: "영화 정보" };
  }
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-[1200px] px-6 py-20 text-center">
          <p className="text-lg text-neutral-500">영화 정보를 불러오는 중이에요.</p>
        </main>
      }
    >
      <MovieDetailScreen params={params} />
    </Suspense>
  );
}

async function MovieDetailScreen({ params }: MovieDetailPageProps) {
  const { movieId } = await params;
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  if (!isValidMovieId) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 py-20 text-center">
        <p className="text-lg text-neutral-500">올바르지 않은 영화 번호예요.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-blue-600">
          영화 목록으로
        </Link>
      </main>
    );
  }

  let movie: Awaited<ReturnType<typeof getMovieDetail>>;

  try {
    movie = await getMovieDetail(parsedMovieId);
  } catch (error) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 py-20 text-center">
        <p className="text-lg text-neutral-500">
          {getMovieDetailErrorMessage(error)}
        </p>
        <Link href="/" className="mt-4 inline-block text-sm text-blue-600">
          영화 목록으로
        </Link>
      </main>
    );
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const genreNames = movie.genres.map((genre) => genre.name).join(" · ");

  return (
    <main>
      <section className="relative h-[360px]">
        {backdropUrl ? (
          <Image
            className="object-cover"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            priority
          />
        ) : (
          <div className="h-full w-full bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/10" />

        <div className="absolute inset-0 mx-auto flex max-w-[1200px] flex-col px-6 py-6 text-white">
          <Link href="/" className="inline-flex w-fit items-center gap-1 text-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-4 w-4 brightness-0 invert"
              src="/icons/chevron-left.svg"
              alt=""
            />
            영화 목록
          </Link>

          <div className="mt-auto">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="mt-1 text-sm text-white/70">{movie.original_title}</p>
            <p className="mt-2 text-sm font-medium">
              {movie.release_date} · {genreNames} · {formatRuntime(movie.runtime)}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-[1200px] gap-10 px-6 pt-8 pb-16">
        <div className="relative z-10 -mt-2 h-[286px] w-[200px] shrink-0 overflow-hidden rounded-lg shadow-lg">
          {posterUrl ? (
            <Image
              className="object-cover"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              fill
              sizes="200px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-xs text-neutral-500">
              이미지 없음
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-neutral-900">{movie.tagline}</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            {movie.overview}
          </p>

          <DetailFavoriteButton movieId={parsedMovieId} />
        </div>

        <aside className="w-[300px] shrink-0 border-l border-neutral-200 pl-10">
          <h2 className="text-lg font-bold text-neutral-900">내 평점</h2>
          <p className="mt-1 text-xs text-neutral-500">
            별점은 필수, 후기는 선택이에요.
          </p>

          <MyRatingPanel movieId={parsedMovieId} />
        </aside>
      </div>
    </main>
  );
}
