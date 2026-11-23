import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signup } from "../api/members/signup";
import { getApiErrorMessage } from "../utils/api-error-message";
export function useSignupMutation() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => { alert(response.message); void navigate({ to: "/login" }); },
    onError: (error) => alert(getApiErrorMessage(error, "회원가입에 실패했어요. 다시 시도해 주세요.")),
  });
}
