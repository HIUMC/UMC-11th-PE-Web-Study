import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "회원가입",
  description: "UMCine 계정을 만들어 보세요.",
};

export default function SignupPage() {
  return <SignupForm />;
}
