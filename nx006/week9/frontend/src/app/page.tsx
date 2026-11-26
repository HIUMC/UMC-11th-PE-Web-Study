import { MovieListPage } from '../screens/movies/movie-list-page'
import { parsePage } from '../utils/movie-params'

export const metadata = { title: { absolute: 'UMCine — 영화 목록' } }

export default async function Page({ searchParams }: PageProps<'/'>) {
  const { page } = await searchParams
  return <MovieListPage page={parsePage(page)} />
}
