## 공통 미션

### 미션 1: 문학 카테고리 대여 가능 도서 조회

```sql
SELECT b.title, b.description, c.name AS category_name
FROM book b
JOIN category c ON b.category_id = c.category_id
WHERE c.name = '문학'
  AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;
```

기준 테이블은 book이며, 카테고리 이름을 함께 보여줘야 하는데 이 값은 book 테이블에 없고 category 테이블에만 있어서 book.category_id = category.category_id로 JOIN했다. WHERE 조건으로 카테고리 이름이 '문학'이고 대여 가능한 책(is_available = TRUE)만 남도록 걸러냈으며, 최신 등록순으로 보여주기 위해 book_id 기준 내림차순 정렬 후 LIMIT 10으로 목록 개수를 제한했다.

**검증**: 문학 카테고리 책 두 권(달빛 도서관, 겨울의 편지) 중 대여 가능한 건 "달빛 도서관" 하나뿐이라 1행만 반환되어 요구사항과 일치함을 확인했다.


### 미션 2: 미반납 도서 조회

```sql
SELECT b.title, r.rented_at, r.due_at
FROM rental r
JOIN book b ON r.book_id = b.book_id
WHERE r.user_id = 1
  AND r.returned_at IS NULL
ORDER BY r.due_at ASC;
```

기준 테이블은 rental이다. 대여 기록이 조회의 중심이고, 화면에 필요한 책 제목은 rental 테이블에 없으므로 rental.book_id = book.book_id로 book을 JOIN했다. WHERE 조건으로 특정 사용자(user_id = 1)의 기록만 걸러냈고, 아직 반납하지 않은 책만 보여줘야 하므로 returned_at이 NULL인 행만 남겼다. 반납 예정일이 임박한 순서로 보여주기 위해 due_at 기준 오름차순으로 정렬했다.

**검증**: user_id=1(민서)의 미반납 기록은 "겨울의 편지" 하나뿐이라 1행만 반환되어 요구사항과 일치함을 확인했다.

### 미션 3: 태그 목록 + 좋아요 여부 조회

```sql
SELECT
  b.title,
  t.name AS tag_name,
  CASE WHEN bl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked
FROM book b
JOIN book_tag bt ON b.book_id = bt.book_id
JOIN tag t ON bt.tag_id = t.tag_id
LEFT JOIN book_like bl ON bl.book_id = b.book_id AND bl.user_id = 1
WHERE b.book_id = 1;
```

기준 테이블은 book이다. book과 tag는 N:M 관계라 직접 연결할 수 없으므로 중간 테이블인 book_tag를 거쳐 tag를 JOIN했다. 좋아요 여부를 확인하기 위해 book_like를 LEFT JOIN했는데, 좋아요를 누르지 않은 경우에도 태그 목록 자체는 그대로 보여야 하므로 INNER JOIN이 아닌 LEFT JOIN을 사용했다. WHERE 조건으로 특정 책(book_id = 1)만 조회하도록 좁혔다.

**검증**: book_id=1(달빛 도서관)에 태그 두 개(소설, 추천)가 붙어 있어 2행이 반환됐고, user_id=1이 이 책에 좋아요를 눌러놨으므로 is_liked가 모두 TRUE로 나와 요구사항과 일치함을 확인했다.


## 확장 미션: 1주차 ERD(미션 앱) 기반 조회

**요구사항**: "중식당 카테고리에서 진행 중인 미션을 최신순으로 5개 보여준다."

```sql
CREATE TABLE food_category (
  category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE store (
  store_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  category_id BIGINT NOT NULL,
  name VARCHAR(50) NOT NULL,
  FOREIGN KEY (category_id) REFERENCES food_category(category_id)
);

CREATE TABLE mission (
  mission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  store_id BIGINT NOT NULL,
  title VARCHAR(100) NOT NULL,
  content VARCHAR(200) NOT NULL,
  status VARCHAR(20) NOT NULL,
  FOREIGN KEY (store_id) REFERENCES store(store_id)
);

INSERT INTO food_category (name) VALUES ('중식'), ('한식'), ('디저트');

INSERT INTO store (category_id, name) VALUES
  (1, '만리향'),
  (1, '홍콩반점'),
  (2, '한옥집');

INSERT INTO mission (store_id, title, content, status) VALUES
  (1, '만리향 10000원 이상 식사', '10000원 이상의 식사 시 500P 적립', '진행중'),
  (2, '홍콩반점 리뷰 미션', '리뷰 작성 시 300P 적립', '진행중'),
  (2, '홍콩반점 방문 미션', '방문 인증 시 200P 적립', '종료'),
  (3, '한옥집 후식 미션', '후식 주문 시 100P 적립', '진행중');

SELECT m.title, m.content, s.name AS store_name
FROM mission m
JOIN store s ON m.store_id = s.store_id
JOIN food_category fc ON s.category_id = fc.category_id
WHERE fc.name = '중식'
  AND m.status = '진행중'
ORDER BY m.mission_id DESC
LIMIT 5;
```

기준 테이블은 mission이며, 가게 이름과 카테고리 이름을 함께 보여줘야 해서 mission.store_id = store.store_id, store.category_id = food_category.category_id로 두 번 JOIN했다. WHERE 조건으로 카테고리가 '중식'이고 미션 상태가 '진행중'인 것만 걸러냈고, 최신 등록순으로 보여주기 위해 mission_id 기준 내림차순 정렬 후 LIMIT 5로 목록 개수를 제한했다.

**검증**: 중식 소속 가게(만리향, 홍콩반점)의 진행중 미션 중 만리향 10000원 이상 식사, 홍콩반점 리뷰 미션 2건이 반환되어 요구사항과 일치함을 확인했다.
