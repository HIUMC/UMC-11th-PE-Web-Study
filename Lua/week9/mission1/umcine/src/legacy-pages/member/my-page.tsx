import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { getFavorites } from "../../api/favorites";
import { getMe } from "../../api/members/me";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";

export function MyPage() {
  const meQuery = useQuery({ queryKey: ["members", "me"], queryFn: getMe, staleTime: 5 * 60 * 1000 });
  const favoritesQuery = useQuery({ queryKey: ["favorites"], queryFn: getFavorites });
  const updateMutation = useUpdateMeMutation();
  const [editedNickname, setEditedNickname] = useState<string | null>(null);
  if (meQuery.isLoading) return <main className="mx-auto w-[min(760px,calc(100%-48px))] py-14">내 정보를 불러오는 중입니다.</main>;
  if (meQuery.isError || !meQuery.data) return <main className="mx-auto w-[min(760px,calc(100%-48px))] py-14 text-red-600">내 정보를 불러오지 못했습니다.</main>;
  const nickname = editedNickname ?? meQuery.data.nickname;
  const canSubmit = nickname.trim().length >= 2 && nickname.trim().length <= 12;
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (canSubmit && !updateMutation.isPending) updateMutation.mutate({ nickname: nickname.trim() }); };
  return <main className="mx-auto w-[min(760px,calc(100%-48px))] py-14 pb-24"><p className="text-xs font-bold tracking-[0.16em] text-zinc-400">MY PAGE</p><h1 className="mt-3 text-3xl font-bold tracking-[-1.2px] text-zinc-950">내 정보</h1><section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm"><div className="flex items-center gap-4 border-b border-zinc-100 pb-6"><div className="grid size-14 place-items-center rounded-full bg-zinc-950 text-xl font-black text-white">{meQuery.data.nickname.slice(0, 1).toUpperCase()}</div><div><p className="text-lg font-bold">{meQuery.data.nickname}</p><p className="text-sm text-zinc-500">{meQuery.data.email}</p></div></div><form className="mt-6 flex gap-3" onSubmit={submit}><label className="flex-1 text-sm font-semibold">닉네임<input value={nickname} onChange={(event) => setEditedNickname(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-zinc-300 px-3 font-normal" /></label><button type="submit" disabled={!canSubmit || updateMutation.isPending} className="mt-7 h-11 rounded-lg bg-zinc-950 px-4 text-sm font-bold text-white disabled:bg-zinc-300">{updateMutation.isPending ? "저장 중" : "저장"}</button></form></section><section className="mt-10"><h2 className="text-xl font-bold">즐겨찾기</h2>{favoritesQuery.isLoading ? <p className="mt-4 text-sm text-zinc-500">즐겨찾기를 불러오는 중입니다.</p> : favoritesQuery.isError ? <p className="mt-4 text-sm text-red-600">즐겨찾기를 불러오지 못했습니다.</p> : favoritesQuery.data?.length ? <ul className="mt-4 grid gap-3 sm:grid-cols-2">{favoritesQuery.data.map((favorite) => <li key={favorite.favoriteId} className="rounded-xl border border-zinc-200 p-4"><Link to="/movies/$movieId" params={{ movieId: String(favorite.movieId) }} className="font-bold underline underline-offset-4">{favorite.title ?? `영화 #${favorite.movieId}`}</Link></li>)}</ul> : <p className="mt-4 text-sm text-zinc-500">즐겨찾기한 영화가 없습니다.</p>}</section></main>;
}
