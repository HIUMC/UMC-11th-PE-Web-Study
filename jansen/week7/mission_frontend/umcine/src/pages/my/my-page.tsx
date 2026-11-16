import { Link } from "@tanstack/react-router";

// 8주차에서 API 데이터로 교체
const MOCK_USER = { nickname: "gs0428", email: "gwangsoo@cinemalab.kr" };
const MOCK_FAVORITES = [
  { id: 1, title: "스파이더맨: 브랜드 뉴 데이", date: "2026.07.29" },
  { id: 2, title: "오디세이", date: "2026.08.05" },
  { id: 3, title: "미니언즈 & 몬스터즈", date: "2026.07.15" },
];

export function MyPage() {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900">내 정보</h1>
        <Link
          to="/my/edit"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"
        >
          정보 수정
        </Link>
      </div>

      {/* 기본 정보 */}
      <section className="border-t border-gray-200 py-5">
        <h2 className="mb-4 text-base font-bold text-gray-900">기본 정보</h2>
        <div className="flex items-center gap-7">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
            </svg>
          </div>
          <div className="w-[394px]">
            <p className="text-xs text-gray-400">닉네임</p>
            <p className="mt-1 text-sm font-bold text-gray-900">{MOCK_USER.nickname}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">이메일</p>
            <p className="mt-1 text-sm font-bold text-gray-900">{MOCK_USER.email}</p>
          </div>
        </div>
      </section>

      {/* 내 즐겨찾기 */}
      <section className="border-t border-gray-200 py-5">
        <h2 className="mb-4 text-base font-bold text-gray-900">내 즐겨찾기</h2>
        <ul className="grid grid-cols-3 gap-[18px] md:grid-cols-4 lg:grid-cols-5">
          {MOCK_FAVORITES.map((movie) => (
            <li key={movie.id}>
              {/* 포스터 이미지는 API 연동 후 <img>로 교체 */}
              <div className="aspect-[241/274] w-full rounded-xl bg-gray-300" />
              <p className="mt-2 text-sm font-bold text-gray-900">{movie.title}</p>
              <p className="mt-0.5 text-xs text-gray-400">{movie.date}</p>
            </li>
          ))}
        </ul>

        {/* 페이지네이션 (모양만) */}
        <div className="mt-8 flex items-center justify-center gap-4 text-gray-300">
          <span>‹</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold text-white">
            1
          </span>
          <span>›</span>
        </div>
      </section>
    </main>
  );
}