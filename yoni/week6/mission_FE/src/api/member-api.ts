const BASE_URL = "http://localhost:3000";

export async function checkNickname(nickname: string) {
  const response = await fetch(
    `${BASE_URL}/members/nickname/${encodeURIComponent(nickname)}`,
  );

  if (!response.ok) {
    throw new Error("닉네임 중복 확인에 실패했어요.");
  }

  return response.json() as Promise<{ available: boolean }>;
}

export async function checkEmail(email: string) {
  const response = await fetch(
    `${BASE_URL}/members/email/${encodeURIComponent(email)}`,
  );

  if (!response.ok) {
    throw new Error("이메일 중복 확인에 실패했어요.");
  }

  return response.json() as Promise<{ available: boolean }>;
}

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getMemberRatings(memberId: number) {
  const response = await fetch(`${BASE_URL}/members/${memberId}/ratings`);

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "존재하지 않는 회원이에요."
        : "평점 조회에 실패했어요.",
    );
  }

  return response.json() as Promise<Rating[]>;
}
