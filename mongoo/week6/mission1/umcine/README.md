# UMCine · 5주차 필수 미션

이전 「5주차 프론트엔드 실습 진행」 채팅에서 작성한 실습 예제와 필수 미션 코드를 복원한 프로젝트입니다.

## 실행

```bash
pnpm install
pnpm dev
```

프로젝트 루트의 `.env.local`에 아래 설정이 필요합니다. 기존 실습 폴더의 설정을 복원했으며, 새 환경에서는 `.env.example`을 복사하고 토큰을 입력하세요.

```dotenv
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=발급받은_API_READ_ACCESS_TOKEN
```

환경 변수 변경 후 개발 서버를 재시작하세요. `.env.local`은 Git에서 제외됩니다. `VITE_` 변수는 브라우저 빌드에 포함됩니다.

## 복원한 내용

- Promise 상태 및 `.then()` / `async/await` 실습: `src/examples/`
- 순수 fetch 인기 영화 요청: `src/api/movies/get-movies-with-fetch.ts`
- ky 2.x 공통 인스턴스 및 목록·검색·상세 API: `src/api/`
- 인기 영화 목록, URL 검색어로 검색, 영화 ID로 상세 조회
- 로딩·오류·빈 결과·성공 상태, 잘못된 ID와 404 처리
- TMDB 이미지 URL 변환과 이미지 경로가 없는 경우 대체 영역
- 기존 Zustand 북마크 유지
- 목록·검색 결과·상세 화면의 TMDB 출처 footer

실습 예제는 보관만 하며 `src/main.tsx`에서 자동 실행하지 않습니다. Network 실습을 다시 확인하려면 `import "./examples/fetch-movies";`를 임시로 추가하고 확인 후 제거하세요.

## 확인

```bash
pnpm build
pnpm lint
```

브라우저에서는 다음 항목을 확인하세요.

- `/`: 인기 영화 및 북마크
- `/search`: 빈 검색 화면, 검색 시 URL query와 결과
- `/search?query=인셉션`: 직접 접근 및 새로고침
- `/movies/27205`: 직접 접근 및 새로고침
- `/movies/abc`, `/movies/0`: 잘못된 ID 안내
- 존재하지 않는 양의 정수 ID: 404 안내
- Network의 GET·Authorization·응답, 오프라인 오류 안내
- 목록·검색 결과·상세 footer와 빈 검색 화면의 footer 숨김

워크북의 요청 전 상태 초기화 코드를 유지하기 위해 두 페이지에만 `set-state-in-effect` 검사 예외를 두었습니다. 라우트 파일은 TanStack Router의 `Route` export를 허용합니다.


## 백엔드 5주차 연동

새 화면 없이 기존 영화 상세의 **내 평점** 영역에 `회원 정보 확인 · 평점 불러오기` 접이식 항목을 연결했다.
기존 목록/검색/헤더/라우터/TMDB 출처 디자인과 동작은 유지한다.

1. `week5/mission2/movie`에서 Spring 서버를 localhost:8080으로 실행한다.
2. 이 프론트 프로젝트를 `pnpm dev --port 5173 --strictPort`로 실행하고 http://localhost:5173을 연다.
3. 영화 상세로 들어가 내 평점 아래의 회원 확인 항목을 펼친다.
4. 닉네임·이메일의 중복/신규를 확인하고 회원 번호로 평점을 조회한다.
5. Network에서 GET 3개의 실제 URL·상태·응답 JSON을 확인한다.

Spring API 주소는 `VITE_BACKEND_API_BASE_URL`로 변경할 수 있고 기본값은 http://localhost:8080이다. TMDB 환경 변수/토큰은 기존 설정을 유지한다.
조회한 회원의 평점 중 현재 영화의 기록이 있으면 기존 별점/후기 영역에 표시한다. 전체 회원 평점 목록은 등록 번호 내림차순으로 표시한다.
회원가입/로그인/평점 저장 API는 이번 범위에 포함하지 않는다. 저장 버튼은 다음 주차 구현 전까지 비활성화했다.
