// JWT payload의 sub(회원 ID)를 꺼낸다. 서명 검증은 서버가 하므로 화면 표시용으로만 쓴다.
export function getMemberIdFromToken(token: string | null): number | null {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const memberId = Number(JSON.parse(json).sub);
    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
