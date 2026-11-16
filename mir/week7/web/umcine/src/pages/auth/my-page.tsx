import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { getMyInfo } from "../../api/members/get-my-info";
import { getMovieDetailQueryOptions } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";

interface DisplayFavoriteMovie {
  id: number;
  title: string;
  releaseDate: string;
  posterUrl: string;
}

const DEFAULT_DESIGN_MOVIES: DisplayFavoriteMovie[] = [
  {
    id: 969681,
    title: "스파이더맨: 브랜드 뉴 데이",
    releaseDate: "2026.07.29",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
  },
  {
    id: 1184918,
    title: "오디세이",
    releaseDate: "2026.08.05",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
  },
  {
    id: 519182,
    title: "미니언즈 & 몬스터즈",
    releaseDate: "2026.07.15",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/wWba3TaojhK7NdycRhoQpsG0FaH.jpg",
  },
];

const ITEMS_PER_PAGE = 4;

export function MyPage() {
  const [profile, setProfile] = useState({
    nickname: localStorage.getItem("nickname") || "gs0428",
    email: localStorage.getItem("email") || "gwangsoo@cinemalab.kr",
  });
  const [avatarUrl] = useState<string | null>(
    localStorage.getItem("profileImageUrl"),
  );
  const [currentPage, setCurrentPage] = useState(1);

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const bookmarkQueries = useQueries({
    queries: bookmarkedMovieIds.map((movieId) =>
      getMovieDetailQueryOptions(movieId),
    ),
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    getMyInfo(token)
      .then((res) => {
        setProfile({
          nickname: res.result.nickname,
          email: res.result.email,
        });
        localStorage.setItem("nickname", res.result.nickname);
        localStorage.setItem("email", res.result.email);
      })
      .catch(() => {
        // 토큰이 없거나 만료된 경우 현재 표시값 유지
      });
  }, []);

  const bookmarkedMovies: DisplayFavoriteMovie[] = bookmarkQueries
    .map((query) => query.data)
    .filter((movie): movie is TmdbMovieDetail => Boolean(movie))
    .map((movie) => ({
      id: movie.id,
      title: movie.title,
      releaseDate: movie.release_date
        ? movie.release_date.replaceAll("-", ".")
        : "",
      posterUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",
    }));

  const moviesToShow =
    bookmarkedMovieIds.length > 0 ? bookmarkedMovies : DEFAULT_DESIGN_MOVIES;

  const totalPages = Math.max(
    1,
    Math.ceil(moviesToShow.length / ITEMS_PER_PAGE),
  );
  const pagedMovies = moviesToShow.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[#f6f7f9] px-5 py-10 md:px-[80px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col">
        {/* 상단 타이틀 & 정보 수정 버튼 */}
        <div className="flex items-center justify-between pb-6">
          <h1 className="text-[34px] font-bold tracking-[-1.53px] text-[#17191e]">
            내 정보
          </h1>
          <Link
            to="/my/edit"
            className="flex h-[42px] items-center justify-center rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white no-underline transition-colors hover:bg-[#1d4ed8]"
          >
            정보 수정
          </Link>
        </div>

        {/* 기본 정보 영역 */}
        <section className="border-t border-b border-[#e3e6eb] py-6">
          <h2 className="mb-5 text-base font-extrabold text-[#17191e]">
            기본 정보
          </h2>
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e3e6eb]">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="프로필 이미지"
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg
                  className="h-10 w-10 text-[#17191e]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2.5c-3.33 0-10 1.67-10 5v2.5h20v-2.5c0-3.33-6.67-5-10-5z" />
                </svg>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-16 md:gap-40">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-[#969da8]">
                  닉네임
                </span>
                <span className="text-base font-extrabold text-[#17191e]">
                  {profile.nickname}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-[#969da8]">
                  이메일
                </span>
                <span className="text-base font-extrabold text-[#17191e]">
                  {profile.email}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 내 즐겨찾기 영역 */}
        <section className="py-8">
          <h2 className="mb-5 text-base font-extrabold text-[#17191e]">
            내 즐겨찾기
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {pagedMovies.map((movie) => (
              <Link
                key={movie.id}
                to="/movies/$movieId"
                params={{ movieId: String(movie.id) }}
                className="flex flex-col gap-2.5 no-underline"
              >
                <div className="aspect-[2/3] w-full overflow-hidden rounded-2xl bg-[#e3e6eb]">
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-sm font-extrabold text-[#17191e]">
                    {movie.title}
                  </h3>
                  <span className="text-xs font-normal text-[#969da8]">
                    {movie.releaseDate}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* 하단 페이지네이션 */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-[#969da8] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="이전 페이지"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 text-xs font-extrabold ${
                    page === currentPage
                      ? "bg-[#17191e] text-white"
                      : "bg-transparent text-[#606774]"
                  }`}
                >
                  {page}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-[#969da8] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="다음 페이지"
            >
              ›
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
