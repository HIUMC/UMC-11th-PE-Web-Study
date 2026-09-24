-- 1. 지역 및 카테고리 데이터 추가
INSERT INTO region (name) VALUES ('강남구'), ('안양시 만안구');
INSERT INTO food_category (name) VALUES ('한식'), ('일식');

-- 2. 테스트용 회원 데이터 추가
INSERT INTO member (name, social_type, social_id, status) 
VALUES ('김유저', 'KAKAO', 'kakao_12345', 'ACTIVE');

-- 3. 가게 데이터 추가 
INSERT INTO store (region_id, category_id, name, address, score, status) 
VALUES (1, 1, '강남 솥뚜껑 삼겹살', '서울시 강남구 테헤란로 123', 4.8, 'OPEN'),
       (1, 2, '강남스시', '서울시 강남구 강남대로 456', 4.5, 'OPEN');

-- 4. 미션 데이터 추가 
INSERT INTO mission (store_id, reward, deadline, mission_spec, status) 
VALUES (1, 1000, '2026-10-31', '5만원 이상 결제 시 1000P 적립', 'ACTIVE'),
       (1, 500, '2026-11-15', '영수증 리뷰 작성 시 500P 적립', 'ACTIVE');

-- 5. 나의 미션 진행 내역 추가 
INSERT INTO member_mission (member_id, mission_id, status) 
VALUES (1, 1, 'CHALLENGING');