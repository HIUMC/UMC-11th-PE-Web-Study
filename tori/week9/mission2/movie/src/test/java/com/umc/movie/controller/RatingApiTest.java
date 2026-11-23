package com.umc.movie.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class RatingApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private Member member;
    private String authorizationHeader;

    @BeforeEach
    void setUp() {
        // 테스트용 회원 생성
        member = memberRepository.save(Member.builder()
                .email("rating@umc.com")
                .password("$2a$10$abcdefghijklmnopqrstuv")
                .nickname("평점조아")
                .build());

        // JWT 토큰 발급
        authorizationHeader = "Bearer " +
                jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());
    }

    // 토큰 없이 평점을 등록하면 401 반환
    @Test
    @DisplayName("토큰 없이 평점을 등록하면 401과 AUTH401_2를 응답한다")
    void createRatingWithoutToken() throws Exception {

        CreateRatingRequest request =
                new CreateRatingRequest(550L, 4, "재밌는 영화");

        mockMvc.perform(post("/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    // 토큰을 포함해 평점을 등록하면 201 반환
    @Test
    @DisplayName("토큰을 담아 평점을 등록하면 201과 저장된 영화 ID를 응답한다")
    void createRating() throws Exception {

        CreateRatingRequest request =
                new CreateRatingRequest(550L, 4, "재밌는 영화");

        mockMvc.perform(post("/ratings")
                        .header(HttpHeaders.AUTHORIZATION, authorizationHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550))
                .andExpect(jsonPath("$.result.score").value(4));
    }
}