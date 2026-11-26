# Week 9 · Next.js App Router

원본의 location 기반 화면 분기를 Next.js 파일 기반 라우팅으로 전환했습니다. 원본에는 TanStack Router가 없었으며 TanStack Query는 데이터 캐시 용도로 유지합니다.

실행: npm install → npm run dev (http://localhost:3000)
검증: npm run typecheck / npm run build
배포 서버: npm start

.env.example을 참고하여 .env.local의 NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_TMDB_API_BASE_URL, NEXT_PUBLIC_TMDB_ACCESS_TOKEN을 설정하세요. NEXT_PUBLIC 변수는 브라우저에 공개되므로 서버 비밀키를 넣지 마세요. 환경 변수 수정 후 재시작합니다.

백엔드는 http://localhost:3000 Origin을 허용해야 합니다. 기존 5173 포트가 필요하면 npm run dev -- --port 5173 으로 실행하세요.

경로: /, /search?query=검색어, /movies/[id], /login, /signup, /mypage, /mypage/edit. 잘못된 경로와 영화 ID는 404로 처리합니다.

src/app의 layout과 page는 Server Component이며, 상호작용 화면과 Providers는 Client Component입니다. Link, useRouter, usePathname, useSearchParams로 탐색하며 검색 파라미터 화면은 Suspense로 감쌉니다.

QueryClient는 Provider 인스턴스별로 생성합니다. sessionStorage 인증과 localStorage 북마크는 effect에서 복원하고 인증 레이아웃은 복원을 기다립니다. 인증 화면 가드는 사용자 안내이며 실제 권한 검증은 백엔드가 수행합니다. 401 시 토큰과 캐시를 비우고 로그인으로 이동합니다.

회원·즐겨찾기·평점 기능은 기존 백엔드와 TMDB 연결이 필요합니다. 프로필 이미지는 브라우저에 저장됩니다.

공식 가이드: https://nextjs.org/docs/app/guides/migrating/from-vite
