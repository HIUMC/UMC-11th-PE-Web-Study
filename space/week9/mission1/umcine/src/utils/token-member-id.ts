// Only identifies the public ratings URL. Authentication/ownership is verified by the server.
export function getTokenMemberId(token: string | null): number | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, "=")));
    const id = Number(claims.sub);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  } catch { return null; }
}
