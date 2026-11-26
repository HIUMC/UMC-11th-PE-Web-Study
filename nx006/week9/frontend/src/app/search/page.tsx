import { SearchPage } from '../../screens/movies/search-page'
import { parsePage } from '../../utils/movie-params'

export const metadata = { title: '영화 검색' }

export default async function Page({ searchParams }: PageProps<'/search'>) {
  const { query, page } = await searchParams
  return <SearchPage query={typeof query === 'string' ? query.trim() : ''} page={parsePage(page)} />
}
