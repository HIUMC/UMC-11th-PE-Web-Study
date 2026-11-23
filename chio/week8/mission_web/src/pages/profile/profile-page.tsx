import { Link } from '@tanstack/react-router'
import { useQueries } from '@tanstack/react-query'
import { authButtonClass } from '../../components/auth/auth-form'
import { MovieCard } from '../../components/movies/movie-card'
import { useFavorites, useMe } from '../../queries/member'
import { movieQueries } from '../../queries/movies'
import { useAuthStore } from '../../stores/auth-store'

export function ProfilePage() {
  const me = useMe()
  const favorites = useFavorites()
  const movies = useQueries({ queries: (favorites.data ?? []).map(({ movieId }) => movieQueries.detail(movieId)) })

  return (
    <main className="mx-auto w-[calc(100%-48px)] max-w-[1336px] py-7 max-[680px]:w-[calc(100%-32px)]">
      <div className="flex flex-wrap justify-between gap-3">
        <h1 className="text-[30px] font-extrabold">내 정보</h1>
        {me.data && <div className="flex items-center gap-4">
          <button className="text-sm font-bold text-[#697383] hover:underline" type="button"
            onClick={() => useAuthStore.getState().setAccessToken(null)}>로그아웃</button>
          <Link className={authButtonClass} to="/profile/edit">내 정보 수정</Link>
        </div>}
      </div>
      {me.isLoading && <p className="mt-4" role="status">내 정보를 불러오는 중이에요.</p>}
      {me.isError && <button className={authButtonClass} onClick={() => void me.refetch()}>내 정보 다시 불러오기</button>}
      {me.data && <dl className="mt-5 grid max-w-xl grid-cols-[auto_1fr] gap-x-8 gap-y-3 rounded-lg border border-[#dfe4eb] bg-white p-5 text-sm">
        <dt className="font-bold">이메일</dt><dd className="break-all">{me.data.email}</dd>
        <dt className="font-bold">닉네임</dt><dd className="break-all">{me.data.nickname}</dd>
        <dt className="font-bold">가입일</dt><dd><time dateTime={me.data.createdAt}>{me.data.createdAt.slice(0, 10).replaceAll('-', '.')}</time></dd>
      </dl>}
      <section className="mt-9" aria-labelledby="favorites-title">
        <h2 id="favorites-title" className="mb-4 text-xl font-extrabold">즐겨찾기</h2>
        {favorites.isPending && <p role="status">즐겨찾기를 불러오는 중이에요.</p>}
        {favorites.isError && <button className={authButtonClass} onClick={() => void favorites.refetch()}>즐겨찾기 다시 불러오기</button>}
        {favorites.data?.length === 0 && <p className="text-sm text-[#697383]">즐겨찾기한 영화가 없어요.</p>}
        <ul className="grid grid-cols-5 gap-4 max-[1050px]:grid-cols-3 max-[680px]:grid-cols-2">
          {favorites.data?.map(({ movieId }, index) => {
            const movie = movies[index]
            return <li key={movieId}>
              {movie.data ? <MovieCard movie={movie.data} /> : movie.isError ? (
                <div className="rounded-lg border border-[#dfe4eb] bg-white p-3 text-sm">
                  <Link className="text-[#245feb] underline" to="/movies/$movieId" params={{ movieId: String(movieId) }}>영화 #{movieId}</Link>
                  <button className="mt-2 block underline" onClick={() => void movie.refetch()}>정보 다시 불러오기</button>
                </div>
              ) : <p className="text-sm" role="status">영화 정보를 불러오는 중이에요.</p>}
            </li>
          })}
        </ul>
      </section>
    </main>
  )
}
