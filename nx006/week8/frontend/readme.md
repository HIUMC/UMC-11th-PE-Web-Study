# UMCine · Frontend 8주차

2–7주차 영화 앱의 화면·에셋·URL을 유지하면서 실제 로그인, 내 정보, 즐겨찾기·평점 API와 TanStack Query mutation을 연결했습니다. 기존 React/TypeScript/Vite·Router/Query·Tailwind v4·Zustand·ky 버전과 lockfile을 유지했습니다.

## 실행

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm dev --host localhost --port 5173 --strictPort
```

새 환경에서만 `.env.example`을 `.env.local`로 복사하고 자신의 TMDB 토큰을 설정합니다. 기존 파일은 덮어쓰지 않습니다.

```dotenv
VITE_API_BASE_URL=https://workbook.devnoco.com/v8
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=<자신의 TMDB API Read Access Token>
```

회원 API는 [공식 v8 서버](https://workbook.devnoco.com/docs)를 사용합니다. 기존 로컬 NestJS 서버는 이번 실행에 필요하지 않습니다. 회원 설정이 없을 때만 이전 실습의 `VITE_MOVIE_API_BASE_URL`을 fallback으로 사용합니다. TMDB·공개 회원 API·인증 API의 클라이언트를 분리하며 서비스 토큰은 인증 API에만 붙입니다. `VITE_` 값은 브라우저에 노출되므로 서버 비밀키를 넣지 않습니다.

## 주요 URL

| URL | 기능 |
| --- | --- |
| /?page=1 | 영화 목록·페이지네이션, 카드 크기·정렬 저장 |
| /search?query=Inception&page=1 | URL 기반 영화 검색 |
| /movies/550 | 영화 상세, 서버 즐겨찾기와 내 평점 등록·수정·삭제 |
| /signup | 중복 확인·검증을 유지한 회원가입 mutation |
| /login | 실제 로그인, 로그인 상태에서는 홈으로 이동 |
| /profile | 로그인 전용 실제 내 정보·서버 즐겨찾기 |
| /profile/edit | 로그인 전용 닉네임 서버 저장, 이미지 미리보기 |
| /member-api | 이전 회원·평점 조회 실습 |
| /api-lab, /storage-lab | 이전 fetch·Web Storage 실습 |

가입 성공 후 로그인 페이지로 이동합니다. 토큰만 `umcine-auth-store`에 persist하며 비밀번호와 프로필은 저장하지 않습니다. 회원 정보·즐겨찾기·평점의 원본은 서버, 캐시는 Query에 둡니다. 이전 로컬 북마크는 실습 경로에만 남아 있고 서버에 자동 업로드하지 않습니다. 카드 크기·정렬 설정은 유지합니다.

## 검증

```sh
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
node --experimental-strip-types tests/verify-live-tmdb.ts
```

2026-11-22: lint·typecheck·57개 테스트·build 통과. 승인된 전용 계정으로 공식 v8 API와 Chrome UI를 검증했습니다. 닉네임 수정의 추가 GET은 setQueryData 0회, 비교용 invalidateQueries 1회였습니다. 상세 결과·캡처·미검증 항목은 [8주차 기록](docs/week8-mission.md)에 있습니다. `tests/verify-live-account.ts`는 승인된 실습 계정의 환경 변수로만 실행하며 새 계정을 생성하지 않습니다. 이전 `verify-live-members.ts`는 로컬 7주차 서버 전용이므로 v8 대상으로 실행하지 않습니다.

## 코드 책임

- routes: URL과 인증 경계. `(account)/_authenticated`의 명시적 beforeLoad와 Layout/Outlet을 사용합니다. `routeTree.gen.ts`는 플러그인 생성 결과입니다.
- pages/components: 화면·입력·알림·이동. hooks/use-signup.ts: 폼 검증과 mutation 연결.
- api/auth/account-api.ts: HTTP/응답 검증. queries/account-queries.ts: 조회 key/정책. mutations/account-mutations.ts: 쓰기/캐시 갱신.
- 토큰은 auth store, 회원 서버 상태는 Query, 검색어/page는 URL, 편집 초안은 로컬 상태, 카드 크기·정렬은 화면 설정 store입니다.
- 로그아웃·인증401·계정 전환 때 개인 캐시/요청을 정리하고 세션이 바뀐 늦은 응답을 차단합니다. 영화 캐시는 유지합니다. 내 정보 staleTime은 5분/retry false입니다.

[3주차](docs/MISSION_WEEK3.md) · [4주차](docs/week4-frontend-notion-record.md) · [5주차](docs/week5-mission.md) · [6주차](docs/week6-mission.md) · [7주차](docs/week7-mission.md) · [8주차 워크북](https://app.notion.com/p/e40cd44c59048362bc09819acae49db4)

이전 문서는 당시 기록입니다. 삭제된 week4-study-guide.md는 복원하지 않습니다. `.env.local`, node_modules, dist는 제출 대상에서 제외합니다.
