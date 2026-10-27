import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { dummyMovies } from "../../data/movie_data";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = dummyMovies.find((item) => item.id === Number(movieId));

  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");

  if (!movie) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-gray-900">영화를 찾을 수 없어요.</p>
        <Link to="/" className="text-sm font-semibold text-blue-600 hover:underline">
          영화 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* 1. 상단 히어로 배너 섹션 */}
      <div className="relative h-[360px] w-full overflow-hidden bg-gray-950 md:h-[400px]">
        {/* 배경 이미지 */}
        <img
          src={movie.backdropPath}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
        />
        {/* 텍스트 가독성을 위한 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/50 to-gray-950/30 md:bg-gradient-to-r md:from-gray-950/95 md:via-gray-950/70 md:to-transparent" />

        {/* 히어로 내부 콘텐츠 */}
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-6 py-6 lg:px-8">
          {/* 뒤로가기 링크 */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            영화 목록
          </Link>

          {/* 타이틀 및 메타 정보 */}
          <div className="pb-4">
            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              {movie.title}
            </h1>
            <p className="mt-1.5 text-sm font-medium text-gray-300">
              {movie.originalTitle}
            </p>
            <p className="mt-2 text-xs font-normal text-gray-300 md:text-sm">
              {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
            </p>
          </div>
        </div>
      </div>

      {/* 2. 하단 상세 정보 및 평점 영역 */}
      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* 좌측 포스터 */}
          <div className="lg:col-span-3">
            <div className="aspect-[2/3] w-full max-w-[240px] overflow-hidden rounded-2xl bg-gray-100 shadow-md">
              <img
                src={movie.posterPath}
                alt={`${movie.title} 포스터`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* 중앙 줄거리 및 북마크 버튼 */}
          <div className="flex flex-col lg:col-span-5">
            <h2 className="text-lg font-bold text-gray-950">{movie.tagline}</h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              {movie.overview}
            </p>

            <div className="mt-8">
              <BookmarkButton movieId={movie.id} />
            </div>
          </div>

          {/* 우측 내 평점 카드 */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-950">내 평점</h3>
              <p className="mt-1 text-xs text-gray-400">별점은 필수, 후기는 선택이에요.</p>

              {/* 별점 선택 UI */}
              <div className="mt-4 flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-0.5 text-xl transition-transform hover:scale-110"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill={star <= rating ? "#3b82f6" : "#e5e7eb"}
                      stroke={star <= rating ? "#3b82f6" : "#e5e7eb"}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* 후기 작성란 */}
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="영화를 보고 느낀 점을 남겨보세요."
                className="mt-4 h-24 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm placeholder-gray-400 outline-none transition-colors focus:border-blue-500"
              />

              {/* 평점 저장 버튼 */}
              <button
                type="button"
                className="mt-4 w-full rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                평점 저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}