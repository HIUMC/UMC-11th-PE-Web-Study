package com.umc.movie;

import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class MemberApiIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;

    private Member member;

    @BeforeEach
    void setUp() {
        member = members.save(new Member("noco@umc.com", "dummy-not-a-password", "수현"));
    }

    @Test
    void nicknameCheckDistinguishesExistingAndUnusedNames() throws Exception {
        mvc.perform(get("/members/nickname/{nickname}", "수현"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.available").value(false));
        mvc.perform(get("/members/nickname/{nickname}", "noco"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.available").value(true));
    }

    @Test
    void emailCheckDistinguishesExistingAndUnusedAddresses() throws Exception {
        mvc.perform(get("/members/email/{email}", "noco@umc.com"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.available").value(false));
        mvc.perform(get("/members/email/{email}", "unused@umc.com"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.available").value(true));
    }

    @Test
    void returnsOnlyRequestedMembersRatingsNewestIdFirst() throws Exception {
        Rating first = ratings.save(new Rating(member, 550L, 5, "최고의 영화!"));
        Rating second = ratings.save(new Rating(member, 155L, 4, "다시 봐도 명작"));
        Member other = members.save(new Member("other@umc.com", "dummy", "민서"));
        ratings.save(new Rating(other, 550L, 3, "다른 회원의 평점"));

        mvc.perform(get("/members/{memberId}/ratings", member.getMemberId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].ratingId").value(second.getRatingId()))
                .andExpect(jsonPath("$[0].movieId").value(155))
                .andExpect(jsonPath("$[0].score").value(4))
                .andExpect(jsonPath("$[0].comment").value("다시 봐도 명작"))
                .andExpect(jsonPath("$[0].createdAt").isString())
                .andExpect(jsonPath("$[0].updatedAt").isString())
                .andExpect(jsonPath("$[0].member").doesNotExist())
                .andExpect(jsonPath("$[0].password").doesNotExist())
                .andExpect(jsonPath("$[1].ratingId").value(first.getRatingId()));
    }

    @Test
    void existingMemberWithoutRatingsReturnsEmptyArray() throws Exception {
        mvc.perform(get("/members/{memberId}/ratings", member.getMemberId()))
                .andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void missingMemberReturns404() throws Exception {
        mvc.perform(get("/members/999999/ratings")).andExpect(status().isNotFound());
    }

    @Test
    void nonNumericMemberIdReturns400() throws Exception {
        mvc.perform(get("/members/not-a-number/ratings")).andExpect(status().isBadRequest());
    }

    @Test
    void allowedOriginCanReadActualResponse() throws Exception {
        mvc.perform(get("/members/nickname/noco").header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @Test
    void allowedOriginPassesGetPreflight() throws Exception {
        mvc.perform(options("/members/nickname/noco")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "content-type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(header().string("Access-Control-Allow-Methods", "GET"));
    }

    @Test
    void unlistedOriginIsRejected() throws Exception {
        mvc.perform(get("/members/nickname/noco").header("Origin", "http://localhost:9999"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}
