export function getMemberIdFromToken(
  accessToken: string | null,
): number | null {
  if (!accessToken) return null;

  try {
    const parts = accessToken.split(".");
    if (parts.length !== 3) return null;

    // JWT의 두 번째 부분인 payload를 읽어요.
    const base64 = parts[1]
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

    const payload: unknown = JSON.parse(
      new TextDecoder().decode(bytes),
    );

    if (
      typeof payload !== "object" ||
      payload === null ||
      !("sub" in payload) ||
      typeof payload.sub !== "string" ||
      !/^[1-9]\d*$/.test(payload.sub)
    ) {
      return null;
    }

    const memberId = Number(payload.sub);

    return Number.isSafeInteger(memberId) ? memberId : null;
  } catch {
    return null;
  }
}