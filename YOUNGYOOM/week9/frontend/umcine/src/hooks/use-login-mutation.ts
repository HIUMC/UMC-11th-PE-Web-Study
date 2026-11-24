import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/members/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  //헤더의 내 정보 쿼리가 사용하는 QueryClient 가져옴
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    //로그인 폼에서 mutate({email, password}) 호출 시 실행
    mutationFn: login,
    onSuccess: (response) => {
      //내 정보 요청에 토큰을 사용할 수 있도록 먼저 저장
      setAccessToken(response.result.accessToken);
      alert("로그인에 성공했어요.");
      //내 정보 캐시를 오래된 상태로 표시
      //활성 쿼리를 재요청, 토큰이 없어서 비활성 상태였다면 토큰이 반영되어 쿼리가 활성화될 때 조회
      queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      //로그인 성공 후 홈 이동
      router.push("/?page=1");
    },
    onError: () => {
      //비밀번호 오류 or 네트워크 요청 실패
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
