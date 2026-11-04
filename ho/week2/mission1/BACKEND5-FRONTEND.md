# 백엔드 5주차 필수 미션: 실제 프론트 연결

## 진행 과정

1. 기존 영화 화면을 유지하고 `/my`에 내 정보 화면을 추가했다.
2. 회원 API용 ky 인스턴스를 별도로 만들고 기본 주소를 `http://localhost:8080`으로 설정했다. TMDB 인증 헤더는 회원 API에 보내지 않는다.
3. 닉네임·이메일 입력 폼에서 입력값을 URL 인코딩하여 각각의 중복 확인 API를 호출했다.
4. `available` 응답에 따라 사용 가능/중복 문구를 화면에 표시했다.
5. 회원 번호 입력 폼에서 평점 목록 API를 호출하고 영화 ID, 별점, 코멘트, 작성·수정 일시를 표시했다.
6. 요청 중 버튼 중복 실행을 막고 로딩, 오류, 빈 결과를 처리했다.

## 연결한 API

- GET `/members/nickname/{nickname}`
- GET `/members/email/{email}`
- GET `/members/{memberId}/ratings`

## 실제 확인 결과

- 브라우저 origin `http://localhost:5173`에서 백엔드 `http://localhost:8080`으로 직접 호출했다. 프록시 우회 없이 세 API 응답을 화면에 표시했다.
- `noco` 닉네임과 `user@example.com` 이메일의 응답: 사용 가능.
- 회원 1번 평점 조회: 영화 155(4점), 영화 550(5점) 두 항목 표시.
- 브라우저 Console 오류·경고 없음.
- `pnpm build`, `pnpm lint` 통과.
- 화면 캡처: `mission-captures/03-member-api-success.png`

## 제출 시 함께 준비할 자료

이 기록과 화면 캡처에 백엔드 Entity/DTO/Controller/Service 핵심 코드 및 Postman에서 API별 요청 URL과 응답 JSON이 보이는 캡처를 추가한다. 이 프론트 구현만으로 백엔드 코드·Postman 인증까지 대체되지는 않는다.

## 실행

- 백엔드를 8080 포트에서 실행하고 프론트에서 `pnpm dev` 실행.
- `http://localhost:5173/my` 또는 상단 ‘내 정보’ 메뉴로 접속.
- 백엔드 주소가 달라지면 `.env.local`에 `VITE_MEMBER_API_BASE_URL`을 설정한 후 개발 서버 재시작.
