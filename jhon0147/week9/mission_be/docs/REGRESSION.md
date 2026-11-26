# 코드를 일부러 제거해 테스트 확인하기

중복 검사 제거 시 단위·통합 테스트 각 1개 실패, 트랜잭션 제거 시 평점이 0개 대신 1개 남아 rollback 테스트 1개 실패를 확인했다. 두 코드를 모두 복원한 뒤 최종 전체 70개가 통과했다. 현재 제출 소스는 정상 상태다. 아래 절차는 실습을 재현할 때의 안내다.

## 1. 원래 코드에서 먼저 통과 확인

~~~powershell
.\gradlew.bat clean test
~~~

전체 보고서는 `build/reports/tests/test/index.html`에 생긴다.

## 2. 즐겨찾기 중복 검사 제거

`src/main/java/com/umc/movie/service/FavoriteService.java`에서 아래 if 블록만 잠시 주석 처리한다. DB UNIQUE 제약은 유지한다.

~~~java
if (favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
    throw new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1",
            "이미 이 영화를 즐겨찾기하셨습니다.");
}
~~~

~~~powershell
.\gradlew.bat test --tests '*FavoriteServiceTest.createFavoriteWhenDuplicated' --tests '*FavoriteApiTest.createFavoriteWhenDuplicated'
~~~

단위 테스트는 중복 예외가 발생하지 않아 실패해야 한다. 통합 테스트는 DB UNIQUE 제약이 여전히 409를 만들 수 있으므로 상태 코드만 검사해서는 삭제한 검사를 발견하지 못한다. `FavoriteApiTest`는 실제 Repository를 Spy로 관찰하고 `save()`가 호출되지 않았는지도 확인한다. 사전 검사를 없애면 저장 시도가 검출되어 실패해야 한다.

실패 메시지를 캡처한 뒤 if 블록을 복원한다.

## 3. 선택 미션: 트랜잭션 제거

`MovieRecordService.create` 바로 위의 `@Transactional`만 잠시 주석 처리한다.

~~~powershell
.\gradlew.bat test --tests '*MovieRecordTransactionTest.favoriteConstraintFailureRollsBackTheEarlierRatingInsert'
~~~

일반 중복 요청은 서비스 사전 검사에서 막혀 평점 저장까지 도달하지 않는다. 이 경우 트랜잭션을 제거해도 평점이 남지 않아 rollback 증명이 되지 않는다.

이 테스트는 실제 DB에 기존 즐겨찾기를 저장한 뒤, Spy로 중복 조회 결과 하나만 false로 바꾼다. 사전 확인 직후 다른 요청이 먼저 저장한 상황을 재현하기 위한 설정이다. 이후 평점 INSERT가 실행되고 즐겨찾기 INSERT가 실제 DB UNIQUE 제약에 실패한다.

테스트 메서드에는 `@Transactional`이 없다. HTTP 요청이 끝난 뒤 평점 개수가 요청 전과 같은지, 해당 영화 평점이 없는지, 기존 즐겨찾기가 유지되는지 확인한다. 서비스 트랜잭션이 없으면 Repository의 평점 저장이 먼저 확정되어 평점 개수 검증이 실패해야 한다.

실패 메시지를 캡처한 뒤 `@Transactional`을 복원한다.

## 4. 복원 뒤 최종 확인

~~~powershell
.\gradlew.bat clean test
~~~

전체 통과 화면을 다시 남긴다. 즐겨찾기 중복 if 검사와 `MovieRecordService.create`의 `@Transactional`도 확인한다.
