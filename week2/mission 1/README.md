# UMCine

React + TypeScript + CSS로 구현한 영화 목록 페이지입니다. 제공된 데스크톱 참고 이미지의 1440px 화면을 기준으로 91px 헤더, 최대 1280px 콘텐츠, 영화 5열 × 2행을 구성했습니다.

## 실행

```sh
pnpm install
pnpm dev
```

```sh
pnpm build
pnpm lint
```

## 구조

- `src/app.tsx`: 영화 목록과 현재 페이지의 useState, ID 기준 북마크 토글
- `src/components/header.tsx`: 로고, 메뉴, 검색 및 로그인 버튼
- `src/components/movie-card.tsx`: 포스터, 제목, 개봉일, 북마크 버튼
- `src/components/movie-grid.tsx`: props로 영화와 이벤트를 전달하는 그리드
- `src/components/pagination.tsx`: 현재 페이지 및 이전·다음 이동
- `src/components/footer.tsx`: TMDB 로고와 출처 안내
- `src/data/movies.ts`: 제공된 영화 10편의 더미 데이터
- `src/types/movie.ts`: 영화 타입
- `src/app.css`: 화면 및 컴포넌트 스타일
- `src/index.css`: 공통 스타일

이미지는 모두 `public/images`와 `public/icons`에 있는 에셋을 사용합니다. 스크린샷 순서에 맞춰 이블 데드 번을 옵세션 앞에 배치했습니다. 데이터 값과 영화 ID는 유지합니다.

북마크는 `App → MovieGrid → MovieCard`로 전달한 props와 콜백을 사용합니다. 선택한 ID에 해당하는 영화만 불변 업데이트하며, 버튼 배경과 채움/윤곽 아이콘 및 `aria-pressed`가 변경됩니다. 초기 북마크는 오디세이와 토이 스토리 5입니다. 새로고침하면 초기 상태로 돌아갑니다.

현재는 영화가 10편이므로 1페이지이고 이전·다음 버튼은 비활성화됩니다. 검색, 로그인, 내 정보는 이번 영화 목록 구현 범위에 포함되지 않아 비활성화된 UI로 표시합니다.

## 검증

- `pnpm build`와 `pnpm lint` 성공.
- 서버 렌더링으로 카드 10개, 초기 북마크 2개, 모든 이미지 경로의 실제 파일 존재를 확인.
- 카드 콜백에 해당 영화 ID가 전달되고 북마크 props에 따라 선택 아이콘이 렌더링되는지 확인.
- Figma 원본 링크는 접근하지 못해 첨부된 이미지를 기준으로 구현.
- 연결 가능한 브라우저가 없어 실제 화면 캡처 비교, 클릭 및 브라우저 Console 검사는 미완료.

브라우저에서 1440 × 1024 화면을 열고 다음 사항을 확인할 수 있습니다.

1. 포스터 10장이 5열·2행으로 표시되는지 확인합니다.
2. 각 북마크를 클릭해 해당 영화의 아이콘과 배경만 바뀌는지 확인합니다.
3. 같은 북마크를 다시 클릭해 초기 상태로 돌아가는지 확인합니다.
4. Tab으로 북마크에 이동한 뒤 Enter 또는 Space로 조작합니다.
5. 개발자 도구 Console에 오류가 없는지 확인합니다.
