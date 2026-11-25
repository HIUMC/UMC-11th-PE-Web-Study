package com.umc.umcine.util;

import com.umc.umcine.exception.ApiException;
import com.umc.umcine.exception.AuthErrorCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
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
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessExpiration = Duration.ofSeconds(accessExpiration);
    }

    public String createAccessToken(Long memberId, String email) {
        Instant now = Instant.now();

        return Jwts.builder()
                .subject(String.valueOf(memberId))
                .claim("email", email)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(accessExpiration)))
                .signWith(secretKey)
                .compact();
    }

    public Long getMemberId(String token) {
        try {
            return Long.valueOf(getClaims(token).getPayload().getSubject());
        } catch (ExpiredJwtException e) {
            throw new ApiException(AuthErrorCode.EXPIRED_TOKEN);
        } catch (JwtException | IllegalArgumentException e) {
            throw new ApiException(AuthErrorCode.INVALID_TOKEN);
        }
    }

    private Jws<Claims> getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .clockSkewSeconds(                                                                               60)
                .build()
                .parseSignedClaims(token);
    }
}
