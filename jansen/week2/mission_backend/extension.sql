USE umc_week1_ext;
-- 확장. 로그인한 사용자(member_id = 1)가 진행 중인 미션을 최근 도전순으로 10개
SELECT mm.member_mission_id,
       s.store_name,
       m.title,
       m.min_order_amount,
       m.reward_point
FROM member_mission mm
JOIN mission m ON mm.mission_id = m.mission_id
JOIN store s   ON m.store_id = s.store_id
WHERE mm.member_id = 1
  AND mm.progress_status = 'IN_PROGRESS'
ORDER BY mm.member_mission_id DESC
LIMIT 10 OFFSET 0;
