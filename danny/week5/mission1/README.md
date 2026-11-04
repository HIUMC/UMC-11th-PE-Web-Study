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
