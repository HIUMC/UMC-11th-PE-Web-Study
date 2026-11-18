interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-8 py-10 text-gray-500">
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-[#17191e]"
      >
        다시 시도
      </button>
    </div>
  );
}
