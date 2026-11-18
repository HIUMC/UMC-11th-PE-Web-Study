// 회원별 평점 조회 경로에 사용할 sub만 읽기. 토큰 검증과 권한 판단은 서버에서 처리
export function getMemberId(accessToken: string | null): number | null {
  if (!accessToken) return null;
  try {
    const payload = accessToken.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")), c => c.charCodeAt(0));
    const data: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!data || typeof data !== "object" || !("sub" in data)) return null;
    const subject = data.sub;
    if (typeof subject !== "number" && (typeof subject !== "string" || !/^\d+$/.test(subject))) return null;
    const memberId = Number(subject);
    return Number.isSafeInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
