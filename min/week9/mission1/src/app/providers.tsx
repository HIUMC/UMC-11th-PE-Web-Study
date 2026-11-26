"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "../store/auth-store";
import { useBookmarkStore } from "../store/bookmark-store";
export default function Providers({children}: {children: ReactNode}) {
 const router = useRouter();
 const [client] = useState(() => new QueryClient({defaultOptions:{queries:{staleTime:60000,gcTime:600000,refetchOnWindowFocus:false}}}));
 useEffect(() => { useAuthStore.getState().hydrate(); void useBookmarkStore.persist.rehydrate(); const expired = () => {client.clear();router.replace("/login?expired=1");}; window.addEventListener("umcine:session-expired",expired); return () => window.removeEventListener("umcine:session-expired",expired); },[client,router]);
 return <QueryClientProvider client={client}>{children}{process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false}/>}</QueryClientProvider>;
}

