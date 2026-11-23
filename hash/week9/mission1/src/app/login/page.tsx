import { LoginPage } from "../../screens/account/login-page";
import SessionBoundary from "../../components/account/session-boundary";

export const metadata = { title: "로그인" };

export default function Page() {
  return <SessionBoundary requireAuth={false}><LoginPage /></SessionBoundary>;
}
