# UMCine

UMC Frontend 2·3주차 프로젝트에 4주차 Zustand 및 Web Storage를 통합했습니다. 기존 TanStack Router·Tailwind CSS v4·영화 데이터·이미지·페이지 선택을 유지하며, 북마크와 카드 크기 설정을 브라우저에 저장합니다.

## 실행

Node.js 24 및 pnpm 12.5.1 기준입니다. 프로젝트 폴더에서 실행하세요.

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm dev --host 127.0.0.1 --port 5173 --strictPort
```

개발 서버는 `http://127.0.0.1:5173/`입니다. Storage 검증 중에는 같은 origin을 유지하세요 (`localhost`와 `127.0.0.1`, 다른 포트는 별도 저장소입니다). 검사와 프로덕션 빌드:

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

## 주요 URL

- `/` — 영화 목록, 북마크, 1–5 페이지 선택
- `/search` — 검색 입력
- `/search?query=오디세이` — 검색 결과
- `/movies/1` — 영화 상세
- `/login`, `/signup`, `/profile`, `/profile/edit` — 기존 계정·프로필 데모
- `/storage-lab?storage=local` — 직접 localStorage 실습 및 저장값 검증
- `/storage-lab?storage=session` — sessionStorage 비교 실습

데모 로그인: `gwangsoo@cinemalab.kr` / `Demo123!`

`src/routes`는 URL 연결, `src/pages`와 `src/components`는 화면, `src/stores`는 북마크·화면 설정의 상태와 저장 정책, `src/utils`는 저장값 검증을 맡습니다. `src/hooks/use-umcine.ts`에는 계정·리뷰·페이지 선택 데모가 남아 있습니다. `src/routeTree.gen.ts`는 TanStack Router 플러그인 생성 파일입니다. 새 환경에는 `src`뿐 아니라 `public`, 설정 파일, `package.json`, `pnpm-lock.yaml`, `tests`도 함께 복사하세요.

백엔드는 연결되지 않았습니다. 영화·검색 정보는 URL과 로컬 데이터에서 복원됩니다. 북마크는 `umcine-bookmark-store`, 카드 크기는 `umcine-display-settings`에 저장됩니다. 북마크는 로그인 계정과 무관한 해당 브라우저의 즐겨찾기이며 로그인·로그아웃 시 유지됩니다. 인증·프로필·리뷰는 메모리 데모라 새로고침 시 초기화됩니다. 목록의 1–5 페이지는 2주차 명세대로 선택 상태만 바꿉니다.

직접 저장 effect는 실습 화면에서만 `umcine-bookmarks` / `umcine-session-bookmarks`를 사용합니다. 실제 북마크 key는 Zustand persist만 저장합니다. 저장소가 차단되거나 용량 오류가 나면 Console에 보고하고 현재 메모리의 동작을 유지하지만 영속 저장 성공으로 간주하지 않습니다.

4주차 변경 내역·핵심 코드·실제 검증 및 남은 수동 확인은 [docs/week4-frontend-notion-record.md](docs/week4-frontend-notion-record.md)에 있습니다. 이전 제출 기록은 [MISSION_WEEK3.md](MISSION_WEEK3.md), 원본 에셋 출처는 [public/images/SOURCES.md](public/images/SOURCES.md)에 있습니다.
