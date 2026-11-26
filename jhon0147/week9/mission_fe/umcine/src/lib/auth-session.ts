import type { Query, QueryClient } from "@tanstack/react-query";

export function isPrivateQuery(query: Query) {
  const [first, second] = query.queryKey;
  return first === "favorites" || first === "ratings" || (first === "members" && second === "me");
}

export function clearPrivateQueries(queryClient: QueryClient) {
  const canceled = queryClient.cancelQueries({ predicate: isPrivateQuery });
  queryClient.removeQueries({ predicate: isPrivateQuery });
  return canceled;
}
