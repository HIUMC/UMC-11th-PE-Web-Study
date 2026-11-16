SELECT
    (SELECT COUNT(*) FROM umc_movie_week5.member) AS member_count,
    (SELECT COUNT(*) FROM umc_movie_week5.rating) AS rating_count;
SHOW CREATE TABLE umc_movie_week5.member;
SHOW CREATE TABLE umc_movie_week5.rating;
SHOW CREATE TABLE umc_movie_week5.favorite;
SELECT member_id, nickname, email FROM umc_movie_week5.member ORDER BY member_id;
SELECT r.rating_id, m.nickname, r.movie_id, r.score, r.comment, r.created_at, r.updated_at
FROM umc_movie_week5.rating r
JOIN umc_movie_week5.member m ON r.member_id=m.member_id
WHERE m.email='noco@umc.com'
ORDER BY r.rating_id DESC;
