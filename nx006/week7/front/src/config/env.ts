export interface TmdbEnv { tmdbApiBaseUrl: string; tmdbAccessToken: string }
export class TmdbConfigError extends Error {
  constructor() {
    super('TMDB 환경 변수가 필요해요. .env.example을 .env.local로 복사하고 VITE_TMDB_ACCESS_TOKEN을 입력한 뒤 개발 서버를 다시 시작해 주세요.')
    this.name = 'TmdbConfigError'
  }
}

export function readTmdbEnv(values: { VITE_TMDB_API_BASE_URL?: string; VITE_TMDB_ACCESS_TOKEN?: string }): TmdbEnv {
  const base = values.VITE_TMDB_API_BASE_URL?.trim()
  const token = values.VITE_TMDB_ACCESS_TOKEN?.trim()
  if (!base || !token) throw new TmdbConfigError()
  let url: URL
  try { url = new URL(base) } catch { throw new TmdbConfigError() }
  // 테스트에서는 loopback HTTP를 사용한다. 인증값이 URL에 섞이는 설정은 허용하지 않는다.
  if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(url.hostname))) || url.username || url.password || url.search || url.hash) throw new TmdbConfigError()
  return { tmdbApiBaseUrl: base.replace(/\/+$/, '') + '/', tmdbAccessToken: token }
}

export function getTmdbEnv(): TmdbEnv {
  return readTmdbEnv(import.meta.env ?? {})
}
