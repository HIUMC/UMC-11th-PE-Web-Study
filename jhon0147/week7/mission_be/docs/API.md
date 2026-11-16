# 7주차 API

기본 주소는 일반 실행 시 http://localhost:8080, run-demo.ps1 실행 시 http://localhost:8087이다. 아래 JSON은 명세 예시이며 실제 실행 결과가 아니다.

## 경로

| 기능 | Method | 경로 | 인증 | 성공 |
| --- | --- | --- | --- | --- |
| 회원가입 | POST | /members | 없음 | 201 |
| 로그인 | POST | /auth/login | 없음 | 200 |
| 닉네임 중복 확인 | GET | /members/nickname/{nickname} | 없음 | 200 |
| 이메일 중복 확인 | GET | /members/email/{email} | 없음 | 200 |
| 회원별 평점 목록 | GET | /members/{memberId}/ratings | 없음 | 200 |
| 내 정보 조회 | GET | /members/me | Bearer | 200 |
| 내 정보 수정 | PATCH | /members/me | Bearer | 200 |
| 평점 등록 | POST | /ratings | Bearer | 201 |
| 평점 수정 | PATCH | /ratings/{ratingId} | Bearer | 200 |
| 평점 삭제 | DELETE | /ratings/{ratingId} | Bearer | 200 |

응답은 isSuccess/code/message/result 네 필드로 통일한다. JSON 바디가 있으면 Content-Type: application/json을 사용한다. 인증이 필요한 요청은 Authorization: Bearer {accessToken}을 보낸다.

6주차의 `POST /members/{memberId}/ratings`와 `PATCH/DELETE /members/{memberId}/ratings/{ratingId}`는 제공하지 않는다. 공개 목록 조회 경로만 남긴다.

## 회원가입

~~~http
POST /members
Content-Type: application/json

{
  "email": "a@umc.com",
  "password": "Umc!1234",
  "nickname": "회원가"
}
~~~

이메일은 254자 이하의 이메일 형식, 닉네임은 공백만으로 구성되지 않은 2~12자다. 비밀번호는 영문 대문자·소문자·숫자·!@#$%^&* 중 특수문자를 모두 포함한 8자 이상이며, bcrypt 입력 제한에 맞춰 UTF-8 72바이트 이하로 받는다. DB에는 bcrypt 해시를 저장하며 응답에는 비밀번호와 해시가 없다.

## 로그인

~~~http
POST /auth/login
Content-Type: application/json

{
  "email": "a@umc.com",
  "password": "Umc!1234"
}
~~~

~~~json
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "로그인에 성공했습니다.",
  "result": {
    "nickname": "회원가",
    "accessToken": "<서버가 발급한 토큰>"
  }
}
~~~

로그인에서는 비밀번호가 비어 있는지만 입력 검사한다. 회원가입의 복잡도 규칙을 다시 검사하지 않는다. 존재하지 않는 이메일과 틀린 비밀번호는 같은 401 / AUTH401_1 / 메시지를 돌려준다.

토큰에는 sub(회원 번호), email, iat(발급 시각), exp(만료 시각)를 넣는다. HS256으로 서명하며, 비밀번호·해시는 넣지 않는다. 만료 시간은 초 단위이며 기본값은 3600초다.

## 내 정보

~~~http
GET /members/me
Authorization: Bearer <토큰>
~~~

~~~json
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "회원 정보를 조회했습니다.",
  "result": {
    "email": "a@umc.com",
    "nickname": "회원가",
    "createdAt": "2026-11-08T23:00:00"
  }
}
~~~

~~~http
PATCH /members/me
Authorization: Bearer <토큰>
Content-Type: application/json

{ "nickname": "바꾼닉네임" }
~~~

응답 구조는 내 정보 조회와 같고, 수정된 닉네임을 돌려준다. 현재 자신의 닉네임을 그대로 보내는 것은 허용한다. 다른 회원이 쓰는 닉네임이면 409 / MEMBER409_1이다. 길이·공백 검증과 DB UNIQUE 제약도 유지한다.

## 평점 등록

~~~http
POST /ratings
Authorization: Bearer <토큰 A>
Content-Type: application/json

{
  "movieId": 550,
  "score": 5,
  "comment": "다시 보고 싶은 영화"
}
~~~

~~~json
{
  "isSuccess": true,
  "code": "COMMON201",
  "message": "평점을 등록했습니다.",
  "result": {
    "ratingId": 4,
    "movieId": 550,
    "score": 5,
    "comment": "다시 보고 싶은 영화",
    "createdAt": "2026-11-08T23:00:00",
    "updatedAt": "2026-11-08T23:00:00"
  }
}
~~~

movieId는 양의 정수, score는 1~5의 정수, comment는 선택값이며 500자 이하다. 같은 회원·영화 조합은 한 번만 등록한다. 회원 번호는 DTO에 없고, 인터셉터가 검증한 토큰에서 가져온다.

## 평점 수정·삭제

~~~http
PATCH /ratings/4
Authorization: Bearer <토큰 A>
Content-Type: application/json

{ "score": 4, "comment": "두 번째 감상 후 수정" }
~~~

수정은 200 / COMMON200이며 result에 수정된 평점 전체를 담는다. score는 필수다. comment를 생략하거나 null로 보내면 후기를 지운다. 영화 번호와 작성자는 바꾸지 않는다.

~~~http
DELETE /ratings/4
Authorization: Bearer <토큰 A>
~~~

~~~json
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "평점을 삭제했습니다.",
  "result": null
}
~~~

삭제도 공통 응답을 보내므로 204 대신 200을 사용한다. 존재하는 남의 평점을 수정·삭제하면 403, 없는 평점이면 404다.

## 실패 코드

| 상태 | code | 의미 |
| --- | --- | --- |
| 400 | COMMON4001 | 입력값, JSON, 번호 형식 오류 |
| 401 | AUTH401_1 | 이메일 또는 비밀번호가 올바르지 않음 |
| 401 | AUTH401_2 | 토큰이 없거나 Bearer 인증값이 비어 있음 |
| 401 | AUTH401_3 | 변조, 서명 불일치, 잘못된 JWT 또는 필수 클레임 누락 |
| 401 | AUTH401_4 | 토큰 만료 |
| 403 | RATING403_1 | 평점 작성자가 아님 |
| 404 | MEMBER404_1 | 대상 회원 없음 |
| 404 | RATING404_1 | 대상 평점 없음 |
| 409 | MEMBER409_1 | 닉네임 중복 |
| 409 | MEMBER409_2 | 이메일 중복 |
| 409 | RATING409_1 | 같은 회원·영화의 평점 중복 |
| 409 | COMMON4091 | 그 외 DB 무결성 제약 위반 |

~~~json
{
  "isSuccess": false,
  "code": "AUTH401_2",
  "message": "로그인이 필요한 요청입니다.",
  "result": null
}
~~~

이메일 중복용 MEMBER409_2는 기존 회원가입에서 필요한 추가 코드다. 닉네임 중복 MEMBER409_1은 워크북에 맞췄다. SQL이나 내부 예외 메시지는 응답에 포함하지 않는다.

## 60초 만료 확인

JWT_ACCESS_EXPIRATION=60으로 설정한 뒤 서버를 재시작하고 새로 로그인한다. 같은 토큰으로 만료 전 200과 만료 후 401 / AUTH401_4를 확인한다.

이번 구현은 clockSkewSeconds(60)을 넣지 않았다. 워크북 예시처럼 60초 유예를 주면 발급 1분 직후에는 아직 허용될 수 있어, 60초 만료 선택 미션과 구분하기 위해 유예 없이 검증한다.

## 선택 미션: @LoginMember

전:

~~~java
@RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
~~~

후:

~~~java
@LoginMember Long memberId
~~~

AuthInterceptor는 토큰을 검증한 회원 번호를 요청 속성에 담고, LoginMemberArgumentResolver가 이를 Long 매개변수로 전달한다. WebConfig의 addArgumentResolvers에 등록했다. 컨트롤러에는 요청 속성의 문자열 키를 직접 적지 않는다.

## 참고

- [JJWT 공식 문서](https://github.com/jwtk/jjwt)
- [Spring MVC 인터셉터](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-config/interceptors.html)
- [Spring Security 비밀번호 저장](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html)
