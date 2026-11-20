# 8주차 필수 미션 기록

## 구현 범위

기존 UMCine 화면에 TanStack Query 기반 인증·즐겨찾기·평점 API를 연결했다. 프런트엔드는 `week8/mission1/umcine`, 로컬 Spring API는 `week8/mission2/movie`에 반영했다.

## 1. 로그인 전용 폴더와 공통 Layout Route

```text
src/routes/
└── (authenticated)/
    ├── _auth.tsx
    ├── _auth.my-info.index.tsx
    └── _auth.my-info.edit.tsx
```

`(authenticated)`는 Route Group으로 URL에 나타나지 않는다. `_auth`는 경로 없는 공통 레이아웃이다. 기존 주소 `/my-info`, `/my-info/edit`를 유지했다.

```tsx
export const Route = createFileRoute("/(authenticated)/_auth")({
  beforeLoad: requireAuth,
  component: AuthenticatedLayout,
});

export function requireAuth() {
  if (!useAuthStore.getState().accessToken) {
    throw redirect({ to: "/login" });
  }
}

export function AuthenticatedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}
```

`beforeLoad`로 비로그인 진입을 막고, 화면 표시 중 토큰이 만료되는 경우도 레이아웃에서 처리한다. 로그인한 상태에서 `/login`에 접근하면 홈으로 이동한다.

## 2. 회원가입·로그인·내 정보

- `useSignupMutation`과 `useLoginMutation`에서 요청 상태를 관리한다. `isPending` 동안 중복 제출을 막는다.
- 회원가입에 성공하면 로그인 페이지로 이동한다.
- 로그인에 성공하면 Zustand persist로 토큰을 저장하고 내 정보 캐시를 무효화한 뒤 홈으로 이동한다.
- 공개 요청은 `apiClient`, 인증 요청은 `authApi`를 사용한다. 인증 요청 직전에 최신 토큰을 읽어 Bearer 헤더를 설정한다.
- 인증 요청이 401이면 해당 요청의 토큰이 현재 토큰과 같은지 확인한 후 토큰을 지운다. 이전 계정의 늦은 응답이 새 로그인을 해제하지 않도록 했다.
- 헤더와 내 정보 페이지는 `useMyInfo`의 동일한 캐시를 공유한다. 토큰이 있을 때만 조회하고 `staleTime`은 5분, 자동 재시도는 비활성화했다.
- 로그아웃·계정 변경 시 회원 정보, 즐겨찾기, 평점 조회를 취소하고 캐시를 제거한다.

```tsx
onSuccess: (response) => {
  useAuthStore.getState().setAccessToken(response.result.accessToken);
  void client.invalidateQueries({ queryKey: ["members", "me"] });
  void navigate({ to: "/" });
}
```

내 정보 수정 응답은 내 정보 조회와 같은 구조이므로 서버 응답 전체를 같은 캐시에 저장한다.

```tsx
queryClient.setQueryData(["members", "me"], response);
void navigate({ to: "/my-info" });
```

## 3. 남은 API 연결

| 화면 / 기능 | API | 연결 내용 |
| --- | --- | --- |
| 마이페이지 | `GET /favorites` | 서버 즐겨찾기 목록 조회 후 movieId로 TMDB 영화 정보 조회 |
| 영화 상세 | `GET /favorites/{movieId}` | 현재 영화의 즐겨찾기 여부 표시 |
| 즐겨찾기 추가 | `POST /favorites` | `{ movieId }` 전송 |
| 즐겨찾기 해제 | `DELETE /favorites/{movieId}` | 현재 회원의 해당 영화 삭제 |
| 내 평점 조회 | `GET /members/{memberId}/ratings` | 응답 배열에서 현재 movieId의 평점 선택 |
| 평점 작성 | `POST /ratings` | movieId, score, comment 전송 |
| 평점 수정 | `PATCH /ratings/{ratingId}` | 기존 ratingId로 score, comment 전송 |
| 평점 삭제 | `DELETE /ratings/{ratingId}` | 성공 후 작성 폼으로 전환 |

즐겨찾기는 기존 localStorage 목록 대신 Query 캐시를 원본으로 사용한다. 영화 카드에서는 공유 목록을 사용하여 카드마다 개별 API 요청을 보내지 않고, 상세 화면에서는 개별 여부 조회 API를 사용한다. 마이페이지는 정적인 영화 목록에 없는 영화도 서버의 movieId로 표시한다.

```tsx
export function useFavoriteMutation(movieId: number) {
  const client = useQueryClient();
  const token = useAuthStore((s) => s.accessToken);
  return useMutation({
    mutationKey: ["favorites", movieId],
    mutationFn: async (isFavorite: boolean) =>
      isFavorite ? removeFavorite(movieId) : addFavorite(movieId),
    onSuccess: async () => {
      if (token !== useAuthStore.getState().accessToken) return;
      await client.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
```

평점 목록 API는 공통 응답으로 감싸지 않은 배열을 반환한다. 평점 변경과 즐겨찾기 API는 `isSuccess`, `code`, `message`, `result` 형식이다. 이 차이를 타입에 반영했다.

현재 로컬 서버 JWT의 `sub`가 회원 ID이므로 조회 URL 구성에만 사용한다. 브라우저에서 JWT 내용을 읽는 것은 인증 검증이 아니다. 실제 작성자와 수정·삭제 권한은 서버가 서명을 검증한 토큰으로 결정한다.

별점은 1~5점, 후기는 최대 500자로 제한했다. 조회 중·조회 실패·변경 실패를 표시하고 재시도를 제공한다. 변경 요청 중에는 입력과 중복 제출을 막는다. 실패한 변경은 성공한 것처럼 캐시에 반영하지 않는다.

## 4. 로컬 서버 보완

기존 서버에는 즐겨찾기 API가 없어 Favorite 엔티티, Repository, Service, Controller와 요청·응답 DTO를 추가했다.

- 회원 ID는 요청 본문 대신 인증 인터셉터에서 받는다.
- `(member_id, movie_id)` 유일성 제약으로 중복 저장을 방지한다.
- 목록·상태·삭제 쿼리를 현재 회원 ID로 제한한다.
- 중복 등록은 409, 미등록 즐겨찾기 삭제는 404, 미인증 요청은 401로 처리한다.
- `sql/week8-favorites.sql`을 추가하고 현재 로컬 MySQL에 적용했다. 기존 `ddl-auto: validate` 설정을 유지한 상태에서 서버 기동을 확인했다.

## 5. 최종 확인 결과

2026-11-19에 아래 검증을 수행했다.

| 검증 | 결과 |
| --- | --- |
| `pnpm build` | TypeScript 검사 및 Vite 빌드 통과 |
| `pnpm lint` | ESLint 통과 |
| `gradlew.bat test bootJar` | 테스트 7개 통과, 실패·오류 0개, 서버 패키징 통과 |
| 즐겨찾기 서버 테스트 | 미인증 거부, 추가·조회·삭제, 중복 거부, 잘못된 ID 거부, 회원 간 데이터 분리 통과 |
| 기존 인증·평점 서버 테스트 | 로그인, 토큰 검증, 평점 등록·수정·삭제 및 소유권 검사 통과 |
| 브라우저: 보호 라우트 | 비로그인 `/my-info/edit` → `/login` 확인 |
| 브라우저: 로그인 | 실패 안내 후 재시도, 토큰 저장, 홈 이동, 로그인 페이지 재접근 제한 확인 |
| 브라우저: 즐겨찾기 | 실패 후 재시도, 추가, 마이페이지 목록, 삭제 후 빈 목록 확인 |
| 브라우저: 평점 | 생성 → 수정 → 삭제 → 빈 작성 폼 확인 |
| 브라우저: 닉네임 | 변경된 닉네임 반영, PATCH 이후 추가 GET 없이 갱신 확인 |
| 브라우저: 인증 만료 | 내 정보 API 401 이후 토큰 제거와 로그인 이동 확인 |
| 로컬 MySQL / 서버 | favorite 테이블 준비 및 Spring Boot 정상 기동 확인 |

브라우저 검사는 실제 React 앱을 Edge headless에서 실행하되 API/TMDB 응답을 모의 처리했다. 서버 검사는 H2 기반 Spring 통합 테스트로 수행했다. 실제 사용자 계정으로 MySQL과 TMDB를 함께 연결한 전체 브라우저 시나리오는 별도로 수행하지 않았다.

## 핵심 키워드 정리

**클라이언트 상태와 서버 상태**: 폼 입력값은 사용자가 편집하는 로컬 상태이므로 React state에 둔다. 로그인 토큰은 브라우저에서 유지해야 하는 인증 상태이므로 Zustand persist로 관리한다. 회원 정보, 즐겨찾기, 평점의 원본은 서버에 있으므로 Query 캐시에서 관리한다. 같은 회원 정보를 전역 store에도 복사하면 어느 쪽이 최신인지 달라질 수 있다.

**캐시 일관성**: 서버 수정만으로 브라우저 캐시가 자동 변경되지는 않는다. 관련 화면들이 같은 query key를 공유하고 변경 성공 시 갱신해야 한다. 즐겨찾기와 평점은 `invalidateQueries`로 서버에서 최신 결과를 다시 조회한다. 내 정보 수정은 응답에 최신 회원 정보가 있으므로 `setQueryData`로 바로 저장한다.

## 학습 후기 초안

요청의 진행·성공·실패를 useMutation으로 묶으면서 폼에서 직접 관리할 상태가 줄었다. API 연결 자체뿐 아니라 변경 후 어떤 캐시를 갱신할지 정하는 과정이 중요했다. 내 정보는 수정 응답을 그대로 활용할 수 있었고, 즐겨찾기와 평점은 관련 목록을 다시 조회하는 방식으로 여러 화면의 상태를 맞췄다. 로그인 여부와 실제 조회 중인 상태를 구분하고, 로그아웃 때 사용자 캐시를 비우는 처리도 필요했다.

## 참고 자료

- [TanStack Router 파일 이름 규칙](https://tanstack.com/router/latest/docs/routing/file-naming-conventions)
- [워크북 API 문서](https://workbook.devnoco.com/docs)
- [8주차 OpenAPI 명세](https://workbook.devnoco.com/docs/v8-json)

Notion 필수 미션 토글에 위 기록을 붙여 넣어 제출할 수 있다. 스터디 인증 사진, 개인 Notion URL 작성 및 UMC 제출은 이 작업에서 수행하지 않았다.
