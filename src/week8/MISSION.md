# 8주차 즐겨찾기와 영화 기록 필수 미션

Spring Boot와 MySQL에서 즐겨찾기 API 4개와 영화 기록 저장 API를 구현했다. 기존 JWT 인터셉터가 `Authorization` 헤더의 토큰에서 요청자의 회원 ID를 추출한다.

## 구현 과정과 핵심 코드

1. 5주차 `favorite` 스키마에 엔티티를 연결했다. `BaseTimeEntity`의 생성·수정 시각을 상속하고 `(member_id, movie_id)`에 복합 UNIQUE 제약을 적용했다. [Favorite 엔티티](../main/java/com/umc/movie/entity/Favorite.java) · [Favorite Repository](../main/java/com/umc/movie/repository/FavoriteRepository.java)
2. 등록 전에 중복을 검사하고, 목록은 로그인한 회원의 즐겨찾기만 최신 등록순으로 조회한다. 해제는 회원과 영화로 범위를 좁혀 한 번에 삭제하고, 삭제 건수가 0이면 404를 반환한다. [Favorite Service](../main/java/com/umc/movie/service/FavoriteService.java) · [Favorite Controller](../main/java/com/umc/movie/controller/FavoriteController.java)
3. 영화 기록 서비스의 `@Transactional`에 평점과 즐겨찾기 저장을 함께 참여시켰다. 두 저장을 한 트랜잭션으로 묶어 즐겨찾기 등록에 실패하면 이미 삽입한 평점도 되돌린다. [MovieRecord Service](../main/java/com/umc/movie/service/MovieRecordService.java) · [MovieRecord Controller](../main/java/com/umc/movie/controller/MovieRecordController.java) · [트랜잭션 코드 발췌 이미지](captures/08-movie-record-transaction.png)

## Postman 응답 캡처

| 요청 | 확인 결과 | 캡처 |
| --- | --- | --- |
| `POST /favorites` | 201, `COMMON201`, ID와 등록 시각 | [등록](captures/01-favorite-created.jpg) |
| `POST /favorites` 재요청 | 409, `FAVORITE409_1` | [중복](captures/02-favorite-duplicate.jpg) |
| `GET /favorites` | 200, 최신 등록순 목록 | [목록](captures/03-favorite-list.jpg) |
| `GET /favorites/550` | 200, `isFavorite: true` | [등록 상태](captures/04-favorite-status.jpg) |
| `DELETE /favorites/550` | 200, `result: null` | [해제](captures/05-favorite-deleted.jpg) |
| `GET /favorites/550` 재조회 | 200, `isFavorite: false` | [해제 후 상태](captures/07-favorite-status-after-delete.jpg) |
| `POST /movie-records` | 201, `rating`과 `favorite` 반환 | [영화 기록](captures/06-movie-record-created.jpg) |

## 실패 및 트랜잭션 검증

| 상황 | 확인 결과 |
| --- | --- |
| 토큰 없이 즐겨찾기 등록 또는 영화 기록 저장 | 401 `AUTH401_2` |
| 즐겨찾기 등록에 `movieId: 0` 전달 | 400 |
| 즐겨찾기가 없는 회원의 목록 조회 | 200, `[]` |
| 존재하지 않거나 다른 회원에게만 있는 즐겨찾기 해제 | 404 `FAVORITE404_1` |
| 두 회원이 같은 영화를 즐겨찾기 | 각각 등록 성공, 한 회원이 해제해도 다른 회원의 즐겨찾기는 유지 |
| 같은 영화 기록 다시 저장 | 409 `RATING409_1` |
| 이미 즐겨찾기한 영화의 기록에 `addToFavorites: true` 전달 | 409 `FAVORITE409_1`, MySQL에서 해당 평점 0건 확인 |
| 같은 영화의 기록에 `addToFavorites: false` 전달 | 201, 평점 생성, `favorite: null` |
| 같은 영화의 첫 등록을 8건씩 동시 호출 | 즐겨찾기와 영화 기록 각각 201 한 건, 도메인 중복 오류 일곱 건 |

임시 MySQL에서 Gradle 전체 테스트 6개와 실행 파일 빌드를 통과했다.

## 트러블슈팅

- **동시 등록 중복 응답.** 여러 요청이 사전 검사를 통과한 뒤 같은 데이터를 저장하려고 할 수 있다. MySQL의 UNIQUE 위반을 각 저장 지점에서 처리해 `FAVORITE409_1` 또는 `RATING409_1`을 반환하도록 했다. 동시 호출 중 실제 UNIQUE 위반이 발생한 경우에도 동일한 응답을 확인했다.
- **로컬 검증 환경.** 기본 샌드박스에서 Gradle 파일 잠금 소켓과 MySQL 초기화가 실패했다. 임시 경로에 프로젝트와 캐시를 복제하고 별도의 루프백 MySQL에서 스키마 검증과 API 호출을 수행했다.

## 실습 정리

트랜잭션 없이 평점을 먼저 저장하면 즐겨찾기가 실패해도 평점이 남는다. 원자성은 둘을 함께 커밋하거나 모두 롤백하는 성질이다. ACID는 원자성, 일관성, 격리성, 지속성을 뜻한다.

서버의 사전 검사는 일반적인 중복 요청에 도메인 오류를 제공하고, 데이터베이스의 UNIQUE 제약은 동시 요청에서도 저장되는 행을 하나로 제한한다. 낙관적 잠금은 수정하는 동안 다른 트랜잭션이 행을 변경했는지 버전 값으로 감지한다. 이번 실습에서는 새로운 행의 중복 삽입을 복합 UNIQUE로 막았다.
