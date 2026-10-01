USE umc_week2_my_erd;

-- 화면 요구사항:
-- 홍대 지역에서 현재 열려 있고 삭제되지 않은 미션 5개를
-- 가게 이름, 음식 카테고리, 보상 포인트와 함께 최신순으로 보여준다.
SELECT
  m.id AS mission_id,
  m.title AS mission_title,
  s.name AS store_name,
  fc.name AS category_name,
  m.reward_point
FROM mission AS m
JOIN store AS s ON m.store_id = s.id
JOIN region AS r ON s.region_id = r.id
JOIN food_category AS fc ON s.food_category_id = fc.id
WHERE r.name = '홍대'
  AND s.deleted_at IS NULL
  AND m.deleted_at IS NULL
  AND m.status = 'OPEN'
  AND (m.deadline IS NULL OR m.deadline >= CURRENT_TIMESTAMP)
ORDER BY m.created_at DESC, m.id DESC
LIMIT 5 OFFSET 0;

-- 검증: 해시가 홍대에서 완료한 미션 수와 지역 보상
SELECT
  me.nickname,
  r.name AS region_name,
  COUNT(*) AS completed_missions,
  MAX(rr.reward_point) AS region_reward_point,
  me.point AS current_point
FROM member AS me
JOIN member_mission AS mm ON mm.member_id = me.id
JOIN mission AS m ON mm.mission_id = m.id
JOIN store AS s ON m.store_id = s.id
JOIN region AS r ON s.region_id = r.id
LEFT JOIN member_region_reward AS rr
  ON rr.member_id = me.id AND rr.region_id = r.id
WHERE me.id = 1
  AND mm.status = 'COMPLETED'
  AND r.name = '홍대'
GROUP BY me.id, me.nickname, r.id, r.name, me.point;