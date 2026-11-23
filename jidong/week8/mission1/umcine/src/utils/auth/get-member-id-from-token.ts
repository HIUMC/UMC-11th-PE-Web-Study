// JWT payload의 sub에 memberId가 들어 있음 (payload는 암호화가 아니라 인코딩이라 프론트에서도 읽을 수 있음)
// 내 정보 API 응답에 memberId가 없어서, 내 평점 목록(GET /members/{memberId}/ratings)을 찾을 때만 씀
// 서명 검증은 서버가 하니까 여기서는 화면 표시용으로만 사용함
export function getMemberIdFromToken(accessToken: string | null) {
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const memberId = Number(JSON.parse(json).sub);
    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
