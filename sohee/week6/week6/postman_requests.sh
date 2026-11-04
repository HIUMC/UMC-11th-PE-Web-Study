#!/bin/sh
# 서버 실행 후: sh postman_requests.sh  (각 요청의 상태코드와 응답을 출력)
B=http://localhost:8080
req() { echo "\n### $1 $2"; shift; curl -s -w "\n-> HTTP %{http_code}\n" -H 'Content-Type: application/json' -X "$@"; }

req "회원가입 A (201, password 없음)" POST $B/members -d '{"email":"a@umc.com","password":"Abcd1234!","nickname":"회원A"}'
req "회원가입 B (201)"               POST $B/members -d '{"email":"b@umc.com","password":"Abcd1234!","nickname":"회원B"}'
req "중복 이메일 (409 MEMBER4091)"    POST $B/members -d '{"email":"a@umc.com","password":"Abcd1234!","nickname":"다른닉"}'
req "중복 닉네임 (409 MEMBER4092)"    POST $B/members -d '{"email":"c@umc.com","password":"Abcd1234!","nickname":"회원A"}'
req "잘못된 비밀번호 (400)"           POST $B/members -d '{"email":"d@umc.com","password":"1234","nickname":"회원D"}'

echo "\n※ 아래 memberId/ratingId는 실제 응답 값에 맞게 수정하세요 (A=1, B=2, rating=1 가정)"
req "평점 등록 (201)"                 POST $B/members/1/ratings -d '{"movieId":10,"score":5,"comment":"최고"}'
req "중복 평점 (409 RATING409)"       POST $B/members/1/ratings -d '{"movieId":10,"score":4}'
req "잘못된 별점 (400)"               POST $B/members/1/ratings -d '{"movieId":11,"score":6}'
req "평점 수정 (200)"                 PATCH $B/members/1/ratings/1 -d '{"score":3,"comment":"보통"}'
req "남의 평점 수정 (403)"            PATCH $B/members/2/ratings/1 -d '{"score":1}'
req "남의 평점 삭제 (403)"            DELETE $B/members/2/ratings/1
req "없는 평점 수정 (404)"            PATCH $B/members/1/ratings/9999 -d '{"score":1}'
req "평점 삭제 (204)"                 DELETE $B/members/1/ratings/1
req "삭제된 평점 삭제 (404)"          DELETE $B/members/1/ratings/1
