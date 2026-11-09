INSERT INTO region (name) VALUES ('구리시'), ('마포구');

INSERT INTO food_category (name) VALUES ('한식'), ('중식');

INSERT INTO member (name, phone_number, gender, birth_date, address, created_at) VALUES
  ('민서', '01011112222', 'FEMALE', '2001-03-15', '구리시', '2026-01-10 10:00:00'),
  ('수현', '01033334444', 'MALE', '2000-07-22', '마포구', '2026-02-01 10:00:00');

INSERT INTO store (region_id, food_category_id, name, address, phone_number) VALUES
  (1, 1, '구리김밥천국', '구리시 인창동', '0311112222'),
  (2, 2, '홍대반점', '마포구 서교동', '0233334444');

INSERT INTO mission (store_id, title, description, minimum_amount, reward_point, deadline) VALUES
  (1, '김밥 3줄 먹기', '한 번에 3줄 주문', 9000, 500, '2026-09-25 23:59:59'),
  (1, '리뷰 남기기', '사진 포함 리뷰', 5000, 300, '2026-09-22 23:59:59'),
  (2, '짜장면 도전', '곱빼기 완식', 8000, 1000, '2026-10-01 23:59:59');

INSERT INTO member_mission (member_id, mission_id, status, started_at, completed_at) VALUES
  (1, 1, '진행중', '2026-09-15 12:00:00', NULL),
  (1, 2, '진행중', '2026-09-16 14:00:00', NULL),
  (1, 3, '완료',   '2026-09-10 11:00:00', '2026-09-12 19:00:00'),
  (2, 1, '진행중', '2026-09-18 09:00:00', NULL);