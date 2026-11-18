# 8주차 캡처 안내

아직 실제 캡처를 첨부하지 않았다. 아래 파일명 위치에 실행 화면을 넣는다. **Postman 요청 번호와 캡처 파일 번호는 다르다.** 예를 들어 요청 07을 실행한 화면이 캡처 01이다.

| 캡처 파일명 | 실행할 항목 | 캡처에 보일 내용 | 붙일 위치 |
| --- | --- | --- | --- |
| 01-favorite-create-201.png | 8주차 컬렉션 07 | POST /favorites, movieId, 201, favoriteId·createdAt | 실습 인증 · 즐겨찾기 등록 |
| 02-favorite-duplicate-409.png | 컬렉션 08 | 같은 movieId 재요청, 409, FAVORITE409_1 | 실습 인증 · 중복 등록 |
| 03-favorite-list-200.png | 컬렉션 10 | GET /favorites, 내 목록 [238, 550] | 실습 인증 · 목록 조회 |
| 04-favorite-status-true-200.png | 컬렉션 11 | GET /favorites/550, isFavorite: true | 실습 인증 · 여부 조회 |
| 05-favorite-delete-200.png | 컬렉션 15 | DELETE /favorites/550, 200, result: null | 실습 인증 · 해제 |
| 06-movie-record-create-201.png | 컬렉션 22 | POST /movie-records, rating과 favorite 함께 반환 | 실습 인증 · 영화 기록 |
| 07-transaction-code.png | MovieRecordService.create 코드 | @Transactional과 두 Repository의 save 호출 | 실습 인증 · 트랜잭션 코드 |
| 08-favorite-status-false-200.png (보완) | 컬렉션 06 | 등록 전 isFavorite: false | 실습 인증 · 여부 조회 아래 |

**두 저장을 묶은 이유:** 평점과 즐겨찾기를 함께 요청한 경우 어느 하나라도 실패하면 먼저 저장된 결과도 취소되어 일부 데이터만 남는 일을 막기 위해서다.

컬렉션을 Runner로 실행하면 응답 검사는 가능하지만, 제출용 화면은 위 항목을 하나씩 실행하면서 캡처한다. 06의 false 화면은 07에서 등록하기 전에 캡처한다. 상태 코드·URL·본문이 함께 보이게 하고 실제 비밀번호와 토큰 값은 공유 화면에서 가린다.

- [ ] 스터디 인증샷 첨부
- [ ] 필수 캡처 01~07 첨부
- [ ] 등록 전 false 화면 확인
- [ ] GitHub에 올린 8주차 핵심 코드 링크 추가
