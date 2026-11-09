-- 4. 지역별 활성 미션 목록과 나의 도전 여부

/*
요구사항: 특정 지역(강남구)의 영업 중인 가게에서 현재 진행하는 활성 미션들을 보상 포인트가 높은 순으로 10개 보여주며, 현재 로그인한 사용자가 해당 미션에 이미 도전 중인지 여부를 함께 확인한다.

결과: 가게 이름, 음식 카테고리, 보상 포인트, 미션 마감 기한, 나의 도전 여부

테이블: mission, store, region, food_category, member_mission

관계: mission → store → region & food_category / mission → member_mission

조건: 지역 이름이 '강남구', 미션 상태 'ACTIVE', 가게 상태 'OPEN', 현재 로그인한 사용자 ID

정렬,범위: reward 내림차순, 10개
*/

SELECT 
    s.name AS store_name,
    fc.name AS category_name,
    m.reward,
    m.deadline,
    CASE WHEN mm.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_challenging
FROM mission m
JOIN store s ON m.store_id = s.id
JOIN region r ON s.region_id = r.id
JOIN food_category fc ON s.category_id = fc.id
LEFT JOIN member_mission mm ON m.id = mm.mission_id AND mm.member_id = 1 /* 로그인한 사용자 ID */
WHERE r.name = '강남구'
  AND m.status = 'ACTIVE'
  AND s.status = 'OPEN'
ORDER BY m.reward DESC, m.created_at DESC
LIMIT 10;

/*
기준 테이블은 미션 정보를 담고 있는 `mission`이며, 가게명·카테고리·지역 조건 필터링을 위해 `store`, `region`, `food_category` 테이블을 차례로 INNER JOIN했습니다.
특정 사용자(`member_id = 1`)가 이 미션에 이미 참여하고 있는지 확인하기 위해 `member_mission`을 LEFT JOIN하고, 매칭되는 데이터 존재 여부로 `is_challenging` 플래그를 생성했습니다.
'강남구'에 위치한 정상 영업 가게의 활성화된 미션만 WHERE 조건으로 거른 뒤, 가장 보상 포인트(`reward`)가 높은 미션부터 10개만 보여주도록 내림차순(DESC) 정렬 및 제한(LIMIT)했습니다.
*/