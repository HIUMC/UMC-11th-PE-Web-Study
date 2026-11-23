interface QueryStatusProps {
  error?: Error | null
  errorMessage?: string
  onRetry?: () => void
}

export function QueryStatus({ error, errorMessage = '영화 정보를 불러오지 못했어요.', onRetry }: QueryStatusProps) {
  return (
    <div className="py-12 text-center text-[#727985]" role={error ? 'alert' : 'status'}>
      <p>{error ? errorMessage : '영화 정보를 불러오는 중이에요.'}</p>
      {error && onRetry && (
        <button className="mt-3 cursor-pointer rounded-md bg-[#1b1e24] px-4 py-2 text-white" type="button" onClick={onRetry}>다시 시도</button>
      )}
    </div>
  )
}
