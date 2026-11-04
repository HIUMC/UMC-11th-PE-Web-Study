import { isHTTPError, isNetworkError, isTimeoutError } from "ky";

export function isNotFoundError(error: unknown) {
  return isHTTPError(error) && error.response.status === 404;
}

export function getErrorMessage(error: unknown) {
  if (isHTTPError(error)) {
    if (error.response.status === 401) {
      return "TMDB 인증에 실패했어요. API 토큰을 확인해 주세요.";
    }
    return `TMDB 요청이 실패했어요. (${error.response.status})`;
  }
  if (isTimeoutError(error)) {
    return "응답이 늦어지고 있어요. 잠시 후 다시 시도해 주세요.";
  }
  if (isNetworkError(error)) {
    return "네트워크에 연결할 수 없어요. 연결 상태를 확인해 주세요.";
  }
  return "영화 정보를 불러오지 못했어요.";
}

// 우리 Spring 서버(umcClient) 요청용 메시지
export function getServerErrorMessage(error: unknown) {
  if (isHTTPError(error)) {
    switch (error.response.status) {
      case 400:
        return "형식이 올바르지 않아요. (400)";
      case 404:
        return "존재하지 않는 유저예요. (404)";
      default:
        return `서버 요청이 실패했어요. (${error.response.status})`;
    }
  }
  if (isTimeoutError(error)) {
    return "서버 응답이 늦어지고 있어요.";
  }
  if (isNetworkError(error)) {
    return "서버에 연결할 수 없어요. Spring 서버가 켜져 있는지, CORS 설정을 확인해 주세요.";
  }
  return "요청을 처리하지 못했어요.";
}
