import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";

// 개발 모드에서 /?example=fetch 로 접속하면 한 번 실행돼요.
export async function runFetchMoviesExample() {
  try {
    const response = await getMoviesWithFetch(1);
    console.info('[fetch 예제] 인기 영화 응답', response);
    console.table(response.results.map(({ id, title }) => ({ id, title })));
  } catch {
    // 요청 실패도 Network에서 확인하고, 인증 정보는 로그에 남기지 않아요.
    console.warn('[fetch 예제] 요청에 실패했어요. Network에서 응답 상태를 확인해 주세요.');
  }
}
