import { umcineClient } from "../umcine-client";

interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

interface SignupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    memberId: number;
    email: string;
    nickname: string;
  };
}

// passwordConfirm은 화면에서만 검사해서 요청에는 안 넣음
function signup(body: SignupRequest) {
  return umcineClient.post("members", { json: body }).json<SignupResponse>();
}

export { signup, type SignupRequest, type SignupResponse };
