# 9주차 최종 검증 기록

확인일: 2026-11-25 (한국 시간)

전체 빌드·Swagger 201/409 실습·중복 검사 제거/복원·선택 트랜잭션 제거/복원 검증을 완료했다. 최종 전체 테스트는 9개 클래스의 70개가 통과했고 실패·오류·건너뜀은 0개다. 두 서비스 소스는 실습 전 원본과 일치한다. 검증 캡처 12장의 노션 첨부도 완료했으며 GitHub 제출 절차가 남아 있다.

## 최종 전체 테스트

사용자 터미널에서 `.\gradlew.bat clean test --console=plain` 실행 후 생성된 JUnit XML을 확인했다. 최종 결과 파일의 생성 시각은 한국 시간 2026-11-25 01:58:27이다.

| 테스트 클래스 | 실행 | 실패 | 오류 | 건너뜀 |
| --- | ---: | ---: | ---: | ---: |
| AuthApiIntegrationTest | 27 | 0 | 0 | 0 |
| FavoriteApiTest | 4 | 0 | 0 | 0 |
| RatingApiTest | 2 | 0 | 0 | 0 |
| CorsDisabledAuthTest | 1 | 0 | 0 | 0 |
| FavoriteApiIntegrationTest | 27 | 0 | 0 | 0 |
| MovieRecordTransactionTest | 2 | 0 | 0 | 0 |
| FavoriteServiceTest | 2 | 0 | 0 | 0 |
| RatingServiceTest | 2 | 0 | 0 | 0 |
| SwaggerDocumentationTest | 3 | 0 | 0 | 0 |
| 합계 | 70 | 0 | 0 | 0 |

앞서 실행한 `clean build --console=plain`도 성공했다. 마지막 검증은 전체 테스트와 서비스 원본 복원 여부를 기준으로 한다.

## 실패 실험과 복원

| 실험 | 실제 결과 | 복원 후 |
| --- | --- | --- |
| FavoriteService 중복 검사 제거 | 단위·통합 테스트 각 1개 실패 | 전체 70개 통과 |
| MovieRecordService의 @Transactional 제거 | rollback 테스트 1개 실패. expected: 0L / but was: 1L | 전체 70개 통과 |

중복 검사 제거 시 단위 테스트는 기대한 ApiException 대신 NPE가 발생해 실패했다. Mock의 save 반환값을 지정하지 않은 해당 테스트에서 저장까지 진입했기 때문이다. 통합 테스트는 실제 DB UNIQUE 제약으로 HTTP 409를 유지했지만, save 호출을 검출해 NeverWantedButInvoked로 실패했다.

트랜잭션 제거 시 즐겨찾기 INSERT는 DB UNIQUE 제약에 실패했지만 먼저 저장한 평점 1개가 남았다. 테스트는 평점이 0개여야 한다는 검증에서 실패했다. @Transactional을 복원한 뒤 같은 rollback 테스트를 포함한 전체 70개가 다시 통과했다.

FavoriteService.java와 MovieRecordService.java는 각각 실습 전 백업과 SHA-256 해시가 일치한다. 실습용 주석 표시는 소스에 남아 있지 않다.

## Swagger와 정적 점검

- Swagger 브라우저에서 회원가입·로그인·Authorize·즐겨찾기 등록 201·중복 409를 사용자 확인했다.
- Swagger 문서 자동 테스트 3개가 접근 경로, 공개·보호 API 표시, 오류 예시와 내부 회원 ID 숨김을 검증했다.
- Java 소스·테스트 55개 문법 오류 0개.
- Postman 요청 17개와 JavaScript 스크립트 18개 문법 정상.
- run-demo.ps1의 PowerShell 문법 오류 0개.
- MySQL 실제 DB 실행은 이번 검증 범위에 포함하지 않았다. 통합 테스트는 H2를 사용했다.

## 남은 제출 작업

실제 캡처 12장의 노션 첨부를 완료했다. GitHub에 코드를 커밋·푸시한 뒤 실제 코드 링크를 노션에 추가한다. 후기 초안을 확인하고 최종 페이지 URL을 제출한다. 현재 검증을 위해 테스트를 더 반복할 필요는 없다.

## 캡처 첨부 확인

파일 전송 결과 12개가 모두 uploaded 상태인 것을 확인하고 노션에 배치했다. 저장된 페이지에서 고유한 notion-file-block 이미지 12개가 확인됐으며, 네 하위 토글의 제목과 사진 배치가 정상이다. 임시 업로드 공간은 제거했다.
