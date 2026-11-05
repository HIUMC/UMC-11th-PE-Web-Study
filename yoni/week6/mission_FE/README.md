# Week 6

## FE

### 주제

TanStack Query를 활용한 서버 상태 및 캐시 관리

### 구현 내용

- 영화 목록, 검색, 상세 요청을 useQuery로 전환
- 페이지 번호, 검색어, 영화 ID로 query key 구분
- 로딩, 오류, 빈 결과 및 성공 상태 처리
- 페이지당 영화 8편 표시 및 페이지네이션 연결
- Query 개발자 도구와 Network 패널로 캐시 재사용 확인

### 학습 내용

- 클라이언트 상태와 서버 상태의 차이
- query key, queryFn, enabled의 역할
- staleTime과 gcTime의 차이 및 캐시 재사용 방식
