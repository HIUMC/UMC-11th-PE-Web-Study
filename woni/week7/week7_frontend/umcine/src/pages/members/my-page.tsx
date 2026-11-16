import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MovieCard } from "@/components/movies/movie-card";
import { Pagination } from "@/components/movies/pagination";
import type { MovieCardItem } from "@/types/movie-card";

// API 연동 전까지 사용하는 임시 데이터
const MOCK_PROFILE = {
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
};

// API 연동 전까지 사용하는 임시 데이터
const MOCK_FAVORITE_MOVIES: MovieCardItem[] = [
  {
    id: 969681,
    title: "스파이더맨: 브랜드 뉴 데이",
    releaseDate: "2026.07.29",
    posterUrl: "/images/movies/spider-man-brand-new-day.jpg",
  },
  {
    id: 1368337,
    title: "오디세이",
    releaseDate: "2026.08.05",
    posterUrl: "/images/movies/odyssey.jpg",
  },
  {
    id: 878357,
    title: "미니언즈 & 몬스터즈",
    releaseDate: "2026.07.15",
    posterUrl: "/images/movies/minions-monsters.jpg",
  },
];

const PAGE_SIZE = 5;

// 공통 스타일
const SECTION_TITLE_CLASS = "text-[17px] font-bold text-[#17191e]";
const INFO_LABEL_CLASS = "text-[11px] text-[#969da8]";
const INFO_VALUE_CLASS = "text-sm font-bold text-[#17191e]";

export function MyPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(MOCK_FAVORITE_MOVIES.length / PAGE_SIZE);
  const pagedMovies = MOCK_FAVORITE_MOVIES.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <main className="flex min-h-[calc(100vh-148px)] flex-col gap-7 bg-[#f6f7f9] px-20 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[31px] font-bold tracking-[-1.24px] text-[#17191e]">
          내 정보
        </h1>
        <Link
          to="/my/edit"
          className="flex h-[42px] items-center rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white"
        >
          정보 수정
        </Link>
      </div>

      <section className="flex flex-col gap-4 border-y border-[#e3e6eb] py-3">
        <h2 className={SECTION_TITLE_CLASS}>기본 정보</h2>
        <div className="flex items-center gap-7">
          <span className="flex size-[82px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e3e6eb]">
            <img src="/icons/person.svg" alt="" width={48} height={48} />
          </span>
          <dl className="grid w-[760px] max-w-full grid-cols-2 gap-7">
            <div className="flex flex-col gap-1.5">
              <dt className={INFO_LABEL_CLASS}>닉네임</dt>
              <dd className={INFO_VALUE_CLASS}>{MOCK_PROFILE.nickname}</dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <dt className={INFO_LABEL_CLASS}>이메일</dt>
              <dd className={INFO_VALUE_CLASS}>{MOCK_PROFILE.email}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className={SECTION_TITLE_CLASS}>내 즐겨찾기</h2>
        <div className="grid grid-cols-5 gap-x-[18px] gap-y-5">
          {pagedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  );
}
