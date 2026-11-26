export function success<T>(
  code: 'COMMON200' | 'COMMON201',
  message: string,
  result: T,
) {
  return { isSuccess: true, code, message, result };
}
