package com.umc.movie.util;

import com.umc.movie.exception.ApiException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final Duration accessExpiration;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-expiration}") Long accessExpiration
    ) {
        // 문자열 비밀키를 HMAC-SHA 서명용 키 객체로 바꿈
        // 이 키가 있어야 서명을 만들 수 있고, 같은 키로만 검증할 수 있음
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessExpiration = Duration.ofSeconds(accessExpiration);
    }

    /**
     * 로그인에 성공한 회원에게 발급할 Access Token을 만듦
     */
    public String createAccessToken(Long memberId, String email) {
        Instant now = Instant.now();

        return Jwts.builder()
                .subject(String.valueOf(memberId)) // 토큰 주인. memberId를 넣음
                .claim("email", email)             // 참고용 부가 정보 (없어도 동작함)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(accessExpiration))) // 만료 시각이 없으면 영원히 유효한 토큰이 됨
                .signWith(secretKey)               // 이 서명 때문에 내용을 조작하면 검증에서 걸림
                .compact();
    }

    /**
     * 토큰을 검증하고 안에 담긴 memberId를 꺼냄
     * 서명이 안 맞거나 만료된 토큰이면 예외를 던지니까, 값이 돌아왔다면 검증까지 통과한 토큰임
     */
    public Long getMemberId(String token) {
        try {
            return Long.valueOf(getClaims(token).getPayload().getSubject());
        } catch (ExpiredJwtException e) {
            // 만료는 다시 로그인하면 해결되는 상황이라 따로 구분함
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_4",
                    "토큰이 만료되었습니다. 다시 로그인해주세요.");
        } catch (JwtException | IllegalArgumentException e) {
            // 서명 불일치, 형식 오류 등 나머지 실패 전부
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_3",
                    "유효하지 않은 토큰입니다.");
        }
    }

    private Jws<Claims> getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)  // 이 키로 서명을 다시 계산해서 대조함
                .clockSkewSeconds(60)   // 서버와 클라이언트 시계가 조금 어긋나도 되게 60초 여유 둠
                .build()
                .parseSignedClaims(token);
    }
}
