package com.umc.movie.support;

import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

// bootTestRun으로 테스트 DB를 실행할 때만 사용하는 학습 계정. bootJar에는 포함되지 않는다.
@Configuration
@Profile("test & workbook")
public class WorkbookDemoConfig {
    @Bean
    ApplicationRunner seedWorkbookMember(MemberRepository members, PasswordEncoder encoder) {
        return args -> {
            if (!members.existsByEmail("hash9@example.com")) {
                members.saveAndFlush(new Member("hash9@example.com",
                        encoder.encode("Workbook9!Test"), "해시9"));
            }
        };
    }
}
