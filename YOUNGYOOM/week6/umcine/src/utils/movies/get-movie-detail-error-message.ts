import { isHTTPError } from "ky";

//로딩과 오류 state, Effect 정리 함수
//Effect 의존성에는 숫자로 바꾼 영화 ID를 넣음
//요청 실패시 getMovieDetailErrorMessage(error)의 반환값을 오류 state에 저장
export function getMovieDetailErrorMessage(error: unknown) {
  if (isHTTPError(error) && error.response.status === 404) {
    return "영화를 찾을 수 없어요.";
  }

  return "영화 정보를 불러오지 못했어요.";
}
