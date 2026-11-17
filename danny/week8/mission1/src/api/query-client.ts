import { QueryClient } from "@tanstack/react-query";
import { isHTTPError } from "ky";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (isHTTPError(error) && error.response.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});
