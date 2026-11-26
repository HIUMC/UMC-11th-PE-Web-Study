import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signup } from "../api/members/signup";
import { getApiErrorMessage } from "../utils/api-error-message";
export function useSignupMutation() {
  const router = useRouter();
  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => { alert(response.message); void router.push("/login"); },
    onError: (error) => alert(getApiErrorMessage(error, "회원가입에 실패했어요. 다시 시도해 주세요.")),
  });
}
