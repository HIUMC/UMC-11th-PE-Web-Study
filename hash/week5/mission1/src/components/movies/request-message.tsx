interface RequestMessageProps {
  message: string;
  isError?: boolean;
  onRetry?: () => void;
}

export default function RequestMessage({
  message,
  isError = false,
  onRetry,
}: RequestMessageProps) {
  return (
    <div
      role={isError ? "alert" : "status"}
      className="py-20 text-center"
    >
      <p className="text-base font-semibold text-[#4b5563]">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 cursor-pointer rounded-lg bg-[#4765df] px-5 py-3 text-sm font-bold text-white hover:bg-[#344fc4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4765df]"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
