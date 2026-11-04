export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
export interface HttpResult<T> {
  method: string;
  path: string;
  status: number;
  body: ApiResponse<T> | null;
}
export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
}
export interface Member {
  memberId: number;
  email: string;
  nickname: string;
}
const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080").replace(/\/$/, "");

async function request<T>(method: string, path: string, data?: unknown): Promise<HttpResult<T>> {
  let response: Response;
  try {
    response = await fetch(baseUrl + path, {
      method,
      headers: data === undefined ? undefined : { "Content-Type": "application/json" },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  } catch {
    throw new Error("서버에 연결할 수 없어요. 서버 실행 상태와 API 주소를 확인해주세요.");
  }
  // 삭제 성공 응답에는 JSON 본문이 없습니다.
  const body = response.status === 204 ? null : await response.json() as ApiResponse<T>;
  return { method, path, status: response.status, body };
}
export function signUp(email: string, password: string, nickname: string) {
  return request<Member>("POST", "/members", { email, password, nickname });
}
export function getRatings(memberId: number) {
  return request<Rating[]>("GET", "/members/" + memberId + "/ratings");
}
export function saveRating(memberId: number, ratingId: number | null, movieId: number, score: number, comment: string) {
  const path = "/members/" + memberId + "/ratings";
  return ratingId === null
    ? request<number>("POST", path, { movieId, score, comment })
    : request<null>("PATCH", path + "/" + ratingId, { score, comment });
}
export function deleteRating(memberId: number, ratingId: number) {
  return request<null>("DELETE", "/members/" + memberId + "/ratings/" + ratingId);
}
