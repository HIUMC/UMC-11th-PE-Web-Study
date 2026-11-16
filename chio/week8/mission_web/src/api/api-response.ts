import { isHTTPError } from 'ky'

export type ApiResponse<T> = { isSuccess: boolean; code: string; message: string; result: T }

export async function unwrap<T>(request: Promise<ApiResponse<T>>) {
  const response = await request
  if (!response.isSuccess) throw new Error(response.message)
  return response.result
}

export function apiErrorMessage(error: unknown, fallback: string) {
  if (isHTTPError(error) && error.data && typeof error.data === 'object' && 'message' in error.data
    && typeof error.data.message === 'string') return error.data.message
  return fallback
}
