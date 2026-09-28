# UMC Frontend 3주차 과제 기록

## 구현 결과

- 필수: TanStack Router 파일 기반 라우팅, 목록·검색·동적 상세 URL, 타입이 확인된 검색어, Tailwind CSS v4 전환, 직접 URL 입력 및 새로고침 확인.
- 선택: 영화 카드 1/2/3/5열 반응형. 헤더·검색·상세도 작은 화면에서 가로 넘침 없이 표시.
- 2주차의 10편 데이터, 이미지, 북마크 토글, 1–5 페이지 선택, 로그인·프로필·후기 화면을 이어서 사용.

| URL | 화면·동작 |
| --- | --- |
| `/` | 영화 목록 10편, 북마크와 페이지 선택 |
| `/search` | 검색어 입력 안내 |
| `/search?query=오디세이` | 제목 또는 원제 검색 결과 |
| `/movies/1` | 스파이더맨 상세, 배경·포스터·평점 |
| `/movies/2` | 다른 영화 상세 |
| `/movies/999`, `/movies/abc` | 영화 없음 안내 |
| `/login`, `/signup`, `/profile`, `/profile/edit` | 2주차 부가 화면 유지 |

## 핵심 코드

- `src/routes/__root.tsx`: 공통 헤더, Outlet, 404
- `src/routes/search.tsx`: `validateSearch`로 `query` 문자열 확인
- `src/routes/movies.$movieId.tsx`: `useParams`, 숫자 검증, ID로 영화 조회
- `src/pages/movies/search-page.tsx`: `useSearch`, `useNavigate`, 제목·원제 검색
- `src/components/movies/movie-card.tsx`: 상세 `Link`, 독립 북마크
- `src/components/movies/movie-grid.tsx`: 1/2/3/5열
- `src/hooks/use-umcine.ts`: 기존 공통 상태와 처리
- `src/utils/cn.ts`: `clsx`와 `tailwind-merge` 조합
- `src/main.tsx`, `vite.config.ts`: RouterProvider 및 파일 기반 라우트 생성 플러그인

`src/routeTree.gen.ts`는 플러그인이 생성한 파일이며 직접 편집하지 않았습니다. `src/index.css`에는 Tailwind 가져오기, 폰트와 필요한 전역 규칙만 있습니다.

## 실행과 확인

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm dev
corepack pnpm lint
corepack pnpm build
```

- 로컬 개발 서버와 최종 빌드 실행 완료. TypeScript 및 Vite 빌드 성공.
- 실제 브라우저에서 `/`, `/search`, 검색 결과, `/movies/1`, `/movies/2`, 잘못된 ID와 없는 경로 확인.
- 검색어 `ODYSSEY`의 앞뒤 공백 제거·대소문자 검색, URL 유지 및 새로고침 확인. 검색 결과 0개 안내 확인.
- 목록에서 첫 영화 북마크 토글, 5페이지 선택·마지막 다음 버튼 비활성 확인.
- 390/600/900/1440px에서 1/2/3/5열 및 가로 넘침 없음 확인. 검색·상세의 390px 가로 넘침 없음 확인.
- `/movies/1` 원본 배경(3840px)과 포스터(500px) 로딩 확인. 브라우저 Console 오류·경고 없음.
- 기존 데모 로그인 후 `/profile` 이동과 즐겨찾기 3편 확인.

과제 제출 시 직접 캡처하면 좋은 화면: 데스크톱 목록, 모바일 목록, 검색 결과, `/movies/1` 상세, 유효하지 않은 ID 안내. 이 문서에 적은 검증은 실행한 항목이며 캡처 파일은 별도로 새로 만들지 않았습니다.

## 실제 트러블슈팅

1. 이슈 → 첫 `pnpm build`에서 `Cannot find module './routeTree.gen'` 오류가 발생했습니다. 원인 → 플러그인을 연결했지만 생성 단계 이전에 TypeScript 검사가 먼저 실행되었습니다. 해결 → Vite를 실행해 `src/routeTree.gen.ts` 생성 결과를 확인한 뒤 빌드를 다시 실행했습니다. 배운 점 → 생성 파일은 직접 편집하지 않고 라우터 플러그인의 생성 과정을 거쳐야 합니다.
2. 이슈 → 제한된 터미널에서 개발 서버가 `listen EPERM`으로 시작되지 않았습니다. 원인 → 실행 환경이 로컬 포트 바인딩을 막았습니다. 해결 → 허용된 실행 경로에서 개발 서버를 시작해 실제 브라우저 검증을 진행했습니다. 배운 점 → 포트 오류는 코드 오류와 구분해 실행 환경 권한을 확인해야 합니다.
3. 이슈 → 첫 데스크톱 시각 확인에서 헤더 메뉴가 로고보다 앞에 보였습니다. 원인 → 모바일용 Tailwind `order-1`이 데스크톱에도 적용되었습니다. 해결 → 데스크톱 breakpoint에서 순서를 초기화하고 다시 화면을 확인했습니다. 배운 점 → 반응형 유틸리티의 기본 값이 모든 폭에 적용된다는 점을 점검해야 합니다.

## 범위와 남은 제한

백엔드 없는 메모리 데모여서 북마크·로그인·리뷰·프로필 변경은 새로고침하면 초기화됩니다. 영화 URL, 검색어, 영화 정보는 직접 접속과 새로고침에서 유지됩니다. 목록의 페이지 1–5는 2주차 명세에 따라 선택 상태만 변경합니다. Figma 원본 파일은 이번 연결에서 편집 권한 오류를 반환했으므로 기존에 확인한 동일 화면의 복사본과 2주차 구현을 기준으로 디자인을 보존했습니다.
