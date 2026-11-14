import ky, { type KyInstance, type Options } from 'ky'
import { getTmdbEnv, type TmdbEnv } from '../config/env.ts'

export function createTmdbClient(env: TmdbEnv, fetchImplementation?: Options['fetch']): KyInstance {
  return ky.create({
    baseUrl: env.tmdbApiBaseUrl.replace(/\/+$/, '') + '/',
    headers: { Authorization: `Bearer ${env.tmdbAccessToken}` },
    // HTTP retry는 끈다. 영화 화면의 재시도 정책은 QueryClient에서 관리한다.
    retry: 0,
    timeout: 10_000,
    ...(fetchImplementation ? { fetch: fetchImplementation } : {}),
  })
}

let client: KyInstance | undefined
export function getTmdbClient(): KyInstance {
  return client ??= createTmdbClient(getTmdbEnv())
}
