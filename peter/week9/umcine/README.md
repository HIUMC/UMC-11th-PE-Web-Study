# UMCine

9주차 Next.js App Router 프로젝트입니다. 루트의 `.env.local`에 기존 UMCine에서 사용하던 값을 아래 변수 이름으로 설정합니다.

- `NEXT_PUBLIC_TMDB_API_BASE_URL`
- `NEXT_PUBLIC_TMDB_ACCESS_TOKEN`
- `NEXT_PUBLIC_API_BASE_URL`

```sh
pnpm install
pnpm dev
```

프론트엔드는 백엔드에서 허용하는 http://localhost:5173 에서 실행합니다.

프로덕션 빌드는 `pnpm build`, 빌드 결과 실행은 `pnpm start`입니다.
