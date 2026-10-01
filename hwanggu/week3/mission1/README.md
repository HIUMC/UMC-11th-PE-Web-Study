# UMCine (3주차 미션1)

2주차 영화 목록에 TanStack Router(파일 기반)를 붙여 목록/검색/상세를 URL로 나눈 미션이에요. 스타일은 전부 Tailwind CSS로 옮겼어요.

## 실행
- pnpm install
- pnpm dev   (http://localhost:5173)
- pnpm build (라우트 생성 + 빌드 + 타입 검사)

routeTree.gen.ts는 실행/빌드 시 자동 생성돼요.

## 라우팅
- / 목록, /search?query=... 검색, /movies/$movieId 상세
- 검색어는 search param(URL)에 두어 새로고침/뒤로가기에도 유지
- 상세는 path param(movieId)으로 조회, 없으면 "영화를 찾을 수 없어요."

## 이미지
포스터/배경은 public/images/movies/, 아이콘은 public/icons/ 에 넣어요.
