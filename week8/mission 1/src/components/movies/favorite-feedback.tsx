interface FavoriteFeedbackProps {
  isLoading?: boolean;
  queryError: boolean;
  mutationError: boolean;
  retry: () => void;
}

export function FavoriteFeedback({ isLoading, queryError, mutationError, retry }: FavoriteFeedbackProps) {
  if (queryError) return <div role="alert" className="my-3 flex items-center gap-3 text-xs text-red-600">
    <p>즐겨찾기를 불러오지 못했어요.</p>
    <button type="button" onClick={retry} className="font-bold underline">다시 시도</button>
  </div>;
  if (mutationError) return <p role="alert" className="my-3 text-xs text-red-600">즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요.</p>;
  if (isLoading) return <p role="status" className="my-3 text-xs text-gray-500">즐겨찾기를 불러오는 중이에요.</p>;
  return null;
}
