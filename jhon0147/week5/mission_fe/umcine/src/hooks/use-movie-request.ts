import { useCallback, useEffect, useState } from "react";
import { getRequestErrorMessage } from "../api/tmdb";

interface RequestState<T> {
  key: string;
  attempt: number;
  load: ((signal: AbortSignal) => Promise<T>) | null;
  status: "loading" | "success" | "error";
  data: T | null;
  error: string;
}

export function useMovieRequest<T>(
  key: string,
  load: (signal: AbortSignal) => Promise<T>,
  enabled = true,
) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<RequestState<T>>({
    key: "", attempt: -1, load: null, status: "loading", data: null, error: "",
  });

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const controller = new AbortController();

    async function run() {
      try {
        const data = await load(controller.signal);
        if (active) setState({ key, attempt, load, status: "success", data, error: "" });
      } catch (error) {
        if (active && !controller.signal.aborted) {
          setState({
            key, attempt, load, status: "error", data: null,
            error: getRequestErrorMessage(error),
          });
        }
      }
    }
    void run();
    return () => {
      active = false;
      controller.abort();
    };
  }, [key, load, enabled, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  const isCurrent = state.key === key && state.attempt === attempt && state.load === load;
  return {
    status: !enabled ? "idle" : isCurrent ? state.status : "loading",
    data: enabled && isCurrent ? state.data : null,
    error: enabled && isCurrent ? state.error : "",
    retry,
  };
}
