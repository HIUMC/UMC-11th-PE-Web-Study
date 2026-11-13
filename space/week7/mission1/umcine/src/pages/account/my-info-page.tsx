import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../api/members/get-my-info";
import { getApiErrorMessage } from "../../utils/api-error-message";
import { initialMovies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MyInfoPage() {
  const profileQuery = useQuery({
    queryKey: ["member", "me"],
    queryFn: ({ signal }) => getMyInfo(signal),
    retry: false,
  });
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const bookmarkedMovies = initialMovies.filter((movie) =>
    bookmarkedMovieIds.includes(movie.id),
  );

  if (profileQuery.isPending) {
    return (
      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <p className="text-sm text-text-secondary" role="status">
          불러오는 중
        </p>
      </main>
    );
  }

  if (profileQuery.isError) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-12">
        <p className="text-sm text-text-danger" role="alert">
          {getApiErrorMessage(profileQuery.error, "회원 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.")}
        </p>
        <Link
          className="text-sm font-bold text-action-primary hover:underline"
          to="/login"
        >
          로그인
        </Link>
      </main>
    );
  }

  const member = profileQuery.data.result;

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-5 sm:px-10 lg:px-20">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl leading-7 font-bold tracking-tight text-text-primary">
          내 정보
        </h1>
        <Link
          className="inline-flex h-8 items-center justify-center rounded-md bg-action-primary px-3 text-xs font-extrabold text-bg-surface transition-colors hover:bg-action-primary-hover"
          to="/my-info/edit"
        >
          정보 수정
        </Link>
      </div>

      <section className="mt-4 border-y border-border-default py-3">
        <h2 className="mb-3 text-xs font-bold text-text-primary">기본 정보</h2>
        <div className="grid gap-4 sm:grid-cols-[48px_1fr_1.7fr] sm:items-center">
          <div
            className="flex size-12 items-center justify-center rounded-full bg-[#E8EBF0]"
            aria-hidden="true"
          >
            <img className="size-8" src="/icons/person.svg" alt="" />
          </div>
          <dl className="min-w-0">
            <dt className="text-[11px] leading-4 text-text-tertiary">닉네임</dt>
            <dd className="truncate text-xs font-bold text-text-primary">
              {member.nickname}
            </dd>
          </dl>
          <dl className="min-w-0">
            <dt className="text-[11px] leading-4 text-text-tertiary">이메일</dt>
            <dd className="truncate text-xs font-bold text-text-primary">
              {member.email}
            </dd>
          </dl>
        </div>
      </section>

      <section className="mt-4">
        <h2 className="mb-2 text-sm font-bold text-text-primary">내 즐겨찾기</h2>
        {bookmarkedMovies.length > 0 ? (
          <ul className="grid max-w-[500px] grid-cols-2 gap-3 sm:grid-cols-3">
            {bookmarkedMovies.map((movie) => (
              <li className="min-w-0" key={movie.id}>
                <Link
                  className="block overflow-hidden rounded-lg"
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                >
                  <img
                    className="aspect-[4/5] w-full rounded-lg object-cover transition-transform hover:scale-[1.02]"
                    src={movie.poster_path ?? ""}
                    alt={`${movie.title} 포스터`}
                  />
                  <span className="mt-1 block truncate text-xs font-bold text-text-primary">
                    {movie.title}
                  </span>
                  <span className="block text-[11px] text-text-tertiary">
                    {movie.release_date}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-y border-border-default py-10 text-center text-sm text-text-secondary">
            즐겨찾기한 영화가 없습니다.
          </p>
        )}
      </section>
    </main>
  );
}
