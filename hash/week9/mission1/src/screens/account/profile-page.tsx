"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { readMemberApiError } from "../../api/api-client";
import { movieQueryOptions } from "../../api/movies/movie-query-options";
import { AccountPanel, accountButtonClass, accountLinkClass } from "../../components/account/account-panel";
import { useFavorites, useMe } from "../../hooks/use-account-queries";
import { useAuthStore } from "../../stores/auth-store";

export function ProfilePage() {
  const me = useMe();
  const sessionId = useAuthStore((state) => state.sessionId);
  const favorites = useFavorites(sessionId);

  return (
    <AccountPanel title="내 정보" description="회원 정보와 서버에 저장한 즐겨찾기를 확인할 수 있어요." icon="person">
      {me.data ? (
        <>
          <dl className="divide-y divide-[#e5e8f0] rounded-xl border border-[#e5e8f0]">
            {[
              ["이메일", me.data.email],
              ["닉네임", me.data.nickname],
              ["가입일", me.data.createdAt.slice(0, 10)],
            ].map(([label, value]) => (
              <div key={label} className="px-4 py-3">
                <dt className="text-xs text-[#555d6d]">{label}</dt>
                <dd className="mt-1 break-all text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <Link href="/mypage/edit" className={accountButtonClass + " mt-4 w-full"}>내 정보 수정</Link>
        </>
      ) : me.isError ? (
        <RetryMessage message={readMemberApiError(me.error).message} retry={() => void me.refetch()} />
      ) : (
        <p role="status" className="text-sm">{me.isPaused ? "네트워크 연결을 기다리는 중이에요." : "내 정보를 불러오는 중이에요."}</p>
      )}
      <section className="mt-7 space-y-3 border-t border-[#e5e8f0] pt-5" aria-labelledby="favorites-title">
        <h2 id="favorites-title" className="font-bold">내 즐겨찾기</h2>
        {favorites.isError && (
          <RetryMessage message={readMemberApiError(favorites.error).message} retry={() => void favorites.refetch()} />
        )}
        {favorites.isPending && (
          <p role="status" className="text-sm">{favorites.isPaused ? "네트워크 연결을 기다리는 중이에요." : "즐겨찾기를 불러오는 중이에요."}</p>
        )}
        {favorites.data?.length === 0 && <p className="text-sm text-[#555d6d]">아직 즐겨찾기한 영화가 없어요.</p>}
        {Boolean(favorites.data?.length) && (
          <ul className="divide-y divide-[#e5e8f0] rounded-lg border border-[#e5e8f0]">
            {favorites.data?.map((favorite) => <FavoriteItem key={favorite.favoriteId} movieId={favorite.movieId} />)}
          </ul>
        )}
      </section>
    </AccountPanel>
  );
}

function FavoriteItem({ movieId }: { movieId: number }) {
  const movie = useQuery(movieQueryOptions.detail(movieId));

  return (
    <li className="px-3 py-2 text-sm">
      <Link href={`/movies/${movieId}`} className={accountLinkClass}>
        {movie.data?.title ?? "영화 #" + movieId}
      </Link>
    </li>
  );
}

function RetryMessage({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
      <p>{message}</p>
      <button type="button" onClick={retry} className="mt-2 font-semibold underline">다시 시도</button>
    </div>
  );
}
