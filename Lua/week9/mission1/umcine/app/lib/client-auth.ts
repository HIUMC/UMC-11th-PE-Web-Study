const tokenKey = "umcine-access-token";

function apiUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  return `${baseUrl.replace(/\/$/, "")}/${path}`;
}

export function getAccessToken() {
  return localStorage.getItem(tokenKey);
}

export function setAccessToken(token: string) {
  localStorage.setItem(tokenKey, token);
}

export async function postJson<T>(path: string, body: unknown) {
  const response = await fetch(apiUrl(path), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error("요청에 실패했습니다.");
  return response.json() as Promise<T>;
}
