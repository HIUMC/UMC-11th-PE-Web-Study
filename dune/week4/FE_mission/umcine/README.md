# UMCine

`week4/FE_mission/umcine`에서 기존 영화 목록, 제목 검색, 영화 상세, 북마크를 Next.js App Router로 옮겼습니다.

## 실행

기존 `.env.local`이 있는 경우 이전 `VITE_TMDB_*` 값도 서버에서 읽습니다. 새로 접속 정보를 설정할 때는 `.env.example`을 `.env.local`로 복사한 뒤 `TMDB_ACCESS_TOKEN`에 TMDB API Read Access Token을 넣으세요.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

개발 주소는 이전 Vite 프로젝트와 같은 `http://localhost:5173`입니다. 같은 브라우저와 주소를 쓰면 기존 북마크가 이어집니다. 제출용 빌드와 린트는 `pnpm build`, `pnpm lint`로 확인합니다.

## 필수 미션 인증

### 핵심 코드

- `src/app`에 `/`, `/search`, `/movies/[movieId]`를 매핑했습니다. 공통 헤더와 푸터는 `layout.tsx`에 두고, 페이지 이동은 `next/link`의 `href`로 바꿨습니다. 검색어는 `useSearchParams()`로 읽고 폼 제출 시 `useRouter().push()`로 URL을 갱신합니다.

```tsx
<Link href={`/movies/${movie.id}`}>{movie.title}</Link>

const query = useSearchParams()?.get("query") ?? "";
const params = new URLSearchParams({ query: nextQuery });
router.push(nextQuery ? `/search?${params}` : "/search");
```

- 영화 상세는 `Suspense` 안에서 URL의 `params`를 기다린 뒤 서버에서 TMDB 데이터를 읽습니다. 목록과 검색은 Client Component의 React Query를 유지하고, Next.js Route Handler를 통해 TMDB를 조회합니다. TMDB 토큰은 서버에서 `process.env`로 읽습니다.

```tsx
async function MovieDetailRoute({ params }: PageProps) {
  const { movieId } = await params;
  return <MovieDetailPage movieId={Number(movieId)} />;
}
```

- React Query Provider를 클라이언트 경계 안에 뒀습니다. Zustand는 자동 복원을 끄고 브라우저에서만 기존 저장 키 `umcine-bookmark-store`의 값을 복원합니다.

```tsx
// src/stores/bookmark-store.ts
storage:
  typeof window === "undefined"
    ? undefined
    : createJSONStorage(() => window.localStorage),
skipHydration: true,

// src/app/providers.tsx
useEffect(() => {
  void useBookmarkStore.persist?.rehydrate();
}, []);
```

### 최종 확인 결과

- `pnpm build`, `pnpm lint`를 통과했습니다. 빌드에서 `/`와 `/search`는 `○`로, `/movies/[movieId]`는 `◐`로 표시됐습니다.
- 프로덕션 빌드를 Chrome에서 실행하고 실제 TMDB 응답으로 영화 목록의 다음·이전 페이지, 제목 검색, 검색 URL 새로고침·뒤로 가기, 영화 상세를 확인했습니다. 검색 결과가 없을 때와 잘못된 영화 ID의 안내도 확인했습니다.
- 상세에서 추가한 북마크가 새로고침 뒤 복원되고 영화 목록에도 반영됐습니다. 목록에서 해제한 상태도 새로고침 뒤 유지됐습니다. 이전 Vite 앱 형식으로 저장한 북마크도 개발 주소에서 복원되는 것을 확인했습니다.

## 4~5장 발표 요약

### 4장. 서버에서 데이터를 읽고 페이지 준비하기

1. 워크북의 `/[id]`에서 URL마다 다른 할 일을 가져오는 흐름을 설명합니다. 비동기 Server Component가 `await params`로 ID를 얻고, API 응답의 `response.ok`를 확인한 뒤 `response.json()`으로 제목을 읽습니다. `Suspense`의 `fallback`은 데이터가 준비될 때까지 표시됩니다.
2. 빌드 결과의 **○**와 **◐**를 비교합니다. 워크북의 `○ /new`는 빌드 때 페이지 전체를 만드는 **SSG**입니다. Cache Components를 켠 `◐ /[id]`는 공통 화면과 로딩 UI를 미리 만들고, 요청 시 할 일 영역을 서버에서 렌더링해 스트리밍하는 **부분 사전 렌더링**입니다. 요청 시 HTML을 준비하는 영역에 **SSR**이 적용됩니다. Server Component는 빌드 시점과 요청 시점 모두에 실행될 수 있습니다.
3. UMCine의 첫 화면에서 영화 카드를 눌러 `/movies/[movieId]`를 보여 줍니다. 이 프로젝트에서는 URL의 `movieId`에 맞춰 서버가 영화 상세를 조회하고, 북마크 버튼은 클릭과 브라우저 저장소를 담당합니다.

### 5장. 이미지, 폰트와 페이지 정보 설정하기

1. **`next/image`**는 브라우저가 화면에 맞는 크기의 이미지를 선택하도록 돕고 지원되는 형식으로 최적화합니다. `width`와 `height`로 이미지 자리를 미리 확보해 표시가 밀리는 현상을 줄이고, `sizes`로 실제 표시 너비를 알려 줍니다. 기본 지연 로딩과 외부 이미지 허용 목록인 `images.remotePatterns`도 설명합니다. UMCine에서 개발자 도구 Network를 열고 `/_next/image` 요청을 보여 준 뒤, 원본과 요청 URL·Content-Type·크기를 비교하면 됩니다. 실제로 포스터 한 장의 응답 본문은 JPEG 75.3 kB에서 WebP 10.5 kB로 줄었습니다.
2. **`next/font`**는 폰트를 자체 호스팅하도록 준비합니다. 워크북의 `Geist({ subsets: ["latin"] })`는 라틴 문자 범위를 미리 불러오도록 설정하고, `geist.className`을 제목에 붙여 글꼴을 적용하는 예제입니다. 적용 여부는 Elements의 계산된 `font-family`에서 확인합니다.
3. **`metadata`**를 export하면 Next.js가 브라우저 탭 제목인 `<title>`, 검색 엔진에 내용을 전달하는 `meta description`과 링크 미리보기에 쓰이는 Open Graph 태그를 생성합니다. 공통값은 `layout.tsx`, 페이지별 값은 해당 `page.tsx`에 둡니다. UMCine의 `/search`에서 탭 제목과 `og:title`, `og:description`을 보여 주고, 워크북의 `og:image`는 공유 대표 이미지라는 점을 설명하면 됩니다.
