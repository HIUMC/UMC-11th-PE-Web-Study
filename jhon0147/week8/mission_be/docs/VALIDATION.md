# 검증 상태

확인일: 2026-11-15 (한국 시간)

| 검사 | 결과 |
| --- | --- |
| Java 21 AST 문법 파싱 | 소스·테스트 48개, 문법 오류 0 |
| Postman JSON 파싱 | 요청 30개 확인 |
| Postman JavaScript 문법 | 스크립트 31개 오류 없음 |
| Gradle test | 배포본 다운로드 단계 중단 |
| 컴파일·JUnit 결과 | 미확인 |
| 서버·Postman 실제 HTTP 응답 | 미확인 |
| MySQL·H2 실행 결과 | 미확인 |
| 제출용 응답·코드 캡처 | 미생성 |

Java 문법 파싱은 Java Compiler API의 parse 단계만 실행했으며 의존성 해석·타입 검사·어노테이션 처리·컴파일을 하지 않았다. Postman 스크립트 역시 문법만 확인했고 API 요청을 보내지는 않았다.

## 실행을 막은 오류

~~~text
Downloading https://services.gradle.org/distributions/gradle-8.14.3-bin.zip
java.net.UnknownHostException: services.gradle.org
~~~

현재 환경의 다운로드 연결 제한이다. 애플리케이션 테스트 통과·실패로 판단할 수 없다. 다운로드가 가능한 환경에서 아래 명령을 실행해야 한다.

~~~powershell
.\gradlew.bat clean test
.\run-demo.ps1
~~~

그다음 Postman의 8주차 컬렉션을 01부터 30까지 실행한다.

## 추가 테스트의 목적

- FavoriteApiIntegrationTest: 기본 흐름, 최신순 목록, 회원별 데이터 분리, 인증·입력 검증, true/false 저장 분기, 요청 memberId 위조 무시.
- MovieRecordTransactionTest: Service 검사 없이 DB UNIQUE 제약이 중복을 거절하는지, 평점 INSERT 뒤 즐겨찾기 UNIQUE 위반이 나도 평점이 남지 않는지.
- 기존 AuthApiIntegrationTest: 테스트 준비에서 favorite를 먼저 지워 외래 키 관계에 맞게 정리. 기존 인증 테스트는 유지.

rollback 테스트는 HTTP 요청 뒤 별도 조회로 DB 결과를 확인하도록 작성했다. 이 테스트에 @Transactional을 붙여 테스트 프레임워크가 대신 rollback하는 방식은 사용하지 않았다.

## 남은 제출 작업

실제 테스트 실행과 오류 해결, Postman 요청 확인, 캡처 첨부, GitHub 코드 푸시와 핵심 파일 링크 추가, 개인 경험에 맞춘 후기 수정, 최종 워크북 제출.
