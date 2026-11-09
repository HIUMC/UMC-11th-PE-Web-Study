# Week 6

## BE

### 주제

NestJS 기반 회원가입 및 평점 등록·수정·삭제 API 구현

### 구현 내용

- 회원가입 `POST /members`
- 이메일·닉네임·비밀번호 입력값 검증 및 bcrypt 해시 저장
- 응답에서 비밀번호를 제외하고 회원 정보만 반환
- 평점 등록 `POST /members/:memberId/ratings`
- 평점 수정 `PATCH /members/:memberId/ratings/:ratingId`
- 평점 삭제 `DELETE /members/:memberId/ratings/:ratingId`
- 평점의 별점 범위·후기 길이 검증 및 수정·삭제 시 소유자 확인
- 중복 회원·평점 검사 및 전역 예외 처리를 통한 공통 오류 응답 적용

### 학습 내용

- class-validator와 ValidationPipe를 활용한 DTO 검증
- bcrypt를 활용한 비밀번호 해시 저장
- DTO 검증, Service 검증, DB 제약 조건의 역할
- Exception Filter를 활용한 일관된 오류 응답 처리
- HTTP 상태 코드 201, 204, 400, 403, 404, 409의 의미
- Postman을 활용한 정상 요청 및 실패 상황 테스트
