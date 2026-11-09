USE umc_week1_ext;

INSERT INTO region (region_id, region_name) VALUES
  (1, '마포구'), (2, '성동구');

INSERT INTO store (store_id, region_id, store_name, category, address, rating) VALUES
  (1, 1, '홍대 마라탕', '중식', '서울 마포구 와우산로 1', 4.5),
  (2, 1, '홍대 김밥', '분식', '서울 마포구 홍익로 2', 4.0),
  (3, 2, '성수 브런치', '카페', '서울 성동구 성수이로 3', 4.7);

INSERT INTO mission (mission_id, store_id, title, min_order_amount, reward_point) VALUES
  (1, 1, '10,000원 이상 주문하기', 10000, 500),
  (2, 2, '12,000원 이상 주문하기', 12000, 500),
  (3, 3, '15,000원 이상 주문하기', 15000, 1000),
  (4, 1, '20,000원 이상 주문하기', 20000, 1500);

INSERT INTO member (member_id, name, nickname, email, gender, birth_date, address, total_point) VALUES
  (1, '민서', 'minseo', 'minseo@example.com', '여', '2003-03-01', '서울 마포구', 500),
  (2, '수현', 'suhyun', 'suhyun@example.com', '남', '2002-07-15', '서울 성동구', 0);

INSERT INTO member_mission (member_mission_id, member_id, mission_id, progress_status, auth_number, completed_at) VALUES
  (1, 1, 1, 'COMPLETED',   'A1B2', '2026-09-20 12:00:00'),
  (2, 1, 2, 'IN_PROGRESS', NULL,   NULL),
  (3, 1, 3, 'IN_PROGRESS', NULL,   NULL),
  (4, 2, 4, 'IN_PROGRESS', NULL,   NULL);
