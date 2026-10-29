import ky, { type KyInstance, type Options } from 'ky'
import { getTmdbEnv, type TmdbEnv } from '../config/env.ts'

export function createTmdbClient(env: TmdbEnv, fetchImplementation?: Options['fetch']): KyInstance {
  return ky.create({
    baseUrl: env.tmdbApiBaseUrl.replace(/\/+$/, '') + '/',
    headers: { Authorization: `Bearer ${env.tmdbAccessToken}` },
    // 오류 UI의 다시 시도 버튼으로만 재요청한다. StrictMode의 effect 재실행과 구분된다.
    retry: 0,
    timeout: 10_000,
    ...(fetchImplementation ? { fetch: fetchImplementation } : {}),
  })
}

let client: KyInstance | undefined
export function getTmdbClient(): KyInstance {
  return client ??= createTmdbClient(getTmdbEnv())
}
