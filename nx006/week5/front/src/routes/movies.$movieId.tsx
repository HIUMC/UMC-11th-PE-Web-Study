import { createFileRoute } from '@tanstack/react-router'
import { MovieDetailScreen } from '../pages/movies/movie-detail-page'
export const Route = createFileRoute('/movies/$movieId')({ component: MovieDetailScreen })
