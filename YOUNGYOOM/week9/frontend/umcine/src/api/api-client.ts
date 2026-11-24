import ky from "ky";

export const apiClient = ky.create({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
});
