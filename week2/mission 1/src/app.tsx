import { useState } from 'react'
import { Header } from './components/header'
import { MovieGrid } from './components/movie-grid'
import { Pagination } from './components/pagination'
import { Footer } from './components/footer'
import { movies as initialMovies } from './data/movies'
import './app.css'

const pageSize = 10

export default function App() {
  const [movies, setMovies] = useState(initialMovies)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(movies.length / pageSize)
  const visibleMovies = movies.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    )
  }

  return (
    <>
      <Header />
      <main id="movie-list" className="movie-list container">
        <h1>영화 목록</h1>
        <MovieGrid movies={visibleMovies} onToggleBookmark={handleToggleBookmark} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </main>
      <Footer />
    </>
  )
}
