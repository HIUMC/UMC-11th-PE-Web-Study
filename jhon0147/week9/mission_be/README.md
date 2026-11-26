# UMC 9주차 백엔드

8주차 Spring Boot 서버에 Swagger 문서와 단위·통합 테스트를 추가했다. Java 21 / Spring Boot 3.5.0 / springdoc 2.8.9 / JJWT 0.12.6을 사용한다.

## 이번 주 구현

- 기존 API 15개에 설명·성공 응답·실패 상태와 오류 코드 문서화
- 공개 API 5개와 인증 API 10개의 자물쇠 표시 구분
- 요청 DTO 입력 규칙·예시, 토큰에서 얻는 내부 회원 ID 숨김
- 즐겨찾기 서비스 단위 테스트 2개, API 통합 테스트 4개
- 평점 서비스 단위 테스트 2개, API 통합 테스트 2개
- Swagger 문서 접근·인증 표시·오류 예시 검사 3개
- 기존 회원 인증·즐겨찾기·트랜잭션 회귀 테스트 유지

선택 미션은 `MovieRecordTransactionTest`에서 즐겨찾기 저장 실패 뒤 평점도 남지 않는지 검사한다. 테스트 자체에는 `@Transactional`을 붙이지 않았다.

## 실행과 Swagger 실습

이 폴더에서 PowerShell로 실행한다.

~~~powershell
.\gradlew.bat clean test
.\run-demo.ps1
~~~

기본 주소는 `http://localhost:8088`이다. H2 메모리 DB를 사용하며 서버를 재시작하면 데이터가 초기화된다. 스크립트가 임시 JWT 서명키를 생성하므로 DB·JWT 환경변수 없이 실행할 수 있다.

1. [Swagger UI](http://localhost:8088/swagger-ui.html)를 연다.
2. `POST /members`의 예시 값으로 회원가입한다.
3. `POST /auth/login`에 같은 이메일과 비밀번호를 입력한다.
4. 응답의 `result.accessToken`을 복사해 위쪽 **Authorize**에 입력한다. `Bearer `는 자동으로 붙으므로 토큰 값만 넣는다.
5. `POST /favorites`를 `{"movieId":550}`으로 실행해 201을 확인하고, 한 번 더 실행해 `409 / FAVORITE409_1`을 확인한다.

이메일·닉네임을 이미 썼다면 새 값으로 바꾸거나 데모 서버를 다시 시작한다. OpenAPI JSON은 [문서 JSON](http://localhost:8088/v3/api-docs)에서 확인한다.

~~~powershell
.\run-demo.ps1 -Port 8088 -TokenSeconds 3600
~~~

정적 메인 페이지는 기존 로그인·평점 실습 화면이다. 이번 주 인증 화면은 Swagger를 사용한다. 캡처 위치는 `docs/CAPTURES.md`에 있다.

## MySQL / IntelliJ

실행 클래스는 `com.umc.movie.MovieApplication`이다. 데모는 실행 구성의 Active profiles를 `demo`로 지정하고 최소 32바이트의 임의 `JWT_SECRET`을 설정한다. 포트 환경변수 `PORT=8088`도 지정하면 위 안내와 같다.

MySQL을 쓰려면 demo 프로필을 해제하고 `DB_URL`, `DB_USER`, `DB_PW`, `JWT_SECRET`을 설정한다. `.env.example`은 항목 예시이며 Spring Boot가 자동으로 읽지 않는다. 새 실습 DB에서만 `sql/01_schema.sql`을 실행한다. 기존 favorite 테이블과 복합 UNIQUE 제약은 유지한다.

## Postman 보조 확인

웹 Postman과 Desktop Agent를 연결하고 `postman/UMC_week9_movie.postman_collection.json`을 Import한다. `baseUrl`을 확인한 뒤 01~17 순서대로 실행한다. 01~04는 매번 새 회원을 생성하고 A/B 토큰을 자동으로 저장한다. 실습용 비밀번호는 `Umc!1234`다.

Swagger 과제 캡처는 브라우저에서 별도로 진행한다. 16~17번은 사전 중복 거절 확인이며 저장 후 rollback 증명을 대신하지 않는다.

## 테스트

~~~powershell
.\gradlew.bat test --tests '*FavoriteServiceTest' --tests '*RatingServiceTest'
.\gradlew.bat test --tests '*FavoriteApiTest' --tests '*RatingApiTest'
.\gradlew.bat test --tests '*MovieRecordTransactionTest'
~~~

중복 검사와 트랜잭션을 일부러 제거해 실패를 확인하는 방법은 `docs/REGRESSION.md`를 따른다. 확인 뒤 원래 코드를 복원하고 전체 테스트를 다시 실행한다. 전체 HTML 보고서는 `build/reports/tests/test/index.html`에 생긴다.

2026-11-25 사용자 터미널의 전체 빌드가 성공했고 테스트 70개가 모두 통과했다. Swagger의 201·409 실습도 사용자 확인을 받았다. 중복 검사 제거 시 두 테스트 실패, 복원 후 전체 70개 통과를 확인했다. 트랜잭션 제거 시 평점이 1개 남아 rollback 테스트가 실패한 것도 확인했고, 복원 후 최종 전체 70개가 통과했다. 두 서비스 코드는 실습 전 원본과 일치하며 실제 캡처 12장의 노션 첨부도 완료했다. 검증 범위는 `docs/VALIDATION.md`에 기록한다.
