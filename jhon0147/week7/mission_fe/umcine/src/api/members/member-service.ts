import type { KyInstance } from "ky";

export interface DuplicateResponse {
  available: boolean;
}

export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

export interface SignupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    memberId: number;
    email: string;
    nickname: string;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readResult(data: unknown): Record<string, unknown> {
  if (!isRecord(data)) throw new Error("서버 응답 형식을 확인해 주세요.");
  if (!("isSuccess" in data)) return data;
  if (data.isSuccess !== true) {
    throw new Error(typeof data.message === "string" ? data.message : "요청을 처리하지 못했어요.");
  }
  if (!isRecord(data.result)) throw new Error("서버 응답에 결과가 없어요.");
  return data.result;
}

export function createMemberService(client: KyInstance) {
  async function checkDuplicate(kind: "email" | "nickname", value: string): Promise<DuplicateResponse> {
    const trimmed = value.trim();
    if (!trimmed) throw new Error("중복 확인할 값을 입력해 주세요.");
    const data: unknown = await client.get(`members/${kind}/${encodeURIComponent(trimmed)}`).json();
    const result = readResult(data);
    if (typeof result.available !== "boolean") throw new Error("중복 확인 응답 형식을 확인해 주세요.");
    return { available: result.available };
  }

  return {
    checkEmailDuplicate: (email: string) => checkDuplicate("email", email),
    checkNicknameDuplicate: (nickname: string) => checkDuplicate("nickname", nickname),
    async signup(body: SignupRequest): Promise<SignupResponse> {
      const data: unknown = await client.post("members", {
        json: { email: body.email.trim(), nickname: body.nickname.trim(), password: body.password },
      }).json();
      const result = readResult(data);
      if (!isRecord(data) || data.isSuccess !== true || typeof data.code !== "string" ||
          typeof data.message !== "string" || !Number.isSafeInteger(result.memberId) ||
          (result.memberId as number) <= 0 || typeof result.email !== "string" || typeof result.nickname !== "string") {
        throw new Error("회원가입 응답 형식을 확인해 주세요.");
      }
      return {
        isSuccess: true, code: data.code, message: data.message,
        result: { memberId: result.memberId as number, email: result.email, nickname: result.nickname },
      };
    },
  };
}
