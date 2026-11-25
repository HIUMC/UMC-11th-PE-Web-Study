import { AuthGate } from "@/components/layout/auth-gate";
import { LoginPage } from "@/screens/auth/login-page";

export default function Page() {
  return (
    <AuthGate mode="guest">
      <LoginPage />
    </AuthGate>
  );
}
