import { isHTTPError } from 'ky'
import type { NextRequest } from 'next/server'
import { getMovieDetail } from '../../../../api/movies/get-movie-detail'
import { getMovies } from '../../../../api/movies/get-movies'
import { searchMovies } from '../../../../api/movies/search-movies'
import { TmdbConfigError } from '../../../../config/env'
import { parseMovieId, parsePage } from '../../../../utils/movie-params'
import { createServerTmdbClient } from '../../../../server/tmdb'

const responseOptions = { headers: { 'Cache-Control': 'no-store' } }

export async function GET(request: NextRequest, { params }: RouteContext<'/api/tmdb/[...resource]'>) {
  const { resource } = await params
  const [category, action] = resource
  const movieId = resource.length === 2 && category === 'movie' ? parseMovieId(action) : null
  const popular = resource.length === 2 && category === 'movie' && action === 'popular'
  const search = resource.length === 2 && category === 'search' && action === 'movie'
  if (!popular && !search && movieId === null) {
    return Response.json({ message: '지원하지 않는 영화 경로예요.' }, { ...responseOptions, status: 404 })
  }

  const page = parsePage(request.nextUrl.searchParams.get('page'))
  const query = request.nextUrl.searchParams.get('query') ?? ''
  const signal = request.signal
  try {
    const client = createServerTmdbClient()
    if (popular) return Response.json(await getMovies({ page, signal }, client), responseOptions)
    if (search) return Response.json(await searchMovies({ query, page, signal }, client), responseOptions)
    return Response.json(await getMovieDetail(movieId!, signal, client), responseOptions)
  } catch (error) {
    const status = isHTTPError(error) ? error.response.status : error instanceof TmdbConfigError ? 503 : 502
    const message = error instanceof TmdbConfigError ? error.message : '영화 서버의 요청을 완료하지 못했어요.'
    return Response.json({ message }, { ...responseOptions, status })
  }
}
