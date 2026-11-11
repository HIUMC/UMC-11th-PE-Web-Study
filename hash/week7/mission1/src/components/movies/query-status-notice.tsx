interface QueryStatusNoticeProps {
  isFetching: boolean;
  isPaused: boolean;
  hasError: boolean;
  onRetry: () => void;
}

// 이미 표시할 데이터가 있을 때만 사용하는 재조회 상태 안내다.
export default function QueryStatusNotice({
  isFetching,
  isPaused,
  hasError,
  onRetry,
}: QueryStatusNoticeProps) {
  if (isPaused) {
    return (
      <p role="status" className="my-4 text-sm text-[#6b7280]">
        네트워크 연결을 기다리고 있어요. 저장된 정보를 표시해요.
      </p>
    );
  }

  if (hasError) {
    return (
      <div role="alert" className="my-4 flex flex-wrap items-center gap-3 text-sm">
        <p>최신 정보를 가져오지 못해 저장된 정보를 표시해요.</p>
        <button
          type="button"
          onClick={onRetry}
          disabled={isFetching}
          className="rounded-lg border border-[#4765df] px-3 py-2 font-semibold text-[#4765df] disabled:opacity-50"
        >
          {isFetching ? "다시 확인 중…" : "다시 시도"}
        </button>
      </div>
    );
  }

  if (isFetching) {
    return (
      <p role="status" className="my-4 text-sm text-[#6b7280]">
        최신 정보를 확인하고 있어요.
      </p>
    );
  }

  return null;
}
