"use client";
import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "@/stores/auth-store";
export function Providers({ children }: { children: ReactNode }) {
 const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30 * 1000 } } }));
 useEffect(() => {
  const unsubscribe = useAuthStore.subscribe((state, previous) => {
   if (state.accessToken === previous.accessToken) return;
   const filters = { predicate: (query: { queryKey: readonly unknown[] }) => ["members", "ratings", "favorites"].includes(String(query.queryKey[0])) };
   void queryClient.cancelQueries(filters); queryClient.removeQueries(filters);
  });
  void useAuthStore.persist.rehydrate(); return unsubscribe;
 }, [queryClient]);
 return <QueryClientProvider client={queryClient}>{children}{process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}</QueryClientProvider>;
}
