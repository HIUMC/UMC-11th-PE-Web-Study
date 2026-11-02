# UMCine

2–5주차 프로젝트를 이어서 **6주차 TanStack Query v5**로 목록·검색·상세의 서버 상태와 캐시를 관리합니다. 기존 디자인·에셋·URL 페이지네이션·Zustand 북마크·카드 크기·정렬 설정과 별도 회원·평점 조회 화면을 유지합니다.

## 실행

Node.js 24, pnpm 12.5.1 기준입니다. src뿐 아니라 public, package.json, pnpm-lock.yaml, Vite/TypeScript 설정, tests도 함께 복사하세요.

```bash
corepack pnpm install --frozen-lockfile
```

새 환경에서만 `.env.example`을 `.env.local`로 복사하고 TMDB **API Read Access Token**을 로컬 편집기로 입력합니다. 이미 있는 `.env.local`은 덮어쓰지 마세요. API base URL은 `https://api.themoviedb.org/3`입니다.

```bash
corepack pnpm dev --host 127.0.0.1 --port 5173 --strictPort
```

접속: `http://127.0.0.1:5173/`. 환경 변수를 변경하면 서버를 재시작합니다. `.env.local`은 Git 제외 대상이지만 VITE_ 변수는 실행된 클라이언트에 노출됩니다. 실제 비밀은 서버에서 관리해야 합니다. 토큰이 없어도 자동 테스트·빌드는 가능하며 API 요청 화면에는 설정 안내가 표시됩니다.

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

실제 토큰이 있는 환경에서만 추가 HTTP 통합 검증을 실행할 수 있습니다. 토큰·header·응답 본문은 출력하지 않습니다.

```bash
node --experimental-strip-types tests/verify-live-tmdb.ts
```

## URL

- `/?page=1`, `/?page=2` — 인기 영화, 페이지별 Query 캐시
- `/search` — 빈 검색 안내; 자동 요청 없음
- `/search?query=인셉션&page=1` — 검색어·페이지별 캐시
- `/movies/27205` — 실제 TMDB ID의 상세
- `/movies/abc` — 무효 ID 안내; 자동 요청 없음
- `/login`, `/signup`, `/profile`, `/profile/edit` — 기존 계정·프로필·즐겨찾기 데모
- `/member-api` — 기존 별도 백엔드 회원·평점 조회; VITE_MOVIE_API_BASE_URL 사용
- `/api-lab` — 5주차 순수 fetch 실습; 버튼으로만 실행
- `/storage-lab?storage=local`, `/storage-lab?storage=session` — 지난 저장소 실습

메모리 데모 로그인은 `gwangsoo@cinemalab.kr` / `Demo123!`입니다. 인증·프로필·리뷰는 새로고침 시 초기화되며 북마크·화면 설정은 브라우저 저장소에서 복원합니다. 회원·평점 백엔드 화면은 이 데모와 별도입니다.

## 상태와 파일 책임

- `src/config/query-client.ts`: 전역 staleTime 60초, gcTime 5분, retry 정책. main에서 한 QueryClient를 Provider에 연결합니다.
- `src/queries/movie-queries.ts`: 목록·검색·상세 queryOptions. 상세만 staleTime 30초. 검색 key에도 page를 포함합니다.
- `src/api`: 기존 ky·DTO·validator를 재사용하고 Query signal을 전달합니다.
- `src/pages/movies`·`src/components/movies`: Query 데이터·상태를 기존 화면에 연결합니다. 배경 재조회 중/실패 시 기존 data를 유지합니다.
- `src/components/movies/bookmark-shelf.tsx`: useQueries로 상세 화면과 캐시를 공유합니다.
- `src/stores`: 북마크·카드 크기·정렬. 서버 응답을 store나 별도 useState에 복사하지 않습니다.
- `src/hooks/use-api-request.ts`: 지난 순수 fetch 실습에서만 유지합니다. 실제 영화 화면에는 사용하지 않습니다.
- `src/routeTree.gen.ts`: 라우터 플러그인의 생성 파일입니다. 직접 편집하지 않습니다.

Query 캐시는 메모리에만 있으므로 새로고침하면 초기화됩니다. 북마크 key `umcine-bookmark-store`, 설정 key `umcine-display-settings`, URL query/page는 그대로 유지됩니다. 이전 더미 ID를 임의 매핑하거나 삭제하지 않습니다. 프로필의 404 ID는 안내하고 저장값을 보존합니다. 기본 정렬은 API 인기순, 다른 정렬은 현재 페이지에만 적용됩니다. origin이 달라지면 별도 저장소입니다.

ky 자동 retry는 0입니다. Query는 네트워크/timeout·408·429·5xx만 1초 후 한 번 재시도하며 401·403·404 및 설정/응답 형식 오류는 자동 재시도하지 않습니다. 수동 다시 시도는 refetch입니다. Devtools는 개발 환경에서만 연결합니다. mount/창 복귀/reconnect 재조회 기본 정책을 끄지 않았습니다.

## 검증·기록

2026-11-02: frozen install·lint·typecheck·테스트 41개·build 통과. 실제 TMDB 목록·검색·상세 200, 없는 영화 404, 포스터/배경 CDN HEAD 200을 확인했습니다. 실제 Query 옵션으로 목록 1→2→1은 HTTP 두 번으로 처리했습니다. 자동 테스트는 캐시 공유·disabled 상태·취소·응답 역전·배경 오류·retry·30초 stale·5분 GC를 포함합니다.

**이번 브라우저 도구는 `failed to write kernel assets` 오류로 실행되지 않았습니다. 화면·새로고침·Devtools·Network·Console·반응형 재검증과 캡처는 미검증이며 HTTP 검증과 구분합니다.**

- [6주차 미션·실습·검증·트러블슈팅](docs/week6-mission.md)
- [현재 완료·남은 항목](docs/progress.md)
- 지난 기록: [5주차](docs/week5-mission.md), [4주차](docs/week4-frontend-notion-record.md), [3주차](docs/MISSION_WEEK3.md)
- [원본 에셋 출처](public/images/SOURCES.md)
