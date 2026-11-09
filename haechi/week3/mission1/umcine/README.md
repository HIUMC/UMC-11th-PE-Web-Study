# UMCine — 3주차 필수 미션

## 실행 방법

```bash
pnpm install
pnpm dev     # src/routeTree.gen.ts 자동 재생성
pnpm build
```

## 라우트

| URL | 파일 | 화면 |
| --- | --- | --- |
| `/` | `routes/index.tsx` | 영화 목록 (`MovieListPage`) |
| `/search?query=...` | `routes/search.tsx` | 검색 (`SearchPage`), `validateSearch`로 `query` 검증 |
| `/movies/$movieId` | `routes/movies.$movieId.tsx` | 영화 상세 (`MovieDetailPage`) |
| 그 외 | `routes/__root.tsx` | `notFoundComponent` |

- `__root.tsx`에서 `Header` / `Outlet` / `Footer` 공통 레이아웃 구성
- 헤더 메뉴, 검색 아이콘, 영화 카드(포스터·제목), 검색 결과의 "상세 보기"를 모두 `Link`로 연결
- 검색 폼 제출 시 `useNavigate`로 `query`를 URL에 반영
- 뒤로 가기·앞으로 가기 시 `useEffect`로 입력창 값을 URL의 `query`와 동기화
- 상세 화면은 `useParams`로 받은 `movieId`를 `Number()`로 변환해 로컬 데이터에서 조회
- 일치하는 영화가 없으면 `영화를 찾을 수 없어요.` 표시

## Tailwind CSS 전환

- `@tailwindcss/vite` 플러그인 연결, `src/index.css`에 `@import "tailwindcss"` 추가
- 2주차 CSS 변수를 `@theme` 토큰으로 이전 (`bg-page`, `bg-surface`, `border-line`, `text-ink`, `text-ink-secondary`, `text-ink-tertiary`, `bg-primary`)
- `styles/*.css` 6개 파일을 utility class로 옮긴 뒤 삭제
- 상태에 따라 바뀌는 class는 `utils/cn.ts`(clsx + tailwind-merge)로 조합
  - `MovieCard` 북마크 버튼: `isBookmarked ? "border-primary bg-primary" : "border-surface bg-ink"`
  - `Pagination` 현재 페이지
  - `Header` 현재 메뉴
- 영화 그리드 반응형 적용: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`

## 확인 체크리스트

- [ ] `/`, `/search?query=스파이더맨`, `/movies/1` 직접 입력 및 새로고침 시 같은 화면 유지
- [ ] 검색어 없음 → `검색어를 입력해 주세요.` / 결과 없음 → `검색 결과가 없어요.`
- [ ] 검색 후 뒤로 가기·앞으로 가기 시 입력창과 결과가 URL과 함께 변경
- [ ] 서로 다른 카드 클릭 시 URL과 상세 정보가 함께 변경
- [ ] `/movies/999` → `영화를 찾을 수 없어요.`
- [ ] Console 오류 없음, `pnpm build` 성공
