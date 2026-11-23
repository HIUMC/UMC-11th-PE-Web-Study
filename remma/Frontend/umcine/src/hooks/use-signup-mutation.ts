import { mutationOptions, useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getApiErrorMessage } from "../api/api-response";
import { signup } from "../api/members/signup";

export const signupMutationOptions = mutationOptions({
  mutationKey: ["members", "signup"] as const,
  mutationFn: signup,
});

interface UseSignupMutationOptions {
  onErrorMessage?: (message: string) => void;
}

export function useSignupMutation(options?: UseSignupMutationOptions) {
  const navigate = useNavigate();

  return useMutation({
    ...signupMutationOptions,
    onSuccess: (response) => {
      alert(response.message || "회원가입에 성공했습니다.");
      navigate({ to: "/login" });
    },
    onError: async (error) => {
      const message = await getApiErrorMessage(
        error,
        "회원가입에 실패했어요. 다시 시도해 주세요.",
      );
      if (options?.onErrorMessage) {
        options.onErrorMessage(message);
      } else {
        alert(message);
      }
    },
  });
}
