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
    </header>
  );
}
