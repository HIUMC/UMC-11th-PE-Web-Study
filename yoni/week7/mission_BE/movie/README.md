# Week 7

## BE

### 주제

NestJS 기반 JWT 로그인 및 인증·인가 구현

### 구현 내용

- 로그인 `POST /auth/login`
- bcrypt로 비밀번호를 검증하고 JWT Access Token 발급
- 내 정보 조회 `GET /members/me`
- 내 정보 수정 `PATCH /members/me`
- AuthGuard를 활용한 Authorization 헤더의 토큰 검증
- 평점 등록 `POST /ratings`
- 평점 수정 `PATCH /ratings/:ratingId`
- 평점 삭제 `DELETE /ratings/:ratingId`
- 평점 요청 경로에서 memberId를 제거하고 검증된 토큰에서 회원 ID 추출
- 평점 수정·삭제 시 작성자와 요청자를 비교하는 소유권 검증
- 평점 삭제 응답을 200 OK와 result: null로 변경

### 학습 내용

- 인증(Authentication)과 인가(Authorization)의 차이
- bcrypt를 활용한 입력 비밀번호와 저장된 해시 비교
- JWT의 Header, Payload, Signature 구조와 Claim
- Bearer 인증과 Authorization 헤더를 통한 토큰 전달
- Guard를 활용한 컨트롤러 실행 전 인증 처리
- TypeScript 요청 타입 확장을 통한 memberId 속성 정의
- HTTP 상태 코드 401과 403의 차이
- Postman과 두 회원 계정을 활용한 인증·소유권 검증 테스트
