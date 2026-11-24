import type { Metadata } from "next";
import { SignupPage } from "../../screens/auth/signup-page";

export const metadata: Metadata = {
  title: "회원가입 | UMCINE",
};

export default function SignupRoutePage() {
  return <SignupPage />;
}
