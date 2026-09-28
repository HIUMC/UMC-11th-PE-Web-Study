-- Mission 4 (확장). 1주차 ERD - 홈 화면: 선택한 지역의 미션 목록
-- 요구사항: "선택한 지역의 가게 미션을 가게 이름, 음식 카테고리와 함께 최신순으로 10개 보여 주고,
--           로그인한 회원의 미션 수행 상태를 함께 표시한다."
-- 결과: 미션 제목, 가게 이름, 음식 카테고리, 내 수행 상태
-- (사전 실행: ext_schema_seed.sql)

USE umc_week2_ext;

SELECT m.id AS mission_id,
       m.title,
       s.name AS store_name,
       fc.name AS food_category_name,
       COALESCE(mm.status, 'NOT_STARTED') AS my_status
FROM mission m
JOIN store s ON m.store_id = s.id
JOIN food_category fc ON s.food_category_id = fc.id
LEFT JOIN member_mission mm ON mm.mission_id = m.id
                           AND mm.member_id = 1
WHERE s.region_id = 1
ORDER BY m.id DESC
LIMIT 10;

-- [설명]
-- 홈 화면에 나열되는 대상이 미션이므로 mission을 기준 테이블로 두고, 가게 이름과 지역 정보는 store에,
-- 음식 카테고리 이름은 food_category에 있어 mission -> store -> food_category 순으로 FK를 따라 JOIN했다.
-- 수행 상태는 회원과 미션의 N:M 매핑 테이블인 member_mission에 있는데, 아직 도전하지 않은 미션도 목록에
-- 보여야 하므로 LEFT JOIN을 쓰고 로그인 회원 조건(member_id = 1)은 ON에 두었으며, 기록이 없으면
-- COALESCE로 'NOT_STARTED'를 표시했다.
-- WHERE에서는 선택한 지역(region_id = 1, 마포구)만 남기고, 등록일 대신 AUTO_INCREMENT인 mission.id 내림차순을
-- 최신순으로 보아 LIMIT 10으로 한 화면 분량만 조회했다. (지역 이름은 화면에 필요 없어 region은 JOIN하지 않음)
--
-- [실행 결과] 4행
-- mission_id | title                  | store_name  | food_category_name | my_status
-- 4          | 리뷰 사진 남기기       | 홍대 국밥집 | 한식               | NOT_STARTED
-- 3          | 음료 2잔 이상 주문하기 | 망원 카페   | 카페               | NOT_STARTED
-- 2          | 짬뽕 곱빼기 주문하기   | 연남 짬뽕   | 중식               | IN_PROGRESS
-- 1          | 12000원 이상 식사하기  | 홍대 국밥집 | 한식               | COMPLETED
--
-- [검증]
-- 강남구 가게의 미션 5는 지역 조건으로 제외되고, 미션 3은 민지(member 2)만 완료했으므로 워니 기준으로는
-- NOT_STARTED로 표시되어, 마포구 미션 4개와 워니의 수행 상태가 요구사항과 일치한다.
