import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export function Header() {
  return (
    <header className="flex items-center gap-10.5 py-4 border-b bg-white px-20">
      <Link to="/" className="flex items-center gap-2">
        <div className="rounded-lg p-1.5 border-2">
          <img src="/icons/movie.svg" alt="영화" />
        </div>
        <h1 className="font-bold text-xl">UMCine</h1>
      </Link>

      <div className="flex items-center flex-1 justify-between">
        <div className="flex items-center gap-7.5">
          <Link
            to="/"
            activeProps={{ className: "underline underline-offset-4" }}
            activeOptions={{ exact: true }}
          >
            영화
          </Link>

          <Link
            to="/search"
            className={cn("text-gray-600 transition-colors hover:text-black")}
            activeProps={{ className: "underline underline-offset-4" }}
            activeOptions={{ exact: true }}
          >
            검색
          </Link>
          <Link
            to="/search"
            className={cn("text-gray-600 transition-colors hover:text-black")}
            activeProps={{ className: "underline underline-offset-4" }}
            activeOptions={{ exact: true }}
          >
            내 정보
          </Link>
        </div>
        <div className="flex gap-3">
          <Link
            to="/search"
            className="bg-white border border-[#E3E6EB] flex items-center justify-center w-10 h-10 rounded-xl"
          >
            <img src={"/icons/search.svg"} />
          </Link>
          <Link
            to="/"
            className="bg-[#2563EB] border border-white flex items-center justify-center px-4 rounded-xl text-white font-semibold"
          >
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
}
