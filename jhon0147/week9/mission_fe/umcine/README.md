# UMCine 9주차 — Next.js

8주차 UMCine의 화면과 API 코드를 Next.js 16.4 App Router로 옮겼습니다.

| 주소 | 기능 |
| --- | --- |
| `/` | 인기 영화 목록·페이지 이동 |
| `/search?query=검색어&page=2` | 영화 검색 |
| `/movies/550` | 서버에서 상세 조회 후 Query 캐시 전달, 즐겨찾기·평점 |
| `/suspense/550` | Suspense를 사용하는 기존 상세 화면 |
| `/signup`, `/login` | 회원가입·로그인 |
| `/mypage`, `/edit-profile` | 로그인 전용 회원 정보·즐겨찾기·닉네임 수정 |

## 실행

Node.js 22.12 이상과 pnpm이 필요합니다.

```powershell
cd C:\dev\UMC_11th_Study\jhon0147\week9\mission_fe\umcine
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
```

`.env.local`의 `TMDB_TOKEN`에 기존 TMDB Read Access Token을 입력합니다. 기존 Vite 앱의 `VITE_TMDB_TOKEN` 값과 같은 종류의 토큰입니다. `NEXT_PUBLIC_` 접두어는 붙이지 않습니다.

```powershell
pnpm dev
```

기본 주소는 [http://localhost:3000](http://localhost:3000)입니다. 회원 API는 기본적으로 공식 `https://workbook.devnoco.com/v8`을 사용합니다. 로컬 백엔드가 필요하면 `NEXT_PUBLIC_API_BASE_URL`을 변경하고 백엔드 CORS에서 프론트 주소를 허용합니다.

## 구성

- `src/app`: 페이지·공통 레이아웃·Route Handler. 이전 주소를 유지합니다.
- `src/screens`: 기존 화면 컴포넌트. Next.js의 Pages Router와 겹치지 않도록 이름을 바꿨습니다.
- `src/app/providers.tsx`: Query Provider, 저장된 토큰 복원, 계정 변경 시 개인 캐시 제거.
- `src/app/(member)/layout.tsx`: 공통 AuthGuard. 토큰 복원 완료 후 로그인 여부를 판단합니다.
- `src/lib/server/tmdb.ts`: 서버에서만 TMDB 토큰을 읽습니다.
- `src/app/api/tmdb/[...path]/route.ts`: 브라우저의 영화 조회 요청을 처리합니다.
- `next.config.ts`: Cache Components와 TMDB 이미지 호스트 설정.
- `postcss.config.mjs`: Tailwind PostCSS 설정.

페이지와 레이아웃은 서버에 두고, 입력·이벤트·상태가 필요한 컴포넌트를 클라이언트로 분리했습니다. 토큰은 기존과 같이 브라우저에 저장하며 회원 API가 실제 권한을 확인합니다. Next의 인증 쿠키로 옮기는 작업은 포함하지 않았습니다.

영화 상세는 서버의 QueryClient로 데이터를 조회한 뒤 HydrationBoundary에 전달합니다. 서버 조회에 실패하면 클라이언트의 기존 오류 안내와 재시도 흐름을 사용합니다. 즐겨찾기와 평점의 mutation 및 캐시 갱신은 8주차 코드를 재사용합니다.

포스터는 `next/image`, Geist는 `next/font/local`을 사용합니다. 폰트 파일과 라이선스는 `src/app/fonts`에 포함돼 있어 빌드 중 Google Fonts 요청이 필요하지 않습니다.

상세 데이터 조회는 페이지 내부의 Suspense 경계에 두었습니다. 브라우저 토큰 복원을 기다리는 회원 페이지에는 `instant = false`를 명시했습니다.

## 검증

```powershell
pnpm lint
pnpm test
pnpm typecheck
pnpm build
pnpm start
```

린트·자동 테스트 35개·타입 검사·프로덕션 빌드가 통과했습니다. 브라우저에서는 로컬 모의 API로 가입·로그인·로그인 유지·검색/페이지 이동·회원 정보 수정·즐겨찾기·평점·계정 전환·401 만료 처리를 확인했습니다.

서버 응답 HTML의 모의 영화 제목·메타데이터·폰트 경로와 브라우저의 Geist 적용도 확인했습니다. 실제 TMDB 토큰과 공식 회원 계정으로 사용하는 전체 흐름은 별도 확인이 필요합니다.

## 제출

Git 제출 경로는 `jhon0147/week9/mission_fe`입니다. `.env.local`, `node_modules`, `.next`는 제외됩니다. `pnpm-lock.yaml`과 폰트 파일·라이선스는 코드와 함께 제출합니다.

노션 정리본과 실행·제출 안내는 한 단계 위의 `WEEK9_NOTION_fe.md`, `SUBMISSION_fe.md`에 있습니다.

## 참고

- [워크북](https://app.notion.com/p/0668e9fe59ca82928e378114188edf47)
- [Next.js - Migrating from Vite](https://nextjs.org/docs/app/guides/migrating/from-vite)
- [TanStack Query - Advanced Server Rendering](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
