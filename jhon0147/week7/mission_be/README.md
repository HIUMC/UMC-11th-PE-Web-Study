# UMC 7주차 백엔드

6주차 영화 평점 서버에 JWT 로그인, 내 정보 조회·수정, 평점 작성자 검증을 추가했다. Java 21 / Spring Boot 3.5.0 / JJWT 0.12.6을 사용한다.

## 실행

MySQL 없이 확인하려면 이 폴더에서 다음 명령을 실행한다.

~~~powershell
.\run-demo.ps1
~~~

서버가 시작되면 [http://localhost:8087](http://localhost:8087)을 연다. 회원가입 후 로그인하면 내 정보 조회·수정과 평점 등록·수정·삭제를 확인할 수 있다. 토큰은 페이지 메모리에만 두며 새로고침하면 다시 로그인한다. 회원 번호 입력은 공개 평점 목록 조회에만 사용한다.

이 모드는 H2 메모리 DB이므로 서버를 다시 시작하면 데이터가 초기화된다. 실행 스크립트는 JWT_SECRET이 없을 때 임시 서명키를 생성한다. 첫 실행에는 Gradle 의존성 다운로드가 필요하다.

기본 포트와 만료 시간을 바꾸는 예시:

~~~powershell
.\run-demo.ps1 -Port 8087 -TokenSeconds 60
~~~

## MySQL / IntelliJ

기존 6주차 DB가 있다면 그대로 사용한다. 이번 주차에는 테이블 구조를 바꾸지 않았다. 새 DB에서만 `sql/01_schema.sql`을 실행한다. 이후 회원가입 API로 실습 계정을 만든다.

IntelliJ 실행 구성의 Environment variables에 DB_URL, DB_USER, DB_PW, JWT_SECRET을 넣고 필요하면 JWT_ACCESS_EXPIRATION=3600을 추가한다. 실행 클래스는 `com.umc.movie.MovieApplication`이다. JWT_SECRET은 UTF-8 기준 최소 32바이트의 임의 값으로 설정한다.

`.env.example`은 설정 항목 예시이며, Spring Boot가 이 파일을 자동으로 읽지는 않는다.

## API와 Postman

- `docs/API.md`: 요청·응답, 실패 코드, 공개 경로
- `postman/UMC_week7_movie.postman_collection.json`: 필수 시나리오와 추가 오류 확인 26개 요청
- `postman/UMC_week7_expiration.postman_collection.json`: 60초 만료 선택 미션 4개 요청

기본 컬렉션을 Import하고 baseUrl을 실제 포트에 맞춘 뒤 위에서 아래로 실행한다. 매번 새 A/B 회원을 만들고 응답에서 회원 번호, 토큰, 평점 번호를 이어받는다. 테스트용 비밀번호는 Umc!1234다.

만료 컬렉션은 60초 설정으로 서버를 시작한 뒤 수동으로 실행한다. 03번에서 200을 캡처하고, 발급 후 61초가 지난 뒤 04번에서 AUTH401_4를 캡처한다. 이 컬렉션은 기다리는 단계가 있으므로 Runner로 한꺼번에 실행하지 않는다.

## 검사

~~~powershell
.\gradlew.bat clean test
~~~

테스트에는 워크북의 9단계, 회원 정보 수정, 401 사유 구분, JWT 변조·만료, 타인 평점 수정·삭제 거절, memberId 위조 시도, CORS 사전 요청 등이 포함된다.

현재 작성 환경에서는 운영 소스 33개의 Java 21 컴파일을 확인했다. Gradle의 전체 테스트와 서버 실행은 의존성 다운로드 제한 때문에 완료하지 못했다. Postman 실제 실행과 제출용 캡처도 남아 있다. 예시 응답을 실행 결과로 사용하지 않는다.

## 제출 캡처

| 파일명 | Postman 요청 | 보일 내용 |
| --- | --- | --- |
| 01-login-success.png | 기본 03 | 200, nickname, accessToken |
| 02-me-no-token-401.png | 기본 12 | Authorization 없음, AUTH401_2 |
| 03-other-rating-403.png | 기본 08 | 토큰 B, A의 평점, RATING403_1 |
| 04-rating-create-201.png | 기본 05 | memberId 없는 바디, 201, 생성된 평점 |
| 05-token-before-expiry.png | 만료 03 | 같은 토큰으로 200 |
| 06-token-after-expiry-401.png | 만료 04 | 같은 토큰으로 AUTH401_4 |
| 07-login-member-me-200.png | 기본 13 | @LoginMember 적용 후 내 정보 200 |

아직 생성한 캡처 파일은 없다. 캡처 후 노션의 해당 위치에 붙인다.
