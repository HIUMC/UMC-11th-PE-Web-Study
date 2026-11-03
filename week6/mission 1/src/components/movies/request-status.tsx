export function RequestStatus({ isLoading, error, retry }: {
  isLoading: boolean; error?: string; retry: () => void
}) {
  if (isLoading) return <p role="status" className="py-20 text-center text-gray-500">영화 정보를 불러오는 중이에요.</p>
  if (!error) return null
  return <div role="alert" className="py-20 text-center text-gray-500">
    <p>{error}</p>
    <button type="button" onClick={retry} className="mt-4 rounded-md bg-[#191b20] px-4 py-3 text-sm text-white">다시 시도</button>
  </div>
}
