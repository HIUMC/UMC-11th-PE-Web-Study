# 영화 평점 서비스 API 명세 (Week5 Standard Mission)

## 공통 응답 형식
성공·실패 모두 같은 형태입니다. (DELETE 204는 본문 없음)

```json
{ "isSuccess": true,  "code": "COMMON201", "message": "회원가입에 성공했습니다.", "result": { ... } }
{ "isSuccess": false, "code": "RATING409", "message": "이미 이 영화에 평점을 남기셨습니다.", "result": null }
```

## 1. 회원가입 `POST /members`

Request
```json
{ "email": "subin@umc.com", "password": "Abcd1234!", "nickname": "수빈" }
```
| 필드 | 규칙 |
|---|---|
| email | 필수, 이메일 형식 |
| password | 필수, 대/소문자·숫자·특수문자(!@#$%^&*) 포함 8자 이상 → **bcrypt 해시로 저장** |
| nickname | 필수, 2~12자 |

Response `201 Created` (**password 없음**)
```json
{ "isSuccess": true, "code": "COMMON201", "message": "회원가입에 성공했습니다.",
  "result": { "memberId": 1, "email": "subin@umc.com", "nickname": "수빈" } }
```

## 2. 평점 등록 `POST /members/{memberId}/ratings`
Request
```json
{ "movieId": 10, "score": 5, "comment": "최고의 영화" }
```
| 필드 | 규칙 |
|---|---|
| movieId | 필수, 양수 |
| score | 필수, 정수 1~5 |
| comment | 선택, 500자 이하 |

Response `201 Created`
```json
{ "isSuccess": true, "code": "COMMON201", "message": "평점 등록에 성공했습니다.", "result": 1 }
```

## 3. 평점 수정 `PATCH /members/{memberId}/ratings/{ratingId}`
Request
```json
{ "score": 3, "comment": "다시 보니 보통" }
```
Response `200 OK`
```json
{ "isSuccess": true, "code": "COMMON200", "message": "평점 수정에 성공했습니다.", "result": null }
```

## 4. 평점 삭제 `DELETE /members/{memberId}/ratings/{ratingId}`
Response `204 No Content` (본문 없음)

## 5. (보조) 조회 / 중복 확인
| Method | URL | 설명 |
|---|---|---|
| GET | `/members/{memberId}/ratings` | 회원의 평점 목록 |
| GET | `/members/email/{email}` | 이메일 사용 가능 여부 `{ "available": true }` |
| GET | `/members/nickname/{nickname}` | 닉네임 사용 가능 여부 |

## 오류 코드
| HTTP | code | 상황 |
|---|---|---|
| 400 | COMMON400 | 검증 실패 (이메일 형식, 비밀번호 규칙, **별점 범위 1~5 벗어남**, JSON 형식 오류 등) |
| 403 | RATING403 | **다른 회원의 평점 수정/삭제** |
| 404 | MEMBER404 | 존재하지 않는 회원 |
| 404 | RATING404 | **존재하지 않는 평점** |
| 409 | MEMBER4091 | **중복 이메일** |
| 409 | MEMBER4092 | **중복 닉네임** |
| 409 | RATING409 | **중복 평점** (같은 회원이 같은 영화에 두 번) |
| 409 | COMMON409 | 동시 요청으로 DB UNIQUE 제약 위반 |

## 확인 포인트
- **password가 응답에 없는가?** `MemberResponse`에 password 필드 자체가 없음 → `dto/MemberResponse.java`
- **중복 평점이 DB에 저장되지 않는가?** 서비스에서 `existsByMember_MemberIdAndMovieId` 사전 검사 + DB `(member_id, movie_id)` UNIQUE 제약으로 이중 방어 → `service/RatingService.java`, `entity/Rating.java`
- **DELETE가 204로 응답하는가?** `ResponseEntity.noContent().build()` → `controller/RatingController.java`

## 핵심 코드
- 회원가입 + bcrypt: `src/main/java/com/umc/week5/service/MemberService.java`, `config/PasswordConfig.java`
- 평점 CRUD + 403/404: `src/main/java/com/umc/week5/service/RatingService.java` (`findOwnedRating`)
- 일관된 오류 응답: `exception/ErrorCode.java`, `controller/GlobalExceptionHandler.java`

## 트러블 슈팅

### 문제: 컨트롤러가 호출하는 메서드가 서비스에 없어 빌드 실패
```
MemberController.java:27: error: cannot find symbol
    return memberService.checkNickname(nickname);
  symbol: method checkNickname(String)
```
- **원인**: 회원가입(`signUp`)을 추가하면서 `MemberService`를 새로 작성했는데, 5주차에 만든 `checkNickname`, `checkEmail` 자리에 `// ... 그대로 둡니다 ...` 주석만 남기고 실제 코드를 지워버렸다. 컨트롤러는 여전히 두 메서드를 호출하고 있어 컴파일 에러가 났다.
- **해결**: 두 메서드를 `existsByNickname` / `existsByEmail`을 이용해 다시 구현했다 (`available = !exists`).
- **배운 점**: 예제 코드를 붙여넣을 때 "생략" 주석은 실제로 코드를 지운다는 뜻이 된다. 붙여넣은 뒤 바로 `./gradlew compileJava`로 확인하는 습관이 필요하다.

### (참고) 오류 응답이 제각각이던 문제
- 처음에는 서비스에서 `IllegalArgumentException`(→ 409 `COMMON4092`)과 `ResponseStatusException`을 섞어 던져서, 중복 이메일·닉네임·평점이 모두 같은 코드로 내려가 클라이언트가 구분할 수 없었다. 또 `"score": "abc"`처럼 JSON 자체가 잘못되면 Spring 기본 에러 형식으로 응답됐다.
- `ErrorCode` enum + `GeneralException` 하나로 통일하고, `HttpMessageNotReadableException` / `MethodArgumentTypeMismatchException`도 `GlobalExceptionHandler`에서 같은 형식(`COMMON400`)으로 처리했다.
