import { Navigate, Outlet, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

/** 로그인 전용 페이지들을 감싸는 공통 레이아웃 컴포넌트예요. */
export function ProtectedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const location = useLocation();

  // 페이지에 머무는 중 401 등으로 토큰이 비워지면 로그인 페이지로 이동해요.
  if (!accessToken) {
    return (
      <Navigate to="/login" search={{ redirect: location.href }} replace />
    );
  }

  return <Outlet />;
}
