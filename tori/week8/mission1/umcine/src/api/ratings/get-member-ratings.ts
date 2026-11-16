import { apiClient } from "../api-client";
import type { Rating } from "./models";

export async function getMemberRatings(
  memberId: number,
): Promise<Rating[]> {
  return apiClient
    .get(`members/${memberId}/ratings`)
    .json<Rating[]>();
}