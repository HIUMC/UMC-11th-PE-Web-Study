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