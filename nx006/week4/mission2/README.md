# UMC 4주차 NestJS · TypeORM 도서 API

기존 3주차 프로젝트와 Docker MySQL 데이터를 유지하면서 도서 조회·등록을 TypeORM과 DTO로 전환했습니다. 원본 워크북은 https://app.notion.com/p/3c2cd44c590482eaa2f9018b41619a2b 입니다.

## 실행

Docker Desktop을 켜고 이 폴더에서 실행합니다.

```sh
docker compose up -d --build --wait
docker compose ps
```

Postman 주소는 `http://127.0.0.1:3000`입니다. 앱은 Docker 내부 `db:3306`에 연결합니다. 기존 Compose 프로젝트명 `umc-week3-mission2`, DB명 `umc_books_week2`, 전용 named volume을 그대로 유지해 기존 데이터에 연결합니다. 앱 시작은 스키마를 수정하지 않습니다(`synchronize: false`). `docker compose down` 후 `up`에도 데이터가 유지되며, `down -v`는 DB 볼륨을 삭제하므로 데이터 보존 시 사용하지 않습니다.

```sh
docker compose logs -f app db
docker compose down
```

호스트의 `.env`는 이미지에 포함되지 않습니다. `.env.example`은 과거 2주차 DB(127.0.0.1:3307)에 직접 연결하는 로컬 실행용이며 Compose는 설정된 내부 주소를 사용합니다. npm과 `package-lock.json`이 기준입니다. 기존 `pnpm-lock.yaml`은 사용자 파일로 보존했으며 npm 빌드에서 사용하지 않습니다.

## API 계약

| Method | Path                          | 결과                                      |
| ------ | ----------------------------- | ----------------------------------------- |
| GET    | `/books`                      | 200, `bookId DESC`, 응답 DTO 배열         |
| GET    | `/books?keyword=우주`         | 200, 제목 부분 일치, 없으면 `[]`          |
| POST   | `/books`                      | 201, 저장된 도서 응답 DTO                 |
| GET    | `/books/category/:categoryId` | 200, 3주차 snake_case 배열 계약 유지      |
| POST   | `/rentals`                    | 201, 3주차 메시지와 rentalId 유지         |
| PATCH  | `/rentals/:rentalId/return`   | 200, 메시지와 affectedRows; 없는 ID는 404 |

도서 GET/POST 응답은 `bookId`, `title`, `description`, `categoryName`, `isAvailable` 다섯 필드입니다. POST 요청 예:

```json
{
  "categoryId": 1,
  "title": "클린 코드",
  "description": "애자일 소프트웨어 장인 정신"
}
```

`categoryId`는 양의 안전한 정수 또는 숫자로만 된 문자열을 받습니다. 제목은 문자열·100자 이하·공백 외 문자가 필요합니다. description은 생략 가능한 문자열이며 null은 거절합니다. 정의되지 않은 Body 필드와 형식 오류는 400, 존재하지 않는 categoryId는 404입니다. 검색어 양쪽 공백은 제거하고 공백만이면 전체 목록을 반환합니다. `%`, `_`, 따옴표는 실제 제목 문자로 검색합니다(TypeORM QueryBuilder의 바인딩된 `LOCATE`). 문자열 비교는 기존 MySQL collation을 따릅니다.

## 기능별 구조와 검증

`src/book`에 Entity·DTO·Controller·Service·Repository·Module, `src/category`에 Category Entity, `src/rental`에 기존 대여 기능을 둡니다. 연결 설정은 `src/database`, 입력 검증은 `src/common`입니다. TypeORM DataSource의 연결 풀 하나를 ORM과 대여 Raw SQL이 공유합니다. 종료 훅으로 DataSource도 닫습니다.

```sh
npm run build
npx tsc --noEmit -p tsconfig.json
npm test
npm run lint
docker compose exec -T app npm run verify:api
docker compose exec -T app npm run verify:empty
```

API 검증은 이번 실행에서 만든 행만 정리하고 기존 도서 내용이 동일한지 확인합니다. empty 검증은 별도 임시 DB를 만들어 빈 목록 응답을 확인한 뒤 해당 임시 DB만 삭제합니다. 쿼리 수 확인은 다음 명령으로 SQL 로깅을 잠시 켭니다(바인딩 값은 기록하지 않음).

```sh
DB_LOG_QUERIES=true docker compose up -d --wait
python3 scripts/inspect-get-query.py
DB_LOG_QUERIES=false docker compose up -d --wait
```

[4주차 제출 기록](docs/week4-backend-notion-record.md)과 `evidence/week4/`에서 실제 결과와 Postman 캡처 목록을 확인합니다. Git 저장소가 없어 3주차 소스는 `docs/archive/week3-raw-sql.tar.gz`에 보존하고 변경 diff를 남겼습니다. 지난 주차의 프롬프트·요구사항 Markdown은 제거했습니다.
