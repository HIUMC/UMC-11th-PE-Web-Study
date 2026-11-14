export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess) throw new Error(response.message || "요청을 처리하지 못했어요.");
  return response.result;
}

// 삭제 API는 JSON 응답과 204 No Content를 모두 지원합니다.
export async function checkMutationResponse(response: Response): Promise<void> {
  const text = await response.text();
  if (text.trim()) unwrapResponse(JSON.parse(text) as ApiResponse<unknown>);
}
