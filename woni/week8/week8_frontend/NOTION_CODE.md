# 8주차 프론트엔드 미션 코드 정리

## 1. 로그인 전용 폴더

### 레이아웃 라우트 (로그인 확인)

파일 경로: `umcine/src/routes/(protected)/route.tsx`

```tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";

// 로그인 후에만 접근할 수 있는 페이지를 묶는 Layout Route
// (protected) 폴더 이름은 URL에 포함되지 않음
export const Route = createFileRoute("/(protected)")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
```

### 마이페이지 라우트

파일 경로: `umcine/src/routes/(protected)/my/index.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "@/pages/members/my-page";

export const Route = createFileRoute("/(protected)/my/")({ component: MyPage });
```

## 2. 마이페이지 즐겨찾기 목록

### 즐겨찾기 목록 조회 API

파일 경로: `umcine/src/api/favorites/get-favorites.ts`

```ts
import { authApi } from "../auth-api";
import type { FavoriteApiResponse, FavoriteItem } from "./models";

// 내 즐겨찾기 목록 (최신 등록 순, 비어 있으면 빈 배열)
export async function getFavorites(): Promise<FavoriteItem[]> {
  const response = await authApi
    .get("favorites")
    .json<FavoriteApiResponse<FavoriteItem[]>>();
  return response.result;
}
```

### 즐겨찾기 쿼리 키와 queryOptions

파일 경로: `umcine/src/api/favorites/favorite-queries.ts`

```ts
import { queryOptions } from "@tanstack/react-query";
import { getFavoriteStatus } from "./get-favorite-status";
import { getFavorites } from "./get-favorites";

// ["favorites"]는 목록, ["favorites", movieId]는 영화별 즐겨찾기 여부
// ["favorites"]로 무효화하면 목록과 영화별 여부가 함께 무효화됨
export const favoriteQueries = {
  all: () => ["favorites"] as const,
  list: () =>
    queryOptions({
      queryKey: favoriteQueries.all(),
      queryFn: getFavorites,
    }),
  status: (movieId: number) =>
    queryOptions({
      queryKey: [...favoriteQueries.all(), movieId],
      queryFn: () => getFavoriteStatus(movieId),
    }),
};
```

### 마이페이지 즐겨찾기 조회 부분

파일 경로: `umcine/src/pages/members/my-page.tsx`

```tsx
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { favoriteQueries } from "@/api/favorites/favorite-queries";
// ...

const PAGE_SIZE = 5;

// ...

export function MyPage() {
  const [currentPage, setCurrentPage] = useState(1);
  // ...

  // 즐겨찾기 목록은 movieId만 주므로 영화 정보는 TMDB 상세 조회로 채움
  const favoritesQuery = useQuery(favoriteQueries.list());
  const favorites = favoritesQuery.data ?? [];

  const totalPages = Math.ceil(favorites.length / PAGE_SIZE);
  // 해제로 마지막 페이지가 사라지면 남아 있는 마지막 페이지를 보여 줌
  const page = Math.min(currentPage, Math.max(totalPages, 1));
  const pagedFavorites = favorites.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // 현재 페이지에 보이는 영화만 상세 조회 (영화마다 ["movies", "detail", id] 캐시 사용)
  const movieDetailQueries = useQueries({
    queries: pagedFavorites.map((favorite) =>
      movieQueries.detail(favorite.movieId),
    ),
  });
  const isMovieDetailLoading = movieDetailQueries.some(
    (query) => query.isPending,
  );
  const pagedMovies: MovieCardItem[] = movieDetailQueries.flatMap((query) =>
    query.data ? [toMovieCardItem(query.data)] : [],
  );

  return (
    <main className="flex min-h-[calc(100vh-148px)] flex-col gap-7 bg-[#f6f7f9] px-20 py-6">
      {/* ... */}

      <section className="flex flex-col gap-4">
        <h2 className={SECTION_TITLE_CLASS}>내 즐겨찾기</h2>
        {favoritesQuery.isPending ? (
          <p className={EMPTY_TEXT_CLASS}>즐겨찾기를 불러오는 중이에요.</p>
        ) : favoritesQuery.isError ? (
          <p className={EMPTY_TEXT_CLASS}>
            즐겨찾기를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </p>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <p className={EMPTY_TEXT_CLASS}>아직 즐겨찾기한 영화가 없어요.</p>
            <Link
              to="/"
              className="flex h-[42px] items-center rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white"
            >
              영화 둘러보기
            </Link>
          </div>
        ) : (
          <>
            {isMovieDetailLoading ? (
              <p className={EMPTY_TEXT_CLASS}>영화 정보를 불러오는 중이에요.</p>
            ) : (
              <div className="grid grid-cols-5 gap-x-[18px] gap-y-5">
                {pagedMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    actionButton={
                      <FavoriteRemoveButton
                        movieId={movie.id}
                        movieTitle={movie.title}
                      />
                    }
                  />
                ))}
              </div>
            )}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>
    </main>
  );
}
```

## 3. 영화 상세 즐겨찾기

### 즐겨찾기 여부 조회 API

파일 경로: `umcine/src/api/favorites/get-favorite-status.ts`

```ts
import { authApi } from "../auth-api";
import type { FavoriteApiResponse, FavoriteStatus } from "./models";

// 특정 영화의 즐겨찾기 여부
export async function getFavoriteStatus(
  movieId: number,
): Promise<FavoriteStatus> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<FavoriteApiResponse<FavoriteStatus>>();
  return response.result;
}
```

### 즐겨찾기 등록 API

파일 경로: `umcine/src/api/favorites/create-favorite.ts`

```ts
import { authApi } from "../auth-api";
import type { FavoriteApiResponse, FavoriteItem } from "./models";

export interface CreateFavoriteRequest {
  movieId: number;
}

// 즐겨찾기 등록 (이미 등록된 영화면 409 FAVORITE409_1)
export function createFavorite(body: CreateFavoriteRequest) {
  return authApi
    .post("favorites", { json: body })
    .json<FavoriteApiResponse<FavoriteItem>>();
}
```

### 즐겨찾기 해제 API

파일 경로: `umcine/src/api/favorites/delete-favorite.ts`

```ts
import { authApi } from "../auth-api";
import type { FavoriteApiResponse } from "./models";

// 즐겨찾기 해제 (등록되지 않은 영화면 404 FAVORITE404_1)
export function deleteFavorite(movieId: number) {
  return authApi
    .delete(`favorites/${movieId}`)
    .json<FavoriteApiResponse<null>>();
}
```

### 즐겨찾기 등록 mutation 훅

파일 경로: `umcine/src/hooks/use-create-favorite-mutation.ts`

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFavorite } from "../api/favorites/create-favorite";
import { favoriteQueries } from "../api/favorites/favorite-queries";

export function useCreateFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFavorite,
    // 목록과 영화별 여부를 모두 다시 받아 옴
    // Promise를 반환해서 다시 받아 오는 동안에도 isPending이 유지되게 함
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: favoriteQueries.all() }),
    onError: () => {
      alert("즐겨찾기 등록에 실패했어요. 다시 시도해 주세요.");
      // 이미 등록된 경우(409) 등 화면 상태가 서버와 다를 수 있으므로 다시 맞춤
      return queryClient.invalidateQueries({ queryKey: favoriteQueries.all() });
    },
  });
}
```

### 즐겨찾기 해제 mutation 훅

파일 경로: `umcine/src/hooks/use-delete-favorite-mutation.ts`

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFavorite } from "../api/favorites/delete-favorite";
import { favoriteQueries } from "../api/favorites/favorite-queries";

export function useDeleteFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFavorite,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: favoriteQueries.all() }),
    onError: () => {
      alert("즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.");
      // 이미 해제된 경우(404) 등 화면 상태가 서버와 다를 수 있으므로 다시 맞춤
      return queryClient.invalidateQueries({ queryKey: favoriteQueries.all() });
    },
  });
}
```

### 즐겨찾기 버튼 컴포넌트

파일 경로: `umcine/src/components/favorite-button.tsx`

```tsx
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { favoriteQueries } from "../api/favorites/favorite-queries";
import { useCreateFavoriteMutation } from "../hooks/use-create-favorite-mutation";
import { useDeleteFavoriteMutation } from "../hooks/use-delete-favorite-mutation";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface FavoriteButtonProps {
  movieId: number;
  movieTitle: string;
}

// 서버 즐겨찾기 API와 연결된 버튼 (BookmarkButton text 형태와 같은 스타일)
export function FavoriteButton({ movieId, movieTitle }: FavoriteButtonProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = Boolean(accessToken);

  const favoriteStatusQuery = useQuery({
    ...favoriteQueries.status(movieId),
    enabled: isLoggedIn,
  });
  const createFavoriteMutation = useCreateFavoriteMutation();
  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const isFavorite = isLoggedIn && favoriteStatusQuery.data?.isFavorite === true;
  const isBusy =
    createFavoriteMutation.isPending ||
    deleteFavoriteMutation.isPending ||
    (isLoggedIn && favoriteStatusQuery.isPending);

  const handleClick = () => {
    // 로그인하지 않았으면 로그인 페이지로 이동
    if (!isLoggedIn) {
      navigate({ to: "/login" });
      return;
    }
    if (isBusy) return;

    if (isFavorite) {
      deleteFavoriteMutation.mutate(movieId);
    } else {
      createFavoriteMutation.mutate({ movieId });
    }
  };

  const iconSrc = isFavorite
    ? "/icons/bookmark.svg"
    : "/icons/bookmark-outline.svg";

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={
        isFavorite ? `${movieTitle} 즐겨찾기 해제` : `${movieTitle} 즐겨찾기`
      }
      disabled={isBusy}
      onClick={handleClick}
      className={cn(
        "flex h-[42px] items-center gap-2 rounded-lg px-4 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-50",
        isFavorite
          ? "bg-blue-600 text-white"
          : "border border-gray-300 bg-white text-[#17191e]",
      )}
    >
      <img
        src={iconSrc}
        alt=""
        className={cn("size-4 brightness-0", isFavorite && "invert")}
      />
      {isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
    </button>
  );
}
```

## 4. 영화 상세 평점

### 회원 평점 목록 조회 API

파일 경로: `umcine/src/api/ratings/get-member-ratings.ts`

```ts
import { apiClient } from "../api-client";
import type { Rating } from "./models";

// 백엔드가 허용하는 최대 페이지 크기
const PAGE_SIZE = 100;

// 회원의 평점 전체 (최신 등록 순)
// 공개 API라 토큰이 필요 없고, 응답이 ApiResponse로 감싸지지 않은 배열임
// 한 번에 최대 100개만 오므로 마지막 페이지까지 넘기며 모음
export async function getMemberRatings(memberId: number): Promise<Rating[]> {
  const ratings: Rating[] = [];

  for (let page = 0; ; page += 1) {
    const pageRatings = await apiClient
      .get(`members/${memberId}/ratings`, {
        searchParams: { page, size: PAGE_SIZE },
      })
      .json<Rating[]>();

    ratings.push(...pageRatings);
    if (pageRatings.length < PAGE_SIZE) return ratings;
  }
}
```

### 평점 등록 API

파일 경로: `umcine/src/api/ratings/create-rating.ts`

```ts
import { authApi } from "../auth-api";
import type { Rating, RatingApiResponse } from "./models";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string | null;
}

// 평점 등록 (이미 평점을 남긴 영화면 409 RATING409_1)
export function createRating(body: CreateRatingRequest) {
  return authApi
    .post("ratings", { json: body })
    .json<RatingApiResponse<Rating>>();
}
```

### 평점 수정 API

파일 경로: `umcine/src/api/ratings/update-rating.ts`

```ts
import { authApi } from "../auth-api";
import type { Rating, RatingApiResponse } from "./models";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment: string | null;
}

export function updateRating({ ratingId, ...body }: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<RatingApiResponse<Rating>>();
}
```

### 평점 삭제 API

파일 경로: `umcine/src/api/ratings/delete-rating.ts`

```ts
import { authApi } from "../auth-api";
import type { RatingApiResponse } from "./models";

export function deleteRating(ratingId: number) {
  return authApi
    .delete(`ratings/${ratingId}`)
    .json<RatingApiResponse<null>>();
}
```

### 평점 쿼리 키와 queryOptions

파일 경로: `umcine/src/api/ratings/rating-queries.ts`

```ts
import { queryOptions } from "@tanstack/react-query";
import { getMemberRatings } from "./get-member-ratings";

// ["ratings", memberId]는 회원의 평점 목록
export const ratingQueries = {
  byMember: (memberId: number) =>
    queryOptions({
      queryKey: ["ratings", memberId],
      queryFn: () => getMemberRatings(memberId),
    }),
};
```

### 평점 등록 mutation 훅

파일 경로: `umcine/src/hooks/use-create-rating-mutation.ts`

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";
import type { Rating } from "../api/ratings/models";
import { ratingQueries } from "../api/ratings/rating-queries";

export function useCreateRatingMutation(memberId: number) {
  const queryClient = useQueryClient();
  const queryKey = ratingQueries.byMember(memberId).queryKey;

  return useMutation({
    mutationFn: createRating,
    onSuccess: (response) => {
      // 응답에 등록된 평점이 오므로 목록 맨 앞(최신 순)에 바로 넣음
      queryClient.setQueryData<Rating[]>(queryKey, (prev = []) => [
        response.result,
        ...prev,
      ]);
      alert("평점을 등록했어요.");
    },
    onError: () => {
      alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
      // 이미 등록된 경우(409) 등 화면 상태가 서버와 다를 수 있으므로 다시 맞춤
      return queryClient.invalidateQueries({ queryKey });
    },
  });
}
```

### 평점 수정 mutation 훅

파일 경로: `umcine/src/hooks/use-update-rating-mutation.ts`

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Rating } from "../api/ratings/models";
import { ratingQueries } from "../api/ratings/rating-queries";
import { updateRating } from "../api/ratings/update-rating";

export function useUpdateRatingMutation(memberId: number) {
  const queryClient = useQueryClient();
  const queryKey = ratingQueries.byMember(memberId).queryKey;

  return useMutation({
    mutationFn: updateRating,
    onSuccess: (response) => {
      const updated = response.result;
      queryClient.setQueryData<Rating[]>(queryKey, (prev = []) =>
        prev.map((rating) =>
          rating.ratingId === updated.ratingId ? updated : rating,
        ),
      );
      alert("평점을 수정했어요.");
    },
    onError: () => {
      alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
      return queryClient.invalidateQueries({ queryKey });
    },
  });
}
```

### 평점 삭제 mutation 훅

파일 경로: `umcine/src/hooks/use-delete-rating-mutation.ts`

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRating } from "../api/ratings/delete-rating";
import type { Rating } from "../api/ratings/models";
import { ratingQueries } from "../api/ratings/rating-queries";

export function useDeleteRatingMutation(memberId: number) {
  const queryClient = useQueryClient();
  const queryKey = ratingQueries.byMember(memberId).queryKey;

  return useMutation({
    mutationFn: deleteRating,
    // 삭제 응답의 result는 null이므로 요청에 쓴 ratingId로 목록에서 뺌
    onSuccess: (_response, ratingId) => {
      queryClient.setQueryData<Rating[]>(queryKey, (prev = []) =>
        prev.filter((rating) => rating.ratingId !== ratingId),
      );
      alert("평점을 삭제했어요.");
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
      return queryClient.invalidateQueries({ queryKey });
    },
  });
}
```

### 평점 패널 컴포넌트

파일 경로: `umcine/src/components/movies/rating-panel.tsx`

```tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { memberQueries } from "../../api/members/member-queries";
import type { Rating } from "../../api/ratings/models";
import { ratingQueries } from "../../api/ratings/rating-queries";
import { useCreateRatingMutation } from "../../hooks/use-create-rating-mutation";
import { useDeleteRatingMutation } from "../../hooks/use-delete-rating-mutation";
import { useUpdateRatingMutation } from "../../hooks/use-update-rating-mutation";
import { useAuthStore } from "../../stores/auth-store";

const RATING_SCORES = [1, 2, 3, 4, 5];
const COMMENT_MAX_LENGTH = 500;

interface RatingPanelProps {
  movieId: number;
}

// 영화 상세의 내 평점 영역
export function RatingPanel({ movieId }: RatingPanelProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = Boolean(accessToken);

  const meQuery = useQuery({ ...memberQueries.me(), enabled: isLoggedIn });
  const memberId = meQuery.data?.memberId;
  const ratingsQuery = useQuery({
    ...ratingQueries.byMember(memberId ?? 0),
    enabled: isLoggedIn && memberId !== undefined,
  });

  let content;
  if (!isLoggedIn) {
    // 로그인하지 않았으면 저장을 누를 때 로그인 페이지로 이동
    content = <RatingForm onSave={() => navigate({ to: "/login" })} />;
  } else if (memberId === undefined || ratingsQuery.isPending) {
    content = <RatingForm isDisabled onSave={() => {}} />;
  } else if (ratingsQuery.isError) {
    content = (
      <p className="text-xs text-[#e5484d]">
        내 평점을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
      </p>
    );
  } else {
    const myRating = ratingsQuery.data.find(
      (rating) => rating.movieId === movieId,
    );
    content = (
      <MemberRatingForm
        // 평점이 생기거나 지워지면 입력 상태를 새 값으로 다시 시작
        key={myRating?.ratingId ?? "new"}
        memberId={memberId}
        movieId={movieId}
        rating={myRating}
      />
    );
  }

  return (
    <aside className="flex w-[360px] shrink-0 flex-col gap-2 border-l border-[#e3e6eb] pb-10 pl-[30px]">
      <h2 className="text-[21px] font-bold tracking-[-0.63px] text-[#17191e]">
        내 평점
      </h2>
      <p className="text-xs text-[#969da8]">별점은 필수, 후기는 선택이에요.</p>
      {content}
    </aside>
  );
}

interface MemberRatingFormProps {
  memberId: number;
  movieId: number;
  rating: Rating | undefined;
}

// 로그인한 회원의 평점 등록, 수정, 삭제를 연결
function MemberRatingForm({ memberId, movieId, rating }: MemberRatingFormProps) {
  const createRatingMutation = useCreateRatingMutation(memberId);
  const updateRatingMutation = useUpdateRatingMutation(memberId);
  const deleteRatingMutation = useDeleteRatingMutation(memberId);

  const isPending =
    createRatingMutation.isPending ||
    updateRatingMutation.isPending ||
    deleteRatingMutation.isPending;

  const handleSave = (score: number, comment: string | null) => {
    if (rating) {
      updateRatingMutation.mutate({ ratingId: rating.ratingId, score, comment });
    } else {
      createRatingMutation.mutate({ movieId, score, comment });
    }
  };

  const handleDelete = () => {
    if (!rating) return;
    if (!confirm("평점을 삭제할까요?")) return;
    deleteRatingMutation.mutate(rating.ratingId);
  };

  return (
    <RatingForm
      rating={rating}
      isPending={isPending}
      onSave={handleSave}
      onDelete={rating ? handleDelete : undefined}
    />
  );
}

interface RatingFormProps {
  rating?: Rating;
  isDisabled?: boolean;
  isPending?: boolean;
  onSave: (score: number, comment: string | null) => void;
  onDelete?: () => void;
}

// 별점과 후기 입력 화면 (요청은 onSave, onDelete로 위임)
function RatingForm({
  rating,
  isDisabled = false,
  isPending = false,
  onSave,
  onDelete,
}: RatingFormProps) {
  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");

  const isLocked = isDisabled || isPending;
  const canSave = score > 0 && !isLocked;

  const handleSave = () => {
    if (!canSave) return;
    const trimmedComment = comment.trim();
    onSave(score, trimmedComment.length > 0 ? trimmedComment : null);
  };

  return (
    <>
      {/* ... 별점 버튼(RATING_SCORES), 후기 textarea(COMMENT_MAX_LENGTH) */}
      <button
        type="button"
        disabled={score === 0 || isLocked}
        onClick={handleSave}
        className="h-[42px] w-full rounded-lg bg-[#17191e] text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "저장 중" : rating ? "평점 수정" : "평점 저장"}
      </button>
      {onDelete && (
        <button
          type="button"
          disabled={isLocked}
          onClick={onDelete}
          className="h-[42px] w-full rounded-lg border border-[#d92d20] bg-white text-sm font-extrabold text-[#d92d20] disabled:cursor-not-allowed disabled:opacity-50"
        >
          평점 삭제
        </button>
      )}
    </>
  );
}
```

## 5. 선택 미션: 즐겨찾기 mutation 훅의 invalidateQueries

### 즐겨찾기 등록 훅의 invalidateQueries

파일 경로: `umcine/src/hooks/use-create-favorite-mutation.ts`

```ts
  return useMutation({
    mutationFn: createFavorite,
    // 목록과 영화별 여부를 모두 다시 받아 옴
    // Promise를 반환해서 다시 받아 오는 동안에도 isPending이 유지되게 함
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: favoriteQueries.all() }),
    onError: () => {
      alert("즐겨찾기 등록에 실패했어요. 다시 시도해 주세요.");
      // 이미 등록된 경우(409) 등 화면 상태가 서버와 다를 수 있으므로 다시 맞춤
      return queryClient.invalidateQueries({ queryKey: favoriteQueries.all() });
    },
  });
```

### 즐겨찾기 해제 훅의 invalidateQueries

파일 경로: `umcine/src/hooks/use-delete-favorite-mutation.ts`

```ts
  return useMutation({
    mutationFn: deleteFavorite,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: favoriteQueries.all() }),
    onError: () => {
      alert("즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.");
      // 이미 해제된 경우(404) 등 화면 상태가 서버와 다를 수 있으므로 다시 맞춤
      return queryClient.invalidateQueries({ queryKey: favoriteQueries.all() });
    },
  });
```
