# UMCine 8주차

7주차 영화 프로젝트에 TanStack Query의 mutation과 인증 이후 기능을 연결했습니다.

- `/signup`: 입력값·중복 확인, useMutation으로 가입 요청의 대기·성공·실패 처리
- `/login`: 로그인 API, 토큰 저장, 성공 후 홈 이동
- `/mypage`: 서버의 내 정보와 즐겨찾기한 영화 조회
- `/edit-profile`: 닉네임 수정, 응답으로 회원 캐시 갱신
- `/movies/:movieId`, `/suspense/:movieId`: 즐겨찾기와 내 평점 등록·수정·삭제

## 실행

Node.js 22.12 이상이 필요합니다. pnpm이 설치되어 있다면 아래 `npx --yes pnpm@10` 대신 `pnpm`을 사용해도 됩니다.

```powershell
npx --yes pnpm@10 install --frozen-lockfile
Copy-Item .env.example .env.local
```

`.env.local`의 `VITE_TMDB_TOKEN`에 TMDB Read Access Token을 입력합니다.

```powershell
npx --yes pnpm@10 dev
```

회원 API의 기본 주소는 `https://workbook.devnoco.com/v8`입니다. 이 설정에서는 로컬 백엔드가 필요하지 않습니다. 직접 실행한 서버를 사용할 때는 `VITE_API_BASE_URL`을 그 주소로 바꾸고 CORS에서 프론트엔드 주소를 허용합니다.

회원 요청용 API와 TMDB 요청용 API는 별도 인스턴스를 사용합니다. TMDB 토큰을 회원 서버에 보내지 않습니다. 비밀번호와 토큰을 코드에 넣지 않고 `.env.local`은 커밋하지 않습니다.

## 상태와 인증

입력값은 컴포넌트 상태, 로그인 토큰은 Zustand persist, 회원 정보·즐겨찾기·평점은 Query 캐시에서 관리합니다. 로그아웃·계정 변경 시 개인 query를 취소하고 캐시를 제거합니다. 영화 캐시는 유지합니다.

`routes/(member)/_auth.tsx`가 공통 로그인 검사를 수행하고 `AuthLayout`의 `Outlet`으로 마이페이지와 수정 페이지를 표시합니다. URL은 `/mypage`, `/edit-profile`입니다. 로그인 상태로 `/login`을 열면 홈으로 이동합니다.

인증 요청 직전에 최신 토큰을 읽어 Bearer 헤더를 넣고, 같은 토큰으로 보낸 요청이 401을 받으면 로그아웃 처리합니다. 회원 번호는 JWT payload의 `sub`에서 읽어 평점 조회 경로에 사용합니다. 토큰 서명과 소유자 권한은 서버에서 검증합니다.

## API 연결

아래 경로는 `VITE_API_BASE_URL`을 기준으로 합니다.

| API | 화면·동작 |
| --- | --- |
| `POST /members` | 회원가입 |
| `POST /auth/login` | 로그인 |
| `GET /members/me` | 헤더·마이페이지·수정 폼 |
| `PATCH /members/me` | 닉네임 수정 |
| `GET /favorites` | 마이페이지·목록 카드의 즐겨찾기 |
| `GET /favorites/{movieId}` | 상세 화면의 즐겨찾기 여부 |
| `POST /favorites` | 즐겨찾기 추가 |
| `DELETE /favorites/{movieId}` | 즐겨찾기 해제 |
| `GET /members/{memberId}/ratings` | 현재 영화의 내 평점 찾기 |
| `POST /ratings` | 평점 등록 |
| `PATCH /ratings/{ratingId}` | 평점 수정 |
| `DELETE /ratings/{ratingId}` | 평점 삭제 |

평점 조회는 배열을 직접 반환하고, 즐겨찾기 목록은 공통 응답의 `result` 배열을 반환합니다. 즐겨찾기는 `movieId`, 평점 수정·삭제는 `ratingId`로 요청합니다. 평점은 1~5 정수이고 후기는 500자 이하입니다. 수정할 때 후기가 없어지지 않도록 기존 후기와 score를 함께 보냅니다.

## 캐시 갱신

`src/mutations/account-mutations.ts`에 mutationOptions를 정리했습니다.

| 동작 | 갱신 방법 |
| --- | --- |
| 로그인 | 내 정보 query 무효화 |
| 닉네임 수정 | 응답으로 내 정보 캐시 교체 |
| 즐겨찾기 변경 | 여부 캐시 변경, 목록 query 무효화 |
| 평점 등록 | 평점 query 무효화 |
| 평점 수정·삭제 | 평점 목록의 해당 항목 교체·제거 |

목록 카드들은 즐겨찾기 query 하나를 공유합니다. `invalidateQueries`로 비활성 목록을 무효화하면 다음에 목록을 열 때 다시 조회합니다. `setQueryData` 자체는 추가 GET 요청을 만들지 않습니다.

## 검증

```powershell
npx --yes pnpm@10 lint
npx --yes pnpm@10 test
npx --yes pnpm@10 build
```

린트 경고·오류 0개, 자동 테스트 28개, 타입 검사와 프로덕션 빌드를 확인했습니다. 자동 테스트에서는 응답 형식 차이, 영화·평점 식별자, 오류 응답, 후기 전달, 회원 번호 해석, 로그아웃 중 요청 취소를 확인합니다.

브라우저 흐름은 공식 명세에 맞춘 로컬 모의 API로 가입·로그인·접근 제한·닉네임 수정·즐겨찾기·평점·계정 전환·만료 처리를 확인했습니다. 실제 서버에서는 토큰 없는 내 정보·즐겨찾기 조회의 401 응답과 CORS 사전 요청을 확인했습니다. 실제 계정과 TMDB 토큰으로 사용하는 전체 흐름은 별도 확인이 필요합니다.

## 참고

- [워크북 API 문서](https://workbook.devnoco.com/docs)
- [TanStack Query - Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [TanStack Query - Updates from Mutation Responses](https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses)
- [TanStack Router - File Naming Conventions](https://tanstack.com/router/latest/docs/routing/file-naming-conventions)
