interface TokenPayload {
  sub?: string;
  exp?: number;
}

function decodePayload(token: string): TokenPayload | null {
  const payload = token.split(".")[1];
  if (!payload) {
    return null;
  }
  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = new TextDecoder().decode(
      Uint8Array.from(atob(base64), (char) => char.charCodeAt(0)),
    );
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}

export function getMemberIdFromToken(token: string) {
  const memberId = Number(decodePayload(token)?.sub);
  return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
}

export function isTokenExpired(token: string) {
  const exp = decodePayload(token)?.exp;
  return typeof exp !== "number" || exp * 1000 <= Date.now();
}
