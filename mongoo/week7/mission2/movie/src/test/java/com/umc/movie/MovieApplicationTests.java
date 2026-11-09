package com.umc.movie;

import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MovieApplicationTests {
    @Autowired MockMvc mvc;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @Autowired JdbcTemplate jdbc;
    Long memberId;
    Long emptyMemberId;

    @BeforeEach
    void seed() {
        ratings.deleteAllInBatch();
        members.deleteAllInBatch();
        Member member = members.saveAndFlush(new Member("noco@umc.com", "dummy", "수현"));
        memberId = member.getMemberId();
        emptyMemberId = members.saveAndFlush(new Member("empty@umc.com", "dummy", "빈회원")).getMemberId();
        Member other = members.saveAndFlush(new Member("minseo@umc.com", "dummy", "민서"));
        String insert = "INSERT INTO rating (member_id, movie_id, score, comment, created_at, updated_at) "
                + "VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
        jdbc.update(insert, memberId, 550L, 5, "최고의 영화!");
        jdbc.update(insert, memberId, 155L, 4, "다시 봐도 명작");
        jdbc.update(insert, other.getMemberId(), 550L, 3, "다른 회원의 평점");
    }

    @Test void existingNicknameIsUnavailable() throws Exception {
        mvc.perform(get("/members/nickname/{nickname}", "수현"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.available").value(false));
    }
    @Test void newNicknameIsAvailable() throws Exception {
        mvc.perform(get("/members/nickname/새닉네임"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.available").value(true));
    }
    @Test void existingEmailIsUnavailable() throws Exception {
        mvc.perform(get("/members/email/noco@umc.com"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.available").value(false));
    }
    @Test void newEmailIsAvailable() throws Exception {
        mvc.perform(get("/members/email/new@umc.com"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.available").value(true));
    }
    @Test void ratingsAreFilteredOrderedAndMappedToDto() throws Exception {
        mvc.perform(get("/members/{id}/ratings", memberId))
                .andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].movieId").value(155))
                .andExpect(jsonPath("$[1].movieId").value(550))
                .andExpect(jsonPath("$[0].score").value(4))
                .andExpect(jsonPath("$[0].createdAt").isString())
                .andExpect(jsonPath("$[0].updatedAt").isString())
                .andExpect(jsonPath("$[0].password").doesNotExist())
                .andExpect(jsonPath("$[0].member").doesNotExist())
                .andExpect(jsonPath("$[0].*", hasSize(6)));
    }
    @Test void existingMemberWithoutRatingsReturnsEmptyList() throws Exception {
        mvc.perform(get("/members/{id}/ratings", emptyMemberId))
                .andExpect(status().isOk()).andExpect(content().json("[]"));
    }
    @Test void missingMemberReturns404() throws Exception {
        mvc.perform(get("/members/999999999/ratings")).andExpect(status().isNotFound());
    }
    @Test void nonNumericMemberReturns400() throws Exception {
        mvc.perform(get("/members/abc/ratings")).andExpect(status().isBadRequest());
    }
    @Test void allowedOriginCanReadResponse() throws Exception {
        mvc.perform(get("/members/email/noco@umc.com").header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }
    @Test void frontendOn5174CanReadResponse() throws Exception {
        mvc.perform(get("/members/email/noco@umc.com").header("Origin", "http://localhost:5174"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5174"));
    }
    @Test void disallowedOriginIsRejected() throws Exception {
        mvc.perform(get("/members/email/noco@umc.com").header("Origin", "http://localhost:5175"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
    @Test void preflightIsAllowed() throws Exception {
        mvc.perform(options("/members/1/ratings")
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "GET")
                .header("Access-Control-Request-Headers", "Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(header().string("Access-Control-Allow-Methods", containsString("GET")));
    }
    @Test void plainPostmanRequestNeedsNoCorsHeaders() throws Exception {
        mvc.perform(get("/members/email/noco@umc.com"))
                .andExpect(status().isOk())
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}
