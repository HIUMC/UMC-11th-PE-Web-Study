import ky, { type KyInstance, type Options } from 'ky'

export class MemberConfigError extends Error {
  constructor() {
    super('회원 서버 주소가 필요해요. .env.local에 VITE_API_BASE_URL을 설정하고 개발 서버를 다시 시작해 주세요.')
    this.name = 'MemberConfigError'
  }
}

export function readMemberBaseUrl(values: { VITE_API_BASE_URL?: string; VITE_MOVIE_API_BASE_URL?: string }): string {
  // 이전 회원·평점 실습의 설정도 보존한다. 값이 없을 때 프론트 origin으로 보내지 않는다.
  const base = (values.VITE_API_BASE_URL ?? values.VITE_MOVIE_API_BASE_URL)?.trim()
  if (!base) throw new MemberConfigError()
  let url: URL
  try { url = new URL(base) } catch { throw new MemberConfigError() }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new MemberConfigError()
  return base.replace(/\/+$/, '') + '/'
}

export function createMemberClient(baseUrl: string, fetchImplementation?: Options['fetch']): KyInstance {
  return ky.create({
    baseUrl: readMemberBaseUrl({ VITE_API_BASE_URL: baseUrl }),
    retry: 0,
    timeout: 10_000,
    credentials: 'omit',
    ...(fetchImplementation ? { fetch: fetchImplementation } : {}),
  })
}
let client: KyInstance | undefined
export function getMemberClient(): KyInstance {
  return client ??= createMemberClient(readMemberBaseUrl(import.meta.env ?? {}))
}
