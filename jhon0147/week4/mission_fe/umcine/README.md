# UMCine 3주차 프론트엔드

TanStack Router의 파일 기반 라우팅과 Tailwind CSS v4를 적용한 영화 목록,
검색, 상세 화면입니다.

## 실행

```bash
pnpm install
pnpm dev
```

## 확인

```bash
pnpm lint
pnpm build
```

## 주요 URL

- `/`: 영화 목록
- `/search`: 검색어가 없는 검색 화면
- `/search?query=스파이더맨`: URL 검색어와 일치하는 영화 결과
- `/movies/1`: 영화 상세
- `/movies/999`: 존재하지 않는 영화 안내

구현 및 검증 기록은 [WEEK3_MISSION.md](./WEEK3_MISSION.md)에 정리했습니다.
