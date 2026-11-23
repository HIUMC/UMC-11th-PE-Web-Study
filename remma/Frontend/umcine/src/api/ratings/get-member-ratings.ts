import { apiClient } from "../api-client";
import type { ApiResponse } from "../api-response";
import type { RatingItem } from "./models";

export async function getMemberRatings(memberId: number): Promise<RatingItem[]> {
  const response = await apiClient
    .get(`members/${memberId}/ratings`)
    .json<RatingItem[] | ApiResponse<RatingItem[]>>();

  if (Array.isArray(response)) {
    return response;
  }

  return response.result ?? [];
}
