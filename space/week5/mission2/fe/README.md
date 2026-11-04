# UMC Cinema 프론트엔드

현재 구현된 4개 API를 모두 연결한 웹 화면입니다. HTML, CSS, JavaScript와 Node.js 내장 정적 서버만 사용하며, 패키지 설치가 필요하지 않습니다.

## 실행

Node.js 18 이상이 필요합니다. 기존 Spring Boot 서버와 MySQL이 실행된 상태에서:

```powershell
cd fe
npm run dev
```

브라우저에서 **http://localhost:5173** 에 접속합니다. `전체 호출`로 4개 API를 동시에 호출하거나 각 입력란의 버튼으로 개별 호출할 수 있습니다. 회원 번호는 DB에 존재하는 번호를 입력하세요. 기본값은 `1`입니다. 새 API를 사용하려면 변경된 코드로 백엔드를 다시 실행하세요.

| 기능 | 메서드 | 경로 |
| --- | --- | --- |
| 닉네임 중복 확인 | GET | `/members/nickname/{nickname}` |
| 이메일 중복 확인 | GET | `/members/email/{email}` |
| 회원별 별점 조회 | GET | `/members/{memberId}/ratings` |
| 닉네임·이메일 일치 확인 | POST | `/members/check` |

## 회원 정보 일치 확인

`POST http://localhost:8080/members/check`에 `Content-Type: application/json`으로 전송합니다.

```json
{"nickname":"cinema","email":"cinema@example.com"}
```

두 값이 **같은 회원**에 속하면 HTTP 200과 `{"matched":true}`, 일치하는 회원이 없으면 HTTP 200과 `{"matched":false}`를 반환합니다. 각 값이 서로 다른 회원에게 존재하는 경우에도 `false`입니다. 빈 값, 누락, 잘못된 이메일 형식, 길이 초과(닉네임 50자, 이메일 254자)는 HTTP 400입니다. 이 API는 정보의 일치 여부만 확인하며 로그인 세션이나 토큰을 발급하지 않습니다.

`MemberController → MemberService → MemberRepository.existsByNicknameAndEmail` 순서로 조회합니다. 입력값이 공개된 예시이므로 실제 DB에 없는 조합은 `false`가 정상 결과입니다.

## CORS

기존 `movie/src/main/java/com/umc/movie/config/WebConfig.java`에 `http://localhost:5173` 및 POST 허용 설정이 이미 있어 그대로 사용합니다. 최초 프론트엔드 구현에서는 백엔드를 변경하지 않았고, 이후 요청에 따라 회원 정보 일치 확인 API를 추가했습니다.

브라우저의 `fetch`가 `http://localhost:8080`으로 직접 요청합니다. 프록시, 모의 응답, `no-cors` 모드를 사용하지 않습니다. 정적 서버는 CORS 허용 출처에 맞춰 5173 포트로 고정되어 있습니다. `127.0.0.1:5173`, 다른 포트, `file://`로 열면 기존 CORS 설정과 출처가 달라집니다.

## 화면 및 캡처

- 실제 HTTP 상태, 소요 시간, 요청 URL, JSON 응답, 응답 수신 시각을 각 카드에 표시합니다.
- HTTP 200과 `available: false`는 정상적인 중복 확인 결과입니다.
- 별점이 없는 회원의 빈 배열과 존재하지 않는 회원의 HTTP 404를 구분합니다.
- 입력값을 변경하면 이전 성공 표시와 결과를 초기화합니다.
- `전체 호출` 후 상단에 `4 / 4`, 각 카드에 `HTTP 200 OK`가 표시되는 화면을 캡처하면 됩니다. `matched: false`도 정상 응답입니다.
- `screenshots/`에 실제 브라우저에서 검증한 화면을 저장합니다.

문법 검사: `npm run check`

## 기존 3개 API의 실제 검증 결과

2026-10-30, 브라우저의 `http://localhost:5173` 화면에서 실행 중인 백엔드로 직접 호출했습니다.

| 입력 | 결과 |
| --- | --- |
| 닉네임 `umc_cinema` | HTTP 200, `{"available":true}` |
| 이메일 `cinema@example.com` | HTTP 200, `{"available":true}` |
| 회원 번호 `1` | HTTP 200, 별점 2건 (영화 155: 4점, 영화 550: 5점) |
| 회원 번호 `999999999` | HTTP 404, 오류 메시지 표시 및 이전 목록 초기화 |

- [데스크톱 전체 성공 캡처](screenshots/desktop-all-api-success.jpg)
- [기본 브라우저 전체 성공 캡처](screenshots/all-api-success.jpg)
- [모바일 전체 성공 캡처](screenshots/mobile-all-api-success.jpg)

캡처는 실제 응답을 받은 화면이며, 재실행 시 DB 상태에 따라 결과가 달라질 수 있습니다. 데스크톱 1440px 및 모바일 390px에서 가로 넘침 없이 표시되는 것을 확인했습니다.

위 캡처는 회원 정보 일치 확인 API 추가 **이전** 화면입니다. 신규 API는 실제 Controller·Service와 저장소 mock을 사용한 MockMvc 테스트 9건(일치, 서로 다른 회원의 값, 유효하지 않은 입력)을 통과했습니다. 신규 API의 실제 DB 연동 및 브라우저 성공 캡처는 백엔드를 실행한 뒤 별도로 확인해야 합니다.

```powershell
cd ../movie
.\gradlew.bat test --tests com.umc.movie.controller.MemberControllerTest
```
