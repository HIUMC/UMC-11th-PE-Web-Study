import { QueryClient } from "@tanstack/react-query";
import { isHTTPError } from "ky";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
          if (isHTTPError(error) && error.response.status >= 400 && error.response.status < 500) {
            return false;
          }
          return failureCount < 1;
        },
      },
    },
  });
}

let browserClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") return createQueryClient();
  return (browserClient ??= createQueryClient());
}
