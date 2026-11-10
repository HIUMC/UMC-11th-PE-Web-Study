import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth-store";

export function SessionButton() {
  const token = useAuthStore(state => state.token);
  const logout = useAuthStore(state => state.logout);
  const client = useQueryClient();
  if (!token) return <a className="login" href="/login">로그인</a>;
  return <button className="login" type="button" onClick={() => { logout(); client.clear(); location.assign("/login"); }}>로그아웃</button>;
}
