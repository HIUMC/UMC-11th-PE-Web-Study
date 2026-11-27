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

function signup(body: SignupRequest) {
  return umcineClient.post("members", { json: body }).json<SignupResponse>();
}

export { signup, type SignupRequest, type SignupResponse };
