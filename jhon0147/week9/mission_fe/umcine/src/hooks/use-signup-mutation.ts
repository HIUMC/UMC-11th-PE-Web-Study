import { useMutation } from "@tanstack/react-query";
import { signupOptions } from "../mutations/account-mutations";

export function useSignupMutation() {
  return useMutation(signupOptions);
}
