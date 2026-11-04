import { useEffect, useEffectEvent, useState } from "react";

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: unknown };

type SettledResult<T> = { requestKey: string } & Exclude<
  AsyncState<T>,
  { status: "loading" }
>;

export function useAsync<T>(
  key: string,
  request: (signal: AbortSignal) => Promise<T>,
) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<SettledResult<T> | null>(null);
  const requestKey = `${attempt}:${key}`;
  const runRequest = useEffectEvent(request);

  useEffect(() => {
    const controller = new AbortController();

    runRequest(controller.signal).then(
      (data) => setResult({ requestKey, status: "success", data }),
      (error: unknown) => {
        if (!controller.signal.aborted) {
          setResult({ requestKey, status: "error", error });
        }
      },
    );

    return () => controller.abort();
  }, [requestKey]);

  const state: AsyncState<T> =
    result?.requestKey === requestKey ? result : { status: "loading" };

  return { state, retry: () => setAttempt((count) => count + 1) };
}
