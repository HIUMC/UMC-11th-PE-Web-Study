-- ==================================================
-- 확장 미션: 특정 지역의 진행 중인 미션 조회
-- 기준 ERD: 1주차 리워드 서비스 ERD
-- ==================================================

SELECT
  m.content,
  m.required_amount,
  m.reward_point,
  s.name AS store_name,
  r.name AS region_name
FROM mission AS m
JOIN store AS s
  ON m.store_id = s.id
JOIN region AS r
  ON s.region_id = r.id
WHERE r.name = '안양동'
  AND m.started_at <= NOW()
  AND m.ended_at >= NOW()
  AND m.deleted_at IS NULL
  AND s.deleted_at IS NULL
ORDER BY
  m.reward_point DESC,
  m.id DESC
LIMIT 10;