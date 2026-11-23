import Link from "next/link";
import { readMemberApiError } from "../../api/api-client";
import { useFavoriteMutation } from "../../hooks/use-account-mutations";
import { useFavoriteStatus } from "../../hooks/use-account-queries";
import { useAuthStore } from "../../stores/auth-store";
import { accountButtonClass, accountLinkClass } from "../account/account-panel";

export function FavoriteButton({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionId = useAuthStore((state) => state.sessionId);

  return accessToken
    ? <FavoriteControl key={sessionId} sessionId={sessionId} movieId={movieId} />
    : <Link href="/login" className={accountButtonClass + " mt-5"}>로그인하고 즐겨찾기</Link>;
}

function FavoriteControl({ sessionId, movieId }: { sessionId: number; movieId: number }) {
  const status = useFavoriteStatus(sessionId, movieId);
  const mutation = useFavoriteMutation(sessionId, movieId);
  const isFavorite = status.data;

  return (
    <div className="mt-5 space-y-2">
      <button
        type="button"
        aria-pressed={isFavorite}
        disabled={isFavorite === undefined || status.isError || status.isFetching || mutation.isPending}
        onClick={() => {
          if (isFavorite !== undefined && !status.isError && !status.isFetching && !mutation.isPending) {
            mutation.mutate(!isFavorite);
          }
        }}
        className={accountButtonClass + " gap-2"}
      >
        <img
          src={isFavorite ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
          alt=""
          className="size-4 invert"
        />
        {mutation.isPending ? "저장 중…"
          : status.isPaused && isFavorite === undefined ? "연결 대기 중…"
            : status.isPending ? "확인 중…"
              : isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      </button>
      {status.isError && (
        <p role="alert" className="text-sm text-red-800">
          {readMemberApiError(status.error).message}{" "}
          <button type="button" onClick={() => void status.refetch()} className={accountLinkClass}>다시 시도</button>
        </p>
      )}
      {mutation.isError && <p role="alert" className="text-sm text-red-800">{readMemberApiError(mutation.error).message}</p>}
    </div>
  );
}
