/* 특정 사용자의 진행 중인 미션의 미션명, 미션 금액, 리워드와 해당 미션 가게의 이름과 주소를 조회하는 쿼리 */

SELECT
    m.title AS mission_title,
    m.mission_amount,
    m.reward,
    s.name AS store_name,
    s.address AS store_address
FROM member_mission mm
JOIN mission m
    ON mm.mission_id = m.mission_id
JOIN store s
    ON m.store_id = s.store_id
WHERE mm.member_id = 1
    AND mm.completed_at IS NULL
ORDER BY mm.started_at ASC;

/* 진행 중인 수행 내역 단위로 조회하므로 member_mission 테이블을 기준으로 삼았습니다. member_mission에서 mission을 거쳐 store에 닿도록 JOIN 하였습니다.
    특정 사용자에 대한 조회이므로 WHERE mm.member_id = 1, 그리고 아직 진행 중인 미션이어야 하므로 mm.completed_at IS NULL을 조건으로 사용하였습니다.
    도전 일자에 대해 오름차순으로 정렬하였습니다.
*/