import { authApi } from "../auth-api";

export async function deleteRating(ratingId: number) {
  await authApi.delete(`ratings/${ratingId}`);
}
