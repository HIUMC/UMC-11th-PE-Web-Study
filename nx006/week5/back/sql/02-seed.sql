-- Only learning dummy strings; not valid bcrypt hashes, not login credentials.
-- INSERT ... WHERE NOT EXISTS avoids changes to existing rows and AUTO_INCREMENT gaps on rerun.
-- A conflicting nickname owned by another email is deliberately an error, never reassigned.
SET time_zone = '+00:00';
START TRANSACTION;
INSERT INTO member(email,password,nickname)
SELECT 'noco@umc.com','dummy-not-a-bcrypt-hash','수현'
WHERE NOT EXISTS (SELECT 1 FROM member WHERE email='noco@umc.com');
INSERT INTO member(email,password,nickname)
SELECT 'minseo@umc.com','dummy-not-a-bcrypt-hash','민서'
WHERE NOT EXISTS (SELECT 1 FROM member WHERE email='minseo@umc.com');
INSERT INTO rating(member_id,movie_id,score,comment)
SELECT m.member_id,550,5,'최고의 영화!' FROM member m
WHERE m.email='noco@umc.com' AND NOT EXISTS (SELECT 1 FROM rating r WHERE r.member_id=m.member_id AND r.movie_id=550);
INSERT INTO rating(member_id,movie_id,score,comment)
SELECT m.member_id,155,4,'다시 봐도 명작' FROM member m
WHERE m.email='noco@umc.com' AND NOT EXISTS (SELECT 1 FROM rating r WHERE r.member_id=m.member_id AND r.movie_id=155);
INSERT INTO rating(member_id,movie_id,score,comment)
SELECT m.member_id,550,3,'호불호가 갈릴 것 같아요' FROM member m
WHERE m.email='minseo@umc.com' AND NOT EXISTS (SELECT 1 FROM rating r WHERE r.member_id=m.member_id AND r.movie_id=550);
COMMIT;
