import { authApi } from "../auth-api";
import type { Rating } from "./models";

interface GetMemberRatingsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating[];
}

export async function getMemberRatings(memberId: number): Promise<Rating[]> {
  const response = await authApi
    .get(`members/${memberId}/ratings`)
    .json<GetMemberRatingsResponse>();
  return response.result;
}