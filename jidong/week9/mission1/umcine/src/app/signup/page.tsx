import type { Metadata } from "next";
import { SignupPage } from "../../screens/members/signup-page";

export const metadata: Metadata = {
  title: "회원가입",
  description: "UMCine 회원이 되어 평점과 즐겨찾기를 남겨요.",
};

export default function Page() {
  return <SignupPage />;
}
