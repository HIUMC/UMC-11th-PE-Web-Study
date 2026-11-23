export function getMemberId(accessToken: string | null): number | null {
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1];
    if (!payload) return null;

    const base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const paddedBase64 = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      "=",
    );

    const bytes = Uint8Array.from(
      atob(paddedBase64),
      (character) => character.charCodeAt(0),
    );

    const decoded: unknown = JSON.parse(
      new TextDecoder().decode(bytes),
    );

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("sub" in decoded) ||
      typeof decoded.sub !== "string" ||
      !/^[1-9]\d*$/.test(decoded.sub)
    ) {
      return null;
    }

    const memberId = Number(decoded.sub);

    return Number.isSafeInteger(memberId) ? memberId : null;
  } catch {
    return null;
  }
}