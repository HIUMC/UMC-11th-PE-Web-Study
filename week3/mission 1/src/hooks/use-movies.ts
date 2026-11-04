import { createContext, useContext } from 'react'
import type { Movie } from '../types/movie'

export const MovieContext = createContext<{ movies: Movie[]; toggleBookmark: (id: number) => void } | null>(null)
export function useMovies() {
  const context = useContext(MovieContext)
  if (!context) throw new Error('MovieProvider가 필요합니다.')
  return context
}
