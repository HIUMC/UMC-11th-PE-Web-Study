import { HTTPError } from "ky";

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (!(error instanceof HTTPError)) return fallbackMessage;
  const body: unknown = error.data;
  return body !== null && typeof body === "object" && "message" in body &&
    typeof body.message === "string" ? body.message : fallbackMessage;
}
