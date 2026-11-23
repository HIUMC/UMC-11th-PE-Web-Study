"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { getMe } from "@/api/members/me";
import { getFavorites } from "@/api/favorites/get-favorites";
import { useAuthStore } from "@/stores/auth-store";

export function MyPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const favorites = favoritesQuery.data ?? [];

  if (!accessToken) {
    return <main className="p-10">로그인이 필요합니다.</main>;
  }

  if (meQuery.isLoading) {
    return <main className="p-10">내 정보를 불러오는 중...</main>;
  }

  if (meQuery.isError || !meQuery.data) {
    return <main className="p-10">내 정보를 불러오지 못했습니다.</main>;
  }

  const { nickname, email } = meQuery.data;

   return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1280px] flex-col px-10 py-8">
      {/* 상단 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">마이페이지</h1>
          <p className="mt-2 text-xs text-gray-400">
            내 정보와 활동 내역을 확인할 수 있어요.
          </p>
        </div>

        <Link
          href="/mypage/edit"
          className="rounded-md border border-border px-5 py-3 text-sm font-semibold hover:bg-gray-50"
        >
          내 정보 수정
        </Link>
      </div>

      {/* 프로필 */}
      <section className="mt-12 flex items-center gap-6 rounded-lg border border-border p-8">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-200">
          <img
            src="/icons/person.svg"
            alt="프로필 이미지"
            className="h-12 w-12"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold">{nickname}</h2>
          <p className="mt-2 text-sm text-gray-500">{email}</p>
        </div>
      </section>

      {/* 즐겨찾기 영화 */}
      {/* 즐겨찾기 영화 */}
<section className="mt-12">
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-bold">찜한 영화</h2>
  </div>

  {favoritesQuery.isLoading ? (
    <p className="mt-5 text-sm text-gray-400">
      찜한 영화를 불러오는 중...
    </p>
  ) : favoritesQuery.isError ? (
    <p className="mt-5 text-sm text-red-400">
      찜한 영화를 불러오지 못했습니다.
    </p>
  ) : favorites.length === 0 ? (
    <div className="mt-5 flex min-h-48 items-center justify-center rounded-lg border border-border">
      <p className="text-sm text-gray-400">
        찜한 영화가 아직 없습니다.
      </p>
    </div>
  ) : (
    <div className="mt-5 grid grid-cols-4 gap-5">
      {favorites.map((favorite) => (
        <div
          key={favorite.favoriteId}
          className="rounded-lg border border-border p-4"
        >
          <p className="text-sm font-semibold">
            영화 ID: {favorite.movieId}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            찜한 날짜: {favorite.createdAt}
          </p>
        </div>
      ))}
    </div>
  )}
</section>
    </main>
  );
}
