USE umc_week1;

-- 지역
INSERT INTO region (name)
VALUES
('마포구'),
('서대문구');

-- 음식 카테고리
INSERT INTO food_category (name)
VALUES
('한식'),
('일식'),
('카페');

-- 회원
INSERT INTO member (email, nickname, created_at)
VALUES
('minseo@example.com', '민서', '2026-09-01 10:00:00'),
('suhyun@example.com', '수현', '2026-09-02 10:00:00');

-- 소셜 로그인
INSERT INTO social_account (provider, provider_user_id, member_id)
VALUES
('KAKAO', 'kakao_1001', 1),
('GOOGLE', 'google_1002', 2);

-- 가게
INSERT INTO store (name, address, region_id)
VALUES
('홍대 키친', '서울 마포구 홍익로 10', 1),
('신촌 식당', '서울 서대문구 연세로 20', 2),
('연남 카페', '서울 마포구 동교로 30', 1);

-- 미션
INSERT INTO mission
    (title, description, reward_point, deadline, store_id)
VALUES
('홍대 키친 방문하기', '매장 방문 후 인증하기', 500,
 '2026-10-01 23:59:59', 1),

('신촌 식당 리뷰 작성', '식사 후 리뷰 작성하기', 700,
 '2026-10-05 23:59:59', 2),

('연남 카페 사진 인증', '음료 사진 업로드하기', 300,
 '2026-10-10 23:59:59', 3);

-- 회원별 미션 수행 내역
INSERT INTO member_mission
    (member_id, mission_id, status, completed_at)
VALUES
(1, 1, 'IN_PROGRESS', NULL),
(1, 2, 'COMPLETED', '2026-09-15 15:30:00'),
(1, 3, 'IN_PROGRESS', NULL),
(2, 1, 'COMPLETED', '2026-09-12 18:00:00');