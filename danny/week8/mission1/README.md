# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## 4주차 선택 미션 기록

### 북마크 저장소를 sessionStorage로 바꿨을 때의 차이

`bookmark-store.ts`의 저장소를 `localStorage`에서 `sessionStorage`로 바꾸고, 영화 한 편을 북마크한 뒤 같은 순서로 확인했어요.

| 상황 | sessionStorage | localStorage |
|---|---|---|
| 같은 탭 새로고침 | 유지 | 유지 |
| 새 탭 열기 | 비어 있음 | 유지 |
| 탭 닫고 다시 열기 | 비어 있음 | 유지 |
| 브라우저 재실행 | 비어 있음 | 유지 |

- `sessionStorage`는 탭마다 따로 저장되고, 탭을 닫으면 사라져요. 그래서 같은 탭의 새로고침에서만 북마크가 남았어요.
- `localStorage`는 같은 사이트의 모든 탭이 함께 쓰고, 브라우저를 다시 열어도 남아 있어요.
- 필수 미션이 "브라우저 재실행 뒤에도 유지"라서 북마크는 `localStorage`로 다시 되돌렸어요.

### 브라우저에만 저장하는 화면 설정: 영화 정렬

- 영화 목록 제목 오른쪽에서 기본순, 최신 개봉순, 제목순을 고를 수 있어요.
- 선택값은 `umcine-view-settings-store` 키로 `localStorage`에 저장돼서, 새로고침하거나 브라우저를 다시 열어도 유지돼요.
- 저장값이 JSON이 아니거나 없는 정렬 값이면 기본순으로 돌아가요.

## 5주차 TMDB 연결

### 실행 전 설정

TMDB의 API Read Access Token을 `.env.local`에 넣어요. `.env.local`은 `.gitignore`에 걸려 커밋되지 않아요.

```bash
cp .env.example .env.local
# .env.local
VITE_TMDB_ACCESS_TOKEN=발급받은_토큰
```

`VITE_`로 시작하는 값은 빌드 결과에 그대로 들어가서 브라우저에서 볼 수 있어요. 공개되면 안 되는 비밀 키는 이렇게 쓰면 안 돼요.

### 순수 fetch로 인기 영화 요청하기

ky로 바꾸기 전에 아래처럼 `fetch`만으로 인기 영화를 요청했어요.

```ts
export async function getPopularMovies(page: number, signal?: AbortSignal) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
      },
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(`TMDB 요청이 실패했어요. (${response.status})`);
  }

  const data: TmdbPagedResponse<TmdbMovieListItem> = await response.json();
  return toMoviePage(data);
}
```

Network 패널에서 확인한 내용이에요.

- 요청: `GET https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1`, `Authorization: Bearer ...` 헤더 포함
- 토큰 없이 보낸 응답: `401 {"status_code":7,"status_message":"Invalid API key: You must be granted a valid key.","success":false}`
- 개발 모드에서는 같은 요청이 하나 더 `(canceled)`로 보여요. StrictMode가 effect를 두 번 실행하면서 첫 요청을 `AbortController`로 취소하기 때문이에요.

`fetch`는 401, 500 같은 응답도 실패로 보지 않아서 `response.ok`를 직접 확인해야 했어요. ky로 바꾼 뒤에는 기본 주소, 헤더, `language`를 인스턴스(`src/api/tmdb-client.ts`)에 한 번만 두고, 2xx가 아닌 응답은 ky가 `HTTPError`로 던져줘요.

## 6주차 TanStack Query 적용

### query key

요청 종류와 조건을 모두 key에 넣어서, 페이지나 검색어가 다르면 다른 cache로 구분돼요. key는 `src/api/movie-queries.ts`의 `movieKeys`에서만 만들어요.

| 화면 | query key |
|---|---|
| 목록 | `["movies", "popular", { page }]` |
| 검색 | `["movies", "search", { query, page }]` |
| 상세 | `["movies", "detail", movieId]` |

`src/api/query-client.ts`의 기본 설정이에요.

- `staleTime` 5분: 한 번 받은 영화 데이터는 5분 동안 다시 요청하지 않아요.
- `retry`: 401·404 같은 4xx는 다시 보내도 결과가 같아서 재시도하지 않고, 네트워크·5xx 오류만 한 번 더 시도해요.

### queryOptions로 리팩터링

처음에는 화면마다 key와 요청 함수를 직접 적었어요.

```tsx
const moviesQuery = useQuery({
  queryKey: ["movies", "popular", { page }],
  queryFn: ({ signal }) => getPopularMovies(page, signal),
});
```

`queryOptions`로 key와 요청 함수를 묶어 두니, 화면에서는 옵션 함수만 불러요. key가 한곳에 모여 있어서 화면마다 key를 다르게 적는 실수를 막을 수 있어요.

```tsx
const moviesQuery = useQuery(popularMoviesQueryOptions(page));
```

### cache와 요청 흐름 확인

실제 TMDB에 연결해서 확인한 내용이에요.

- 목록에서 상세로 갔다가 뒤로 오면, 로딩 없이 바로 목록이 보이고 인기 영화 요청이 다시 나가지 않아요.
- 같은 상세 화면, 이미 본 페이지, 이미 검색한 결과를 다시 열 때도 요청이 나가지 않아요.
- 다른 페이지나 다른 검색어는 key가 달라서 새 요청이 나가요.
- Query 개발자 도구에서 `["movies","popular",{"page":1}]` 같은 key와 Fresh·Stale 상태를 볼 수 있어요.
- 없는 영화(404)는 요청 1번 만에 "영화를 찾을 수 없어요."가 나오고, 500 오류는 자동으로 1번 더 시도한 뒤 오류 화면을 보여줘요.

## 7주차 로그인과 내 정보 화면

### 폴더 구조

로그인이 필요한 내 정보 조회와 수정 화면을 `routes/(member)/` 폴더로 묶었어요. 괄호로 감싼 폴더는 TanStack Router의 route group이라 URL에는 들어가지 않아요. 이번 주차에는 layout이나 로그인 여부에 따른 접근 제한은 만들지 않았고, 나중에 이 폴더에 `route.tsx`를 추가하면 묶인 화면에만 공통 layout이나 접근 제한을 걸 수 있어요.

```
src/
├── routes/
│   ├── login.tsx                 /login
│   └── (member)/
│       └── me/
│           ├── index.tsx         /me
│           └── edit.tsx          /me/edit
├── pages/
│   ├── auth/login-page.tsx
│   └── members/
│       ├── my-info-page.tsx
│       └── my-info-edit-page.tsx
├── components/members/profile-avatar.tsx
└── stores/profile-store.ts
```

### 입력한 값이 반영되는 흐름

- 로그인하면 이메일이 `profile-store`에 저장되고, 닉네임이 없으면 이메일 앞부분을 닉네임으로 써요. 비밀번호는 저장하지 않아요.
- 내 정보 수정에서 저장한 닉네임과 프로필 이미지가 내 정보 화면에 바로 반영돼요.
- 닉네임과 이메일은 `umcine-profile-store` 키로 `localStorage`에 남아서 새로고침해도 유지돼요. 프로필 이미지는 용량이 커서 저장하지 않고 이번 접속 동안만 보여줘요.

## 8주차 로그인 전용 폴더와 남은 API 연결

### 로그인 전용 폴더

`routes/(member)/route.tsx`가 마이페이지(`/me`)와 내 정보 수정(`/me/edit`)의 공통 Layout Route예요. `beforeLoad`에서 토큰이 없거나 만료됐으면 `/login?redirect=원래주소`로 보내고, 로그인하면 원래 보려던 화면으로 돌아와요. 하위 화면은 `<Outlet />`으로 렌더링해요.

```
src/routes/
├── login.tsx
├── signup.tsx
└── (member)/
    ├── route.tsx      Layout Route (로그인 확인 + <Outlet />)
    └── me/
        ├── index.tsx  /me
        └── edit.tsx   /me/edit
```

### 연결한 API

| 화면 | API |
|---|---|
| 로그인 | `POST /auth/login` |
| 회원가입 | `POST /members`, `GET /members/email/{email}`, `GET /members/nickname/{nickname}` |
| 마이페이지 | `GET /members/me`, `GET /favorites` |
| 내 정보 수정 | `PATCH /members/me` |
| 영화 상세 | `GET /favorites/{movieId}`, `POST /favorites`, `DELETE /favorites/{movieId}`, `GET /members/{memberId}/ratings`, `POST /ratings`, `PATCH /ratings/{ratingId}`, `DELETE /ratings/{ratingId}` |

- 로그인 응답의 `accessToken`을 `umcine-auth-store`에 저장하고, ky의 `beforeRequest` hook이 모든 서버 요청에 `Authorization: Bearer` 헤더를 붙여요.
- 토큰이 만료돼 서버가 401을 주면 `afterResponse` hook이 로그아웃시켜요.
- `GET /members/{memberId}/ratings`에 쓸 `memberId`는 토큰의 `sub` 값에서 꺼내요. 로그인 응답과 `GET /members/me`에는 `memberId`가 없어서예요.

### invalidateQueries와 setQueryData 비교

| | `invalidateQueries` | `setQueryData` |
|---|---|---|
| 적용한 곳 | 즐겨찾기 등록·해제 후 즐겨찾기 목록 | 평점 등록·수정·삭제, 닉네임 수정, 즐겨찾기 여부 |
| 추가 요청 | 있음 (`GET /favorites`를 다시 보냄) | 없음 (mutation 응답으로 cache를 바로 고침) |
| 화면 갱신 | 다시 받은 응답이 오면 갱신 | 응답을 받는 즉시 갱신 |
| 장점 | 서버의 최신 상태(정렬, 다른 기기에서 바꾼 값)를 그대로 받음 | 빠르고 요청이 줄어듦 |
| 단점 | 요청이 한 번 더 나가고 그동안 기다려야 함 | 서버가 하는 일(정렬, 계산)을 클라이언트가 똑같이 따라 해야 함 |

- 즐겨찾기 목록은 서버가 최신 등록순으로 정렬하고 `favoriteId`, `createdAt`도 서버가 정해서, 직접 고치기보다 다시 받는 게 정확해요.
- 평점과 닉네임은 mutation 응답에 바뀐 값이 그대로 들어 있어서, 그 값으로 cache를 고치면 추가 요청이 필요 없어요.
- 즐겨찾기 등록·해제가 409·404로 실패하면 화면과 서버 상태가 어긋난 것이라 즐겨찾기 cache 전체를 다시 받아 맞춰요.

### mutationOptions

로그인, 회원가입, 닉네임 수정은 `api/member-queries.ts`, 즐겨찾기는 `api/favorite-queries.ts`, 평점은 `api/rating-queries.ts`에 `mutationOptions`로 모았어요. 화면에서는 `useMutation(loginMutationOptions())`처럼 불러서 요청 함수와 cache 갱신 규칙을 한곳에서 관리해요.
