package com.umc.movie.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.time.Clock;

@Configuration
public class AuthConfig {
    @Bean
    public Clock authClock() {
        return Clock.systemUTC();
    }
}
