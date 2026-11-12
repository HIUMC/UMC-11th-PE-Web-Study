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
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtil {
    private final SecretKey secretKey;
    private final Duration accessExpiration;
    private final Clock clock;

    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.access-expiration}") Long expirationSeconds,
                   Clock clock) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        if (expirationSeconds == null || expirationSeconds <= 0) {
            throw new IllegalArgumentException("JWT_ACCESS_EXPIRATION은 양의 정수(초)여야 합니다.");
        }
        this.accessExpiration = Duration.ofSeconds(expirationSeconds);
        this.clock = clock;
    }

    public String createAccessToken(Long memberId, String email) {
        Instant now = clock.instant();
        return Jwts.builder()
                .subject(String.valueOf(memberId))
                .claim("email", email)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(accessExpiration)))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public Long getMemberId(String token) {
        try {
            Jws<Claims> signed = Jwts.parser()
                    .verifyWith(secretKey)
                    .clock(() -> Date.from(clock.instant()))
                    .build().parseSignedClaims(token);
            Claims claims = signed.getPayload();
            if (!Jwts.SIG.HS256.getId().equals(signed.getHeader().getAlgorithm())
                    || claims.getExpiration() == null || claims.getSubject() == null) {
                throw new IllegalArgumentException("필수 클레임 또는 알고리즘 오류");
            }
            Long memberId = Long.valueOf(claims.getSubject());
            if (memberId <= 0) throw new IllegalArgumentException("유효하지 않은 회원 번호");
            return memberId;
        } catch (ExpiredJwtException exception) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_4",
                    "토큰이 만료되었습니다. 다시 로그인해주세요.");
        } catch (JwtException | IllegalArgumentException exception) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_3", "유효하지 않은 토큰입니다.");
        }
    }
}
