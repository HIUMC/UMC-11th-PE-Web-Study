# UMCine — 4주차 필수 미션

## 실행 방법

```bash
pnpm install
pnpm add zustand   # 4주차에 추가한 의존성
pnpm dev
pnpm build
```

## 4주차 변경 요약

### 1. 북마크 상태를 Zustand로 공유

| 파일 | 변경 |
| --- | --- |
| `src/stores/bookmark-store.ts` | **신규** — `bookmarkedMovieIds` + `toggleBookmark` action, `persist` 적용 |
| `src/components/movies/bookmark-button.tsx` | **신규** — selector로 `isBookmarked`, `toggleBookmark`만 구독하는 공용 버튼 (`icon` / `labeled`) |
| `src/components/movies/movie-card.tsx` | 기존 북마크 `<button>` → `<BookmarkButton>`, `onToggleBookmark` prop 제거 |
| `src/components/movies/movie-grid.tsx` | `onToggleBookmark` prop drilling 제거 |
| `src/pages/movies/movie-list-page.tsx` | `useState<Movie[]>` 복사본·토글 핸들러 삭제 (페이지 번호만 로컬 상태로 유지) |
| `src/pages/movies/search-page.tsx` | 검색 결과 카드에 `<BookmarkButton>` 추가 |
| `src/pages/movies/movie-detail-page.tsx` | 상세 정보에 `<BookmarkButton variant="labeled">` 추가 |
| `src/types/movie.ts`, `src/data/movies.ts` | `isBookmarked` 필드 제거 — 북마크는 영화 데이터가 아니라 클라이언트 상태 |

- 3주차까지는 목록 화면이 `movies` 배열을 `useState`로 복사해 `isBookmarked`를 직접 바꿨기 때문에, 검색·상세 화면은 같은 값을 볼 수 없었어요.
- 이제 세 화면 모두 같은 `useBookmarkStore`를 읽으므로 한 화면에서 바꾼 결과가 다른 화면에도 그대로 보여요.

### 2. Web Storage에 유지 (`persist`)

```ts
persist(..., {
  name: "umcine-bookmark-store",                 // localStorage key
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ bookmarkedMovieIds: state.bookmarkedMovieIds }), // action 제외
  merge: (persisted, current) => ({ ...current, bookmarkedMovieIds: sanitizeMovieIds(...) }),
})
```

- 저장값 예시: `{"state":{"bookmarkedMovieIds":[2,7]},"version":0}`
- 초기값은 `[]` → 저장값을 지우면 아무것도 북마크되지 않은 상태로 시작해요.
- `merge`에서 배열이 아니거나 양의 정수가 아닌 ID, 중복 ID를 걸러내 개발자 도구에서 값을 망가뜨려도 화면이 깨지지 않아요. (JSON 자체가 깨진 경우 `persist`가 복원을 건너뛰고 초기값 `[]`을 사용해요.)

## 확인 체크리스트

- [ ] 목록에서 북마크 → `/search?query=스파이더맨`, `/movies/1`에서도 같은 상태
- [ ] 상세 화면에서 `북마크 추가`/`북마크 해제` 토글 → 목록으로 돌아가도 반영
- [ ] 새로고침, 브라우저 완전 종료 후 재실행 시 북마크 유지
- [ ] Application → Local storage → `umcine-bookmark-store` 값 확인
- [ ] 해당 key 삭제 후 새로고침 → 모든 영화가 북마크 해제 상태
- [ ] value를 `{"state":{"bookmarkedMovieIds":["a",-1,3]}}`로 바꾸고 새로고침 → 3번만 북마크
- [ ] Console 오류 없음, `pnpm build`·`pnpm lint` 성공
