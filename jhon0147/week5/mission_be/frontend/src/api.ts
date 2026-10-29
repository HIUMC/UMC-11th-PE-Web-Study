export interface CheckResponse {
  available: boolean;
}

export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080").replace(/\/$/, "");

async function getJson<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(baseUrl + path);
  } catch {
    throw new Error("서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.");
  }

  if (!response.ok) {
    if (response.status === 404) throw new Error("존재하지 않는 회원입니다.");
    if (response.status === 400) throw new Error("입력한 값을 확인해 주세요.");
    throw new Error("데이터를 불러오지 못했어요. 다시 시도해 주세요.");
  }

  return response.json() as Promise<T>;
}

export function checkNickname(nickname: string) {
  return getJson<CheckResponse>("/members/nickname/" + encodeURIComponent(nickname));
}

export function checkEmail(email: string) {
  return getJson<CheckResponse>("/members/email/" + encodeURIComponent(email));
}

export function getMemberRatings(memberId: number) {
  return getJson<RatingResponse[]>("/members/" + memberId + "/ratings");
}
