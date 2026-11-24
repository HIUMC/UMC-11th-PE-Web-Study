# 9주차 실습과 필수 미션 기록

Swagger에서 영화 서버 API 15개의 설명과 JWT 필요 여부를 확인할 수 있도록 문서화했다. 즐겨찾기와 평점 테스트는 H2 메모리 DB에서 실행했고, 최종 Gradle 테스트 16개가 모두 통과했다.

## 실습 1~6

| 실습 | 진행 내용과 결과 | 증빙 |
| --- | --- | --- |
| 1. Swagger 설정 | springdoc을 추가하고 문서 화면과 OpenAPI JSON이 로그인 없이 열리는지 확인했다. | [전체 API 목록](captures/01-swagger-api-list.jpg) |
| 2. 공개 API 문서화 | 회원가입과 로그인에 설명·입력 예시를 추가했다. Swagger에서 예시로 가입해 201을 받고 로그인으로 토큰을 발급받았다. | [전체 API 목록](captures/01-swagger-api-list.jpg) |
| 3. 인증 API 문서화 | 즐겨찾기 등록에 JWT 필요 여부, 요청 예시, 상태 및 오류 코드를 표시했다. Authorize에 토큰을 넣고 등록 후 같은 요청을 다시 실행했다. | [등록 API 상세](captures/02-swagger-favorite-details.jpg) · [201 성공](captures/03-favorite-created.jpg) · [409 중복](captures/04-favorite-duplicate.jpg) · [토큰 없는 401](captures/05-favorite-without-token.jpg) |
| 4. 단위 테스트 | Mockito로 정상 즐겨찾기 저장과 중복을 저장 전에 거절하는지 검사했다. | [테스트 코드](../test/java/com/umc/movie/service/FavoriteServiceTest.java) |
| 5. 통합 테스트 | MockMvc와 H2로 등록 성공, 토큰 누락, 중복, 미등록 영화의 상태 조회, 공개 문서 경로를 검증했다. 실습 단계에서 기존 테스트를 포함한 13개가 통과했다. | [테스트 코드](../test/java/com/umc/movie/controller/FavoriteApiTest.java) · [13개 통과](captures/06-gradle-tests-passed.jpg) |
| 6. 회귀 테스트 실험 | 별도 복사본에서 사전 검사를 제거해 실패를 재현하고 원본으로 다시 테스트했다. | [단위 테스트 실패 메시지](captures/07-duplicate-precheck-removed.jpg) · [DB 중복 오류 변환도 제거했을 때의 통합 테스트 실패](captures/08-duplicate-fallback-removed.jpg) |

`rejectsDuplicateFavoriteBeforeSaving` 단위 테스트는 중복 사전 검사를 제거하자 이미 즐겨찾기한 영화에 대해서도 `favoriteRepository.save()`가 호출돼 실패했다.

사전 검사만 제거했을 때 통합 테스트는 DB의 UNIQUE 제약과 오류 변환 덕분에 `409 FAVORITE409_1`을 받았다. 오류 변환도 제거하니 HTTP 상태는 409였지만 JSON의 `code`가 `COMMON4091`로 바뀌어 통합 테스트도 실패했다.

## 필수 미션

1. 평점 등록·수정·삭제, 회원별 평점 조회, 내 정보 조회·수정, 즐겨찾기 목록·상태·해제를 문서화했다. 회원별 평점 조회는 공개 API이고, 나머지 해당 경로는 JWT가 필요하다. [Swagger 전체 목록](captures/09-mission-swagger-list.jpg) · [평점 오류 응답 상세](captures/10-mission-rating-errors.jpg)
2. 기존 평점 단위 테스트를 정리해 같은 영화 중복 등록 시 `409 RATING409_1`, 다른 회원의 평점 수정 시 `403 RATING403_1`을 별개 테스트에서 확인한다. [평점 단위 테스트](../test/java/com/umc/movie/service/RatingServiceTests.java)
3. 평점 등록 통합 테스트 2개를 추가했다. 토큰 없이 호출하면 `401 AUTH401_2`를 반환하고, 유효한 JWT를 보내면 `201 COMMON201`을 반환하며 토큰 주인의 평점이 저장된다. [평점 통합 테스트](../test/java/com/umc/movie/controller/RatingApiTest.java)
4. Gradle 테스트와 실행 파일 빌드를 수행했다. 최종 테스트 16개가 모두 통과했다. [전체 통과 화면](captures/11-mission-gradle-tests-passed.jpg)
