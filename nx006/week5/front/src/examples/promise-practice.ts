// 학습용 함수. import만으로 요청하거나 Console에 출력하지 않는다.
export async function promiseStatusPractice(log: (message: string) => void, fail = false): Promise<void> {
  log('pending')
  const request = fail ? Promise.reject(new Error('실습 실패')) : Promise.resolve('영화 요청 완료')
  await request.then(() => log('fulfilled')).catch(() => log('rejected')).finally(() => log('finally'))
}
export function loadWithThen<T>(request: () => Promise<T>, onReject: () => void = () => {}): Promise<T> {
  return request().then(value => value).catch((error: unknown) => { onReject(); throw error })
}
export async function loadWithAsyncAwait<T>(request: () => Promise<T>, onReject: () => void = () => {}): Promise<T> {
  try { return await request() } catch (error) { onReject(); throw error }
}
