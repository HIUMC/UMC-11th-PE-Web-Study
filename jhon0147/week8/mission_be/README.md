# UMC 8주차 백엔드

7주차 JWT 서버에 즐겨찾기 API와 영화 기록 저장을 추가했다. Java 21 / Spring Boot 3.5.0 / JJWT 0.12.6을 사용한다.

## 구현

- `POST /favorites`: 내 즐겨찾기 등록
- `GET /favorites`: 내 즐겨찾기 최신순 목록
- `GET /favorites/{movieId}`: 특정 영화의 즐겨찾기 여부
- `DELETE /favorites/{movieId}`: 내 즐겨찾기 해제
- `POST /movie-records`: 평점과 선택한 즐겨찾기를 같은 트랜잭션으로 저장

회원은 7주차의 `@LoginMember`와 JWT 인터셉터로 식별한다. 요청 DTO에는 `memberId`를 받지 않는다. 같은 회원·영화의 중복은 서버 검사와 DB UNIQUE 제약으로 막는다. `addToFavorites: false`는 평점만 저장하며 기존 즐겨찾기는 유지한다.

## 실행

이 폴더에서 PowerShell로 실행한다.

~~~powershell
.\run-demo.ps1
~~~

기본 주소는 `http://localhost:8088`이다. H2 메모리 DB를 사용하므로 MySQL 설정 없이 실행할 수 있다. 서버를 다시 시작하면 실습 데이터가 초기화된다. 스크립트는 JWT_SECRET이 없을 때 임시 서명키를 생성하며, 종료 후 기존 환경변수를 복원한다. 최초 실행에는 인터넷을 통한 Gradle·의존성 다운로드가 필요하다.

~~~powershell
.\run-demo.ps1 -Port 8088 -TokenSeconds 3600
~~~

정적 메인 페이지는 기존 7주차 로그인·평점 실습 화면이다. 8주차 API 실습은 아래 Postman 컬렉션을 사용한다.

## MySQL / IntelliJ

실행 클래스는 `com.umc.movie.MovieApplication`이다. 실행 구성에 DB_URL, DB_USER, DB_PW, JWT_SECRET을 설정한다. JWT_SECRET은 UTF-8 기준 최소 32바이트의 임의 값으로 설정한다. `.env.example`은 항목 예시이며 Spring Boot가 자동으로 읽지 않는다.

기존 7주차 SQL에는 favorite 테이블과 `uk_favorite_member_movie` 제약이 이미 포함되어 있다. 해당 구조가 있으면 다시 생성하지 않는다. 새 실습 DB에서만 `sql/01_schema.sql`을 실행한다. 직접 만든 DB라면 `SHOW CREATE TABLE favorite;`로 회원·영화 복합 UNIQUE 제약까지 확인한다.

## Postman

웹 Postman과 Desktop Agent를 연결하고 다음 파일을 Import한다.

`postman/UMC_week8_movie.postman_collection.json`

1. 컬렉션의 `baseUrl`을 실제 서버 주소에 맞춘다.
2. 01부터 30까지 순서대로 실행한다.
3. 01·02에서 새 A/B 실습 회원을 생성한다. 03·04 로그인 응답의 토큰은 컬렉션 변수로 자동 저장한다.
4. 자동 검사는 Runner로 실행할 수 있다. 제출 캡처는 `docs/CAPTURES.md`의 요청을 하나씩 실행하며 남긴다.

실습용 비밀번호는 `Umc!1234`다. 실제 계정의 비밀번호나 토큰을 컬렉션에 저장해 제출하지 않는다. 이전 7주차 컬렉션 두 개도 남아 있지만, 이번 주차의 요청 번호와 캡처 안내는 **UMC 8주차** 컬렉션을 기준으로 한다.

## 검사

~~~powershell
.\gradlew.bat clean test
~~~

기존 인증 테스트에 즐겨찾기 API와 트랜잭션 테스트를 추가했다. 등록·조회·해제, 회원별 데이터 분리, 검증 오류, DB 중복 제약과 rollback을 확인하도록 작성했다.

현재 환경에서는 Gradle 8.14.3 배포본 다운로드 중 `UnknownHostException: services.gradle.org`가 발생해 **컴파일·JUnit 실행·서버 기동은 확인하지 못했다.** Java 21 문법 파싱은 48개 파일에서 오류 0개이며, Postman 요청 30개 JSON과 스크립트 31개 문법을 확인했다. 이것은 컴파일이나 실제 API 테스트 통과 결과가 아니다.

검증 범위는 `docs/VALIDATION.md`, 요청·응답 예시는 `docs/API.md`에 정리했다. 노션에 첨부할 실제 캡처와 GitHub 코드 링크는 실행·푸시 뒤 추가한다. Swagger 선택 미션은 포함하지 않았다.
