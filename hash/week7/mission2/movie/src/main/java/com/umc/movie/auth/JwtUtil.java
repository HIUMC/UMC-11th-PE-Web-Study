package com.umc.movie.auth;

import com.umc.movie.exception.BusinessException;
import com.umc.movie.exception.ErrorCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final JwtParser parser;
    private final Duration accessLifetime;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-expiration}") long accessExpirationSeconds
    ) {
        if (accessExpirationSeconds <= 0) {
            throw new IllegalArgumentException("JWT_ACCESS_EXPIRATION must be positive.");
        }

        byte[] keyBytes = Decoders.BASE64.decode(secret);
        if (keyBytes.length != 32) {
            throw new IllegalArgumentException("JWT_SECRET must be a Base64-encoded 32-byte key.");
        }

        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.accessLifetime = Duration.ofSeconds(accessExpirationSeconds);
        var algorithms = Jwts.parser().verifyWith(key).sig();
        for (var algorithm : Jwts.SIG.get().values()) {
            if (!Jwts.SIG.HS256.getId().equals(algorithm.getId())) {
                algorithms.remove(algorithm);
            }
        }
        this.parser = algorithms.and().build();
    }

    public String createAccessToken(Long memberId) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(memberId.toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(accessLifetime)))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    public Long getMemberId(String token) {
        try {
            Claims claims = parser.parseSignedClaims(token).getPayload();
            if (claims.getExpiration() == null) {
                throw new BusinessException(ErrorCode.TOKEN_INVALID);
            }

            long memberId = Long.parseLong(claims.getSubject());
            if (memberId <= 0) {
                throw new BusinessException(ErrorCode.TOKEN_INVALID);
            }
            return memberId;
        } catch (ExpiredJwtException exception) {
            throw new BusinessException(ErrorCode.TOKEN_EXPIRED);
        } catch (JwtException | IllegalArgumentException exception) {
            throw new BusinessException(ErrorCode.TOKEN_INVALID);
        }
    }
}