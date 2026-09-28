USE umc_week2_my_erd;

INSERT INTO food_category (id, name) VALUES
  (1, '카페'),
  (2, '한식'),
  (3, '디저트');

INSERT INTO region (id, name) VALUES
  (1, '홍대'),
  (2, '신촌'),
  (3, '연남');

INSERT INTO member (id, nickname, profile_image_url, point) VALUES
  (1, '해시', NULL, 2000),
  (2, '민서', '/images/profiles/minseo.jpg', 200),
  (3, '수현', NULL, 150),
  (4, '영희', NULL, 0);

INSERT INTO store
  (id, name, address, description, image_url,
   food_category_id, region_id, deleted_at)
VALUES
  (1, '홍대 책방 카페', '홍대 예시 주소 1',
   '책을 읽으며 쉴 수 있는 카페', '/images/stores/book-cafe.jpg',
   1, 1, NULL),
  (2, '홍대 백반집', '홍대 예시 주소 2',
   '점심 식사를 할 수 있는 가게', NULL,
   2, 1, NULL),
  (3, '신촌 커피', '신촌 예시 주소 1',
   '커피 전문점', NULL,
   1, 2, NULL),
  (4, '연남 디저트', '연남 예시 주소 1',
   '디저트 전문점', NULL,
   3, 3, NULL),
  (5, '홍대 달빛 디저트', '홍대 예시 주소 3',
   '포장도 가능한 디저트 가게', NULL,
   3, 1, NULL),
  (6, '홍대 삭제된 가게', '홍대 예시 주소 4',
   '삭제 처리 확인용 가게', NULL,
   1, 1, CURRENT_TIMESTAMP);

INSERT INTO mission
  (id, store_id, title, description, reward_point,
   deadline, status, created_at, deleted_at)
VALUES
  (1, 1, '방문 인증', '책방 카페에 방문하기', 100,
   DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
   'OPEN', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 20 DAY), NULL),
  (2, 1, '커피 주문', '커피 한 잔 주문하기', 100,
   DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
   'OPEN', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 19 DAY), NULL),
  (3, 1, '신메뉴 후기', '신메뉴 후기 남기기', 100,
   DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
   'OPEN', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 18 DAY), NULL),
  (4, 2, '백반 주문', '백반 메뉴 주문하기', 100,
   DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
   'OPEN', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 17 DAY), NULL),
  (5, 2, '점심 방문', '점심시간에 방문하기', 100,
   DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
   'OPEN', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 16 DAY), NULL),
  (6, 2, '메뉴 후기', '식사 후기 남기기', 100,
   DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
   'OPEN', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 15 DAY), NULL),
  (7, 5, '디저트 주문', '디저트 하나 주문하기', 100,
   DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
   'OPEN', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 14 DAY), NULL),
  (8, 5, '포장 방문', '디저트를 포장 주문하기', 100,
   DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
   'OPEN', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 13 DAY), NULL),
  (9, 5, '간판 사진', '가게 간판 사진 올리기', 100,
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY),
   'CLOSED', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 12 DAY), NULL),
  (10, 5, '매장 리뷰', '매장 리뷰 작성하기', 100,
   DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
   'OPEN', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 11 DAY), NULL),
  (11, 3, '신촌 커피 방문', '신촌 가게에 방문하기', 200,
   DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
   'OPEN', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY), NULL),
  (12, 4, '연남 디저트 방문', '연남 가게에 방문하기', 150,
   NULL, 'OPEN', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 9 DAY), NULL),
  (13, 1, '삭제된 미션', '삭제 처리 확인용 미션', 100,
   DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
   'OPEN', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY),
   CURRENT_TIMESTAMP),
  (14, 6, '삭제된 가게의 미션', '가게 삭제 확인용 미션', 100,
   DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
   'OPEN', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY), NULL);

INSERT INTO social_account
  (member_id, provider, provider_user_id, email)
VALUES
  (1, 'KAKAO', 'kakao-hash', 'hash@example.com'),
  (2, 'GOOGLE', 'google-minseo', 'minseo@example.com'),
  (3, 'KAKAO', 'kakao-suhyeon', NULL),
  (4, 'GOOGLE', 'google-younghee', 'younghee@example.com');

-- 해시: 홍대 미션 1~10 완료
INSERT INTO member_mission
  (member_id, mission_id, status, started_at, completed_at)
VALUES
  (1, 1, 'COMPLETED', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY),
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
  (1, 2, 'COMPLETED', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY),
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
  (1, 3, 'COMPLETED', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY),
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
  (1, 4, 'COMPLETED', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY),
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
  (1, 5, 'COMPLETED', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY),
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
  (1, 6, 'COMPLETED', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY),
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
  (1, 7, 'COMPLETED', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY),
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
  (1, 8, 'COMPLETED', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY),
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
  (1, 9, 'COMPLETED', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY),
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
  (1, 10, 'COMPLETED', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY),
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
  (2, 11, 'COMPLETED', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY),
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
  (3, 12, 'COMPLETED', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY),
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)),
  (3, 1, 'IN_PROGRESS', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY),
   NULL),
  (4, 11, 'IN_PROGRESS', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY),
   NULL);

INSERT INTO member_region_reward
  (member_id, region_id, reward_point, rewarded_at)
VALUES
  (1, 1, 1000, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY));