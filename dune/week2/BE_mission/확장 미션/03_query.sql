SELECT
    mem.nickname,
    m.title,
    m.reward_point,
    s.name AS store_name,
    m.deadline
FROM member_mission mm
JOIN member mem
    ON mm.member_id = mem.member_id
JOIN mission m
    ON mm.mission_id = m.mission_id
JOIN store s
    ON m.store_id = s.store_id
WHERE mm.member_id = 1
  AND mm.status = 'IN_PROGRESS'
ORDER BY m.deadline ASC;