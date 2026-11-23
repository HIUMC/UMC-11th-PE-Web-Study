package com.umc.movie.controller;

import com.umc.movie.auth.JwtUtil;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
abstract class ApiTestSupport {
    @Autowired MockMvc mvc;
    @Autowired MemberRepository members;
    @Autowired JwtUtil jwtUtil;
    @Autowired PasswordEncoder passwordEncoder;

    Member member() {
        String id = UUID.randomUUID().toString();
        return members.saveAndFlush(new Member(id + "@example.com", passwordEncoder.encode("Workbook9!Test"),
                id.substring(0, 10)));
    }

    String bearer(Member member) {
        return "Bearer " + jwtUtil.createAccessToken(member.getMemberId());
    }
}
