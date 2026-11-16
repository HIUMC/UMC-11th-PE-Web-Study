import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { useProfileStore } from "../../stores/profile-store";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { movieDetailOptions } from "../../queries/movie-queries";
import { MovieCard } from "../../components/movies/movie-card";
import { getRequestErrorMessage } from "../../api/tmdb";

export function ProfilePage() {
  const { nickname, email } = useProfileStore();
  const movieIds = useBookmarkStore(state => state.bookmarkedMovieIds);
  const bookmarkedMovies = useQueries({ queries: movieIds.map(movieDetailOptions) });
  return (
    <main className="mx-auto w-[min(1280px,calc(100%-32px))] flex-1 py-12 sm:w-[min(1280px,calc(100%-48px))] sm:py-14">
      <section aria-labelledby="profile-title">
        <h1 id="profile-title" className="text-3xl font-extrabold tracking-tight">내 정보</h1>
        <p className="mt-3 text-sm text-slate-500">화면 확인용 예시 정보예요.</p>
        <div className="mt-6 flex flex-wrap items-center gap-5 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="grid size-20 shrink-0 place-items-center rounded-full bg-blue-50">
            <img src="/icons/person.svg" alt="기본 프로필" className="size-10 opacity-60" />
          </div>
          <dl className="flex-1 space-y-3">
            <div><dt className="text-xs font-bold text-slate-500">닉네임</dt><dd className="mt-2 break-words text-lg font-bold">{nickname}</dd></div>
            <div><dt className="text-xs font-bold text-slate-500">이메일</dt><dd className="mt-2 break-all text-sm">{email}</dd></div>
          </dl>
          <Link to="/edit-profile" className="flex h-11 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700 focus-visible:ring-3 focus-visible:ring-blue-200">내 정보 수정</Link>
        </div>
      </section>
      <section aria-labelledby="bookmarks-title" className="mt-10">
        <h2 id="bookmarks-title" className="text-xl font-extrabold">내가 북마크한 영화 <span className="ml-1 text-base text-blue-600">{movieIds.length}</span></h2>
        {movieIds.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 px-5 py-12 text-center text-sm text-slate-500">
            <p>아직 북마크한 영화가 없어요.</p>
            <Link to="/" className="mt-3 inline-block font-bold text-blue-600 underline">영화 둘러보기</Link>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
            {bookmarkedMovies.map((query, index) => query.data ? <MovieCard key={movieIds[index]} movie={query.data} /> : (
              <div key={movieIds[index]} role="status" className="rounded-xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-500">
                <p>{query.isError ? getRequestErrorMessage(query.error) : "영화 정보를 불러오는 중..."}</p>
                {query.isError && <button type="button" onClick={() => { void query.refetch(); }} className="mt-3 font-bold text-blue-600">다시 시도</button>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
