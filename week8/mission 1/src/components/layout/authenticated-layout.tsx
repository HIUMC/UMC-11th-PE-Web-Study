import { Navigate, Outlet } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";

export function AuthenticatedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);
  // 요청 중 토큰이 만료된 경우에도 하위 페이지를 즉시 숨깁니다.
  if (!accessToken) return <Navigate to="/login" replace />;
  return <Outlet />;
}
