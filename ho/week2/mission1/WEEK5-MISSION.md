# 5주차 실습 및 필수 미션 기록

## 구현

- `src/api/movies/models.ts`: 목록·검색·상세 응답 타입과 nullable 이미지/상영 시간 정의.
- `src/api/movies/get-movies-with-fetch.ts`: 순수 fetch로 인기 영화 요청, Authorization 헤더 및 `response.ok` 검사.
- `src/api/tmdb-client.ts`: 환경 변수 기반 ky 공통 인스턴스.
- `get-movies.ts`, `search-movies.ts`, `get-movie-detail.ts`: API별 요청 함수 분리.
- 목록: 인기 영화 API 연결, 로딩 → 오류 → 빈 결과 → 성공 분기.
- 검색: URL의 query로 요청, 빈 검색어 요청 생략, Promise chain과 Effect cleanup으로 이전 응답 무시. 실제 total_results 표시.
- 상세: 양의 정수 ID만 요청, 잘못된 ID·404·일반 요청 실패 구분. 장르 이름과 상영 시간 표시.
- 이미지: 경로가 있으면 TMDB URL 사용, 없으면 같은 크기의 회색 영역에 ‘이미지 없음’ 표시.
- 북마크는 기존 Zustand store에서 TMDB 영화 ID로 관리.
- 기존 푸터의 TMDB 로고 및 출처 문구 유지.

## 확인 결과

- `pnpm build`, `pnpm lint` 통과.
- 브라우저에서 실제 인기 영화 목록과 ‘인셉션’ 검색 결과(3편), 상세 페이지(27205) 표시 확인.
- 상세 URL 새로고침 후 원제·장르·상영 시간(2시간 28분) 표시 확인.
- `/search`: 검색어 안내 확인.
- 검색 결과가 없는 query URL 직접 접근 및 새로고침: 빈 결과 안내 확인.
- `/movies/abc`: ‘올바르지 않은 영화 번호예요.’ 확인.
- `/movies/999999999`: ‘영화를 찾을 수 없어요.’ 확인.
- 정상 목록 및 검색에서 수집된 Console 오류·경고 없음.
- TMDB 출처 표기 표시 확인.

## 순수 fetch 실습 재현

1. `.env.local`에 VITE_TMDB_API_BASE_URL과 VITE_TMDB_ACCESS_TOKEN을 설정하고 `pnpm dev` 실행.
2. 개발 모드에서 `/?example=fetch` 접속.
3. Network에서 인기 영화 요청 및 응답 확인. 이 URL에서는 ky 화면 요청과 별도로 순수 fetch 예제가 한 번 실행되고, Console에 results가 출력됨.
4. 일반 URL에서는 fetch 예제가 자동 실행되지 않음.

일반 네트워크 실패와 이미지·상영 시간이 null인 응답의 UI 분기는 구현했으며, 해당 응답을 강제로 만드는 브라우저 검증은 수행하지 않음.
