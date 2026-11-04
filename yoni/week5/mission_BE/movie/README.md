# Week 5

## BE

### 주제

NestJS 기반 영화 평점 API 구현 및 프론트엔드 연동

### 구현 내용

- `Member`, `Rating` 엔티티 및 관계 구현
- 닉네임 중복 확인 `GET /members/nickname/:nickname`
- 이메일 중복 확인 `GET /members/email/:email`
- 회원별 평점 조회 `GET /members/:memberId/ratings`
- DTO를 활용한 응답 형식 분리 및 존재하지 않는 회원 예외 처리
- CORS 설정 및 실제 웹 화면에서 API 3개 연동

### 학습 내용

- SOP와 CORS의 개념 및 허용 출처 설정
- Controller, Service, Entity, DTO의 역할
- TypeORM Repository를 활용한 중복 확인과 평점 조회
- Postman을 활용한 API 요청 및 응답 확인
- 프론트엔드와 백엔드 간 데이터 통신 흐름
