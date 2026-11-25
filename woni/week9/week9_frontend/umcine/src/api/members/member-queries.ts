import { queryOptions } from "@tanstack/react-query";
import { getMe } from "./me";

const FIVE_MINUTES = 5 * 60 * 1000;

export const memberQueries = {
  me: () =>
    queryOptions({
      queryKey: ["members", "me"],
      queryFn: getMe,
      staleTime: FIVE_MINUTES,
      retry: false,
    }),
};
