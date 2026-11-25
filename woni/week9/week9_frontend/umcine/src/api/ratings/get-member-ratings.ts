import { apiClient } from "../api-client";
import type { Rating } from "./models";

// 백엔드가 허용하는 최대 페이지 크기
const PAGE_SIZE = 100;

// 회원의 평점 전체 (최신 등록 순)
// 공개 API라 토큰이 필요 없고, 응답이 ApiResponse로 감싸지지 않은 배열임
// 한 번에 최대 100개만 오므로 마지막 페이지까지 넘기며 모음
export async function getMemberRatings(memberId: number): Promise<Rating[]> {
  const ratings: Rating[] = [];

  for (let page = 0; ; page += 1) {
    const pageRatings = await apiClient
      .get(`members/${memberId}/ratings`, {
        searchParams: { page, size: PAGE_SIZE },
      })
      .json<Rating[]>();

    ratings.push(...pageRatings);
    if (pageRatings.length < PAGE_SIZE) return ratings;
  }
}
