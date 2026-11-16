import ky from 'ky'
import { env } from '../config/env'

const isAccessToken = env.tmdbKey.startsWith('eyJ')

export const tmdbClient = ky.create({
  baseUrl: `${env.tmdbApiBaseUrl}/`,
  headers: isAccessToken ? { Authorization: `Bearer ${env.tmdbKey}` } : {},
  searchParams: isAccessToken ? {} : { api_key: env.tmdbKey },
  // 재시도는 TanStack Query에서 관리합니다.
  retry: 0,
})
