# UMCine Next.js

기존 React + TanStack Router 프로젝트를 Next.js App Router로 마이그레이션한 영화 앱입니다.

## 실행

```bash
pnpm dev
```

TMDB 연동 없이도 포함된 샘플 데이터로 동작합니다. 실제 TMDB 데이터를 쓰려면 `.env.example`을 참고해 `.env.local`을 만드세요. 토큰은 Server Component에서만 사용되어 브라우저에 노출되지 않습니다.

## 라우트

- `/`: 인기 영화 및 페이지네이션
- `/movies/[movieId]`: 영화 상세
- `/search`: 영화 검색
- `/login`, `/signup`: 인증 화면
- `/my`, `/my/edit`: 내 정보 및 수정

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
