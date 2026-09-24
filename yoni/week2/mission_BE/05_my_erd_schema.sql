USE umc_week2_my_erd;

-- 지역 데이터
INSERT INTO region (region_name)
VALUES
    ('마포구'),
    ('서대문구');


-- 음식 카테고리 데이터
INSERT INTO food_category (food_category_name)
VALUES
    ('한식'),
    ('분식'),
    ('카페');


-- 회원 데이터
INSERT INTO member
    (name, gender, birth_date, address, social_provider, social_id)
VALUES
    ('민지', 'FEMALE', '2002-05-10', '서울시 마포구', 'KAKAO', 'kakao_001'),
    ('현우', 'MALE', '2001-08-20', '서울시 서대문구', 'NAVER', 'naver_001');


-- 가게 데이터
INSERT INTO store
    (store_name, store_address, region_id, food_category_id)
VALUES
    ('마포국밥', '서울시 마포구 월드컵로 10', 1, 1),
    ('연희김밥', '서울시 서대문구 연희로 20', 2, 2),
    ('홍대카페', '서울시 마포구 홍익로 30', 1, 3);


-- 미션 데이터
INSERT INTO mission
    (content, reward_point, deadline, store_id)
VALUES
    ('국밥 먹고 리뷰 작성하기', 200, '2026-10-10', 1),
    ('김밥 주문하기', 100, '2026-10-15', 2),
    ('음료 주문 후 사진 인증하기', 300, '2026-10-20', 3);


-- 회원의 미션 수행 데이터
INSERT INTO member_mission
    (status, completed_at, member_id, mission_id)
VALUES
    ('진행중', NULL, 1, 1),
    ('진행중', NULL, 1, 2),
    ('완료', '2026-09-20 15:00:00', 1, 3),
    ('진행중', NULL, 2, 3);


-- 회원이 선호하는 음식 카테고리 데이터
INSERT INTO member_food_category
    (member_id, food_category_id)
VALUES
    (1, 1),
    (1, 3),
    (2, 2);