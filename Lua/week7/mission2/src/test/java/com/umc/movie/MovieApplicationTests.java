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
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MovieApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RatingRepository ratingRepository;

    private Member seededMember;

    @BeforeEach
    void setUp() {
        ratingRepository.deleteAll();
        memberRepository.deleteAll();
        seededMember = memberRepository.save(new Member("noco@umc.com", "$2a$10$dummyEncodedPasswordValue", "수현"));
    }

    @Test
    void contextLoads() {
    }

    @Test
    void nicknameCheckReturnsAvailabilityAndCorsHeader() throws Exception {
        mockMvc.perform(get("/members/nickname/{nickname}", "수현")
                        .header("Origin", "http://localhost:5173")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(false))
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @Test
    void emailCheckReturnsAvailability() throws Exception {
        mockMvc.perform(get("/members/email/{email}", "new@umc.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(true));
    }

    @Test
    void ratingsForMissingMemberReturns404() throws Exception {
        mockMvc.perform(get("/members/{memberId}/ratings", 999))
                .andExpect(status().isNotFound());
    }

    @Test
    void ratingsReturnDtoForExistingMember() throws Exception {
        ratingRepository.save(new Rating(seededMember, 550L, 5, "최고의 영화!"));

        mockMvc.perform(get("/members/{memberId}/ratings", seededMember.getMemberId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].movieId").value(550))
                .andExpect(jsonPath("$[0].score").value(5))
                .andExpect(jsonPath("$[0].comment").value("최고의 영화!"))
                .andExpect(jsonPath("$[0].createdAt").exists())
                .andExpect(jsonPath("$[0].updatedAt").exists());
    }

    @Test
    void signUpHashesPasswordAndDoesNotExposeIt() throws Exception {
        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"signup@umc.com\",\"password\":\"Password!1\",\"nickname\":\"signupUser\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.email").value("signup@umc.com"))
                .andExpect(jsonPath("$.result.password").doesNotExist());
    }

    @Test
    void invalidRatingReturnsUnified400Response() throws Exception {
        mockMvc.perform(post("/members/{memberId}/ratings", seededMember.getMemberId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":6}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4001"))
                .andExpect(jsonPath("$.result").isEmpty());
    }

    @Test
    void ratingDuplicateIsRejectedAndDeleteReturns204() throws Exception {
        mockMvc.perform(post("/members/{memberId}/ratings", seededMember.getMemberId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5,\"comment\":\"great\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.result").isNumber());

        mockMvc.perform(post("/members/{memberId}/ratings", seededMember.getMemberId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":4}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4091"));

        Rating rating = ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(seededMember.getMemberId()).getFirst();
        mockMvc.perform(delete("/members/{memberId}/ratings/{ratingId}", seededMember.getMemberId(), rating.getRatingId()))
                .andExpect(status().isNoContent());
    }
}
