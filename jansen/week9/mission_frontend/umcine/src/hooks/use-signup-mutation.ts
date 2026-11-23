import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signup } from "@/api/members/signup";
import { getErrorMessage } from "@/utils/get-error-message";

export function useSignupMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      alert(response.message);
      router.push("/login");
    },
    onError: async (error) => {
      alert(await getErrorMessage(error, "회원가입에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
