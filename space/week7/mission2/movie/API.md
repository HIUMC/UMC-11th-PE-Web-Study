# Movie API — 7주차

Base URL: `http://localhost:8080`

## 실행 설정

Java 21을 사용합니다. 실행 환경(IntelliJ Run Configuration의 Environment variables 등)에 다음 변수를 설정하세요.

| 환경변수 | 값 |
| --- | --- |
| `DB_PASSWORD` | 로컬 MySQL 비밀번호 |
| `JWT_SECRET` | 본인이 생성한 32바이트 이상의 비밀 문자열 |
| `JWT_ACCESS_EXPIRATION` | `3600` (초 단위, 1시간) |

MySQL의 `umc_movie` DB와 기존 테이블이 필요합니다. 기존 `ddl-auto: validate` 설정을 유지합니다.
프로젝트 루트의 `.env.properties`를 로컬 설정으로 읽습니다. `DB_PASSWORD`, `JWT_SECRET`, `JWT_ACCESS_EXPIRATION`을 `이름=값` 형식으로 지정할 수 있으며 실행 환경변수가 있으면 우선 적용됩니다. 일반 `.env` 파일은 자동으로 읽지 않습니다.
JWT 비밀키는 저장소에 커밋하지 않습니다.

```powershell
.\gradlew.bat bootRun
```

## 인증

`POST /auth/login`에 다음 JSON을 보냅니다.

```json
{"email":"a@umc.com","password":"Password1!"}
```

성공 응답은 200이며 `result`에 `nickname`, `accessToken`이 들어 있습니다.
보호된 API에는 `Authorization: Bearer {accessToken}` 헤더를 추가합니다.

## API 목록

| Method | URL | 인증 | 요청/응답 |
| --- | --- | --- | --- |
| POST | `/members` | 불필요 | email, password, nickname → 201, 회원 정보 |
| GET | `/members/email/{email}` | 불필요 | `{ "available": true }` |
| GET | `/members/nickname/{nickname}` | 불필요 | `{ "available": true }` |
| POST | `/auth/login` | 불필요 | email, password → 200, nickname/accessToken |
| GET | `/members/me` | 필요 | 200, email/nickname/createdAt |
| PATCH | `/members/me` | 필요 | nickname → 200, email/nickname/createdAt |
| GET | `/members/{memberId}/ratings` | 불필요 | 200, 평점 배열 |
| POST | `/ratings` | 필요 | movieId, score, comment → 201, 평점 객체 |
| PATCH | `/ratings/{ratingId}` | 필요 | score, comment → 200, 평점 객체 |
| DELETE | `/ratings/{ratingId}` | 필요 | 200, result: null |

평점 생성·수정·삭제의 기존 `/members/{memberId}/ratings...` 경로는 더 이상 사용하지 않습니다.
작성자는 토큰에서 가져오므로 요청 본문에도 memberId를 보내지 않습니다.
평점 객체는 ratingId, movieId, score, comment, createdAt, updatedAt으로 구성됩니다.

회원가입 비밀번호는 대문자/소문자/숫자/특수문자(`!@#$%^&*`)를 포함한 8자 이상,
닉네임은 2~12자입니다. 로그인에서는 비밀번호의 비어 있음만 검사합니다.
movieId는 양수, score는 1~5, comment는 선택이며 최대 500자입니다.

## 응답 형식

회원 중복 확인과 공개 평점 목록 조회는 기존 직접 반환 형식을 유지합니다.
로그인, 내 정보, 회원가입, 평점 변경 API는 공통 응답을 사용합니다.

```json
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "평점을 삭제했습니다.",
  "result": null
}
```

| HTTP | code | 의미 |
| --- | --- | --- |
| 200 | COMMON200 | 조회·수정·삭제·로그인 성공 |
| 201 | COMMON201 | 회원·평점 생성 성공 |
| 400 | COMMON4001 | 입력 검증 실패 |
| 401 | AUTH401_1 | 이메일 또는 비밀번호 불일치 |
| 401 | AUTH401_2 | Authorization 헤더 누락 또는 Bearer 형식 아님 |
| 401 | AUTH401_3 | 토큰 형식/서명 오류 |
| 401 | AUTH401_4 | 토큰 만료 |
| 403 | RATING403_1 | 다른 회원의 평점 변경 시도 |
| 404 | MEMBER404_1 | 회원 없음 |
| 404 | RATING404_1 | 평점 없음 |
| 409 | MEMBER409_1 | 내 정보 수정 시 닉네임 중복 |
| 409 | RATING409_1 | 같은 영화에 평점 중복 등록 |
| 409 | COMMON4091 | DB 유일성 제약 위반 |
| 409 | COMMON4092 | 기존 회원가입 이메일/닉네임 중복 |

문서 예제와 같이 JWT 검증에 60초의 시계 오차 허용값이 적용됩니다.
따라서 만료 테스트는 토큰 만료 시각 이후 이 여유 시간까지 지나야 실패합니다.

## 검증

```powershell
.\gradlew.bat clean test bootJar
```

테스트는 `src/test/resources/application.yaml`의 H2 메모리 DB와 테스트 전용 JWT 키를 사용합니다.
로컬 MySQL 데이터와 실제 JWT 비밀키를 사용하지 않습니다.
`AuthFlowTests`는 두 회원의 로그인·평점 등록·중복·본인 수정·타인 수정/삭제 거부·
미인증 요청·없는 평점·본인 삭제, 내 정보 수정 및 닉네임 중복, 잘못된 로그인,
토큰 누락/위조/만료와 CORS preflight를 검증합니다.
