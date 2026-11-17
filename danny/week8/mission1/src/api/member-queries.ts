import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { LoginRequest, SignUpRequest } from "../types/member";
import { getMyInfo, logIn, signUp, updateMyInfo } from "./members-api";
import { queryClient } from "./query-client";

export const memberKeys = {
  me: ["members", "me"] as const,
};

export function myInfoQueryOptions() {
  return queryOptions({
    queryKey: memberKeys.me,
    queryFn: ({ signal }) => getMyInfo(signal),
  });
}

export function loginMutationOptions() {
  return mutationOptions({
    mutationKey: ["auth", "login"],
    mutationFn: (request: LoginRequest) => logIn(request),
  });
}

export function signUpMutationOptions() {
  return mutationOptions({
    mutationKey: ["members", "sign-up"],
    mutationFn: (request: SignUpRequest) => signUp(request),
  });
}

export function updateMyInfoMutationOptions() {
  return mutationOptions({
    mutationKey: ["members", "me", "update"],
    mutationFn: (nickname: string) => updateMyInfo(nickname),
    onSuccess: (memberInfo) => {
      queryClient.setQueryData(memberKeys.me, memberInfo);
    },
  });
}
