import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({ queryKey: ["members", "me"], queryFn: getMe, enabled: Boolean(accessToken), staleTime: 5 * 60 * 1000, retry: false });
  return <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur"><div className="mx-auto flex h-[76px] w-[min(1180px,calc(100%-48px))] items-center gap-8"><Link to="/" className="text-[26px] font-black tracking-[-1.4px] text-zinc-900">UMC<span className="font-medium">ine</span></Link><nav className="flex flex-1 items-center gap-7 text-[15px] font-semibold text-zinc-500"><Link to="/" activeProps={{ className: "text-zinc-950" }}>영화</Link><Link to="/search" activeProps={{ className: "text-zinc-950" }}>검색</Link></nav><div className="flex items-center gap-2">{!accessToken ? <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-bold hover:bg-zinc-100">로그인</Link> : meQuery.isLoading ? <span className="h-10 w-24 animate-pulse rounded-lg bg-zinc-200" /> : <Link to="/my-page" className="rounded-lg px-3 py-2 text-sm font-bold hover:bg-zinc-100">마이페이지</Link>}</div></div></header>;
}
