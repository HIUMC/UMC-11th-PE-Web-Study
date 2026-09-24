USE umc_week2_my_erd;

-- =====================================================
-- 확장 미션
-- 특정 회원이 현재 진행 중인 미션을 가게 이름과 함께 조회
-- =====================================================

-- 기준 테이블: 회원의 미션 수행 상태를 확인해야 하므로 member_mission을 기준으로 조회한다.
-- JOIN: 미션의 내용과 리워드 포인트를 가져오기 위해 mission을 JOIN하고,
--       해당 미션의 가게 이름을 가져오기 위해 store를 추가로 JOIN한다.
-- WHERE: member_id가 1인 회원의 미션 중 status가 '진행중'인 데이터만 조회한다.
-- 정렬 기준: 마감일(deadline)이 빠른 미션부터 조회한다.
USE umc_week2_my_erd;

SELECT
    m.content,
    m.reward_point,
    s.store_name,
    m.deadline
FROM member_mission mm
JOIN mission m
    ON mm.mission_id = m.mission_id
JOIN store s
    ON m.store_id = s.store_id
WHERE mm.member_id = 1
  AND mm.status = '진행중'
ORDER BY m.deadline ASC;