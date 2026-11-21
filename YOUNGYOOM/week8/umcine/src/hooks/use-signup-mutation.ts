import { useMutation } from "@tanstack/react-query";
import { signup } from "../api/members/signup";
// import { useNavigate } from "@tanstack/react-router";

//회원 가입 요청과 성공/실패 처리를 관리하는 커스텀 훅
export function useSignupMutation() {
  // const navigate = useNavigate();

  return useMutation({
    //폼에서 mutate(회원가입 정보)를 호출하면 signup이 API 요청을 보냄
    mutationFn: signup,
    //회원가입 성공 시 서버가 반환한 메시지 보여줔
    onSuccess: (response) => {
      alert(response.message);

      // 로그인 페이지 연결 후 주석 해제
      // navigate({ to: "/login" });
    },
    //요청이 실패하면 공통 오류 메시지를 보여줌
    onError: () => {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
