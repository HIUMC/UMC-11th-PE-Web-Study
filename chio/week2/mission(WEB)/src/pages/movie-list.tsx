import { useState } from 'react'
import { Header } from '../components/header'
import { MovieGrid } from '../components/movie-grid'
import { Pagination } from '../components/pagination'
import { movies } from '../data/movies'

export function MovieListPage() {
  const [movieList, setMovieList] = useState(movies)

  const handleToggleBookmark = (movieId: number) => {
    setMovieList((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    )
  }

  return (
    <div className="app-shell">
      <Header />

      <main className="movie-list-page">
        <div className="page-content">
          <h1>영화 목록</h1>
          <MovieGrid
            movies={movieList}
            onToggleBookmark={handleToggleBookmark}
          />
          <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
          <p>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </div>
      </footer>
    </div>
  )
}
