import { useState, type ReactNode } from 'react'
import { movies as initialMovies } from '../../data/movies'
import { MovieContext } from '../../hooks/use-movies'

export function MovieProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState(initialMovies)
  function toggleBookmark(id: number) {
    setMovies((current) => current.map((movie) => movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie))
  }
  return <MovieContext.Provider value={{ movies, toggleBookmark }}>{children}</MovieContext.Provider>
}
