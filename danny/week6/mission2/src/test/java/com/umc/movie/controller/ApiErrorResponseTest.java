package com.umc.movie.controller;

import com.umc.movie.dto.MemberResponse;
import com.umc.movie.exception.DuplicateException;
import com.umc.movie.exception.DuplicateType;
import com.umc.movie.service.MemberService;
import com.umc.movie.service.RatingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.web.server.ResponseStatusException;

import java.sql.SQLException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest({MemberController.class, RatingController.class})
class ApiErrorResponseTest {

    private static final String SIGN_UP_BODY =
            "{\"email\":\"a@b.com\",\"password\":\"Test1234!\",\"nickname\":\"tester\"}";
    private static final String RATING_BODY = "{\"movieId\":1,\"score\":5,\"comment\":\"good\"}";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MemberService memberService;

    @MockitoBean
    private RatingService ratingService;

    private MockHttpServletRequestBuilder json(MockHttpServletRequestBuilder request, String body) {
        return request.contentType(MediaType.APPLICATION_JSON).content(body);
    }

    @Test
    void signUpReturns201WithoutPassword() throws Exception {
        given(memberService.signUp(any())).willReturn(new MemberResponse(1L, "a@b.com", "tester"));

        mockMvc.perform(json(post("/members"), SIGN_UP_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.memberId").value(1))
                .andExpect(jsonPath("$.result.password").doesNotExist());
    }

    @ParameterizedTest
    @CsvSource({"EMAIL,MEMBER4091", "NICKNAME,MEMBER4092"})
    void duplicateSignUpReturnsDistinctCode(DuplicateType type, String code) throws Exception {
        given(memberService.signUp(any())).willThrow(new DuplicateException(type));

        mockMvc.perform(json(post("/members"), SIGN_UP_BODY))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value(code))
                .andExpect(jsonPath("$.message").value(type.getMessage()));
    }

    @ParameterizedTest
    @CsvSource(delimiter = '|', value = {
            "Duplicate entry 'a@b.com' for key 'member.email'|MEMBER4091",
            "Duplicate entry 'tester' for key 'member.nickname'|MEMBER4092",
            "Duplicate entry 'email' for key 'member.nickname'|MEMBER4092",
            "Duplicate entry '1-1' for key 'rating.member_id'|RATING4091",
            "Duplicate entry 'x' for key 'member.UK_abc123'|COMMON4091",
            "Column 'email' cannot be null|COMMON4091"
    })
    void dbConstraintViolationUsesSameFormat(String dbMessage, String code) throws Exception {
        given(memberService.signUp(any())).willThrow(
                new DataIntegrityViolationException("could not execute statement", new SQLException(dbMessage)));

        mockMvc.perform(json(post("/members"), SIGN_UP_BODY))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value(code));
    }

    @Test
    void invalidEmailReturns400() throws Exception {
        mockMvc.perform(json(post("/members"), SIGN_UP_BODY.replace("a@b.com", "not-an-email")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("COMMON4001"));
    }

    @ParameterizedTest
    @ValueSource(ints = {0, 6})
    void outOfRangeScoreReturns400(int score) throws Exception {
        mockMvc.perform(json(post("/members/1/ratings"), RATING_BODY.replace("\"score\":5", "\"score\":" + score)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("COMMON4001"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"\"abc\"", "3.5"})
    void unreadableScoreReturns400(String score) throws Exception {
        mockMvc.perform(json(post("/members/1/ratings"), RATING_BODY.replace("\"score\":5", "\"score\":" + score)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("COMMON4002"));
    }

    @Test
    void createRatingReturns201() throws Exception {
        given(ratingService.create(eq(1L), any())).willReturn(10L);

        mockMvc.perform(json(post("/members/1/ratings"), RATING_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.result").value(10));
    }

    @Test
    void updateRatingReturns200() throws Exception {
        mockMvc.perform(json(patch("/members/1/ratings/10"), "{\"score\":4,\"comment\":\"ok\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("COMMON200"));
    }

    @Test
    void deleteRatingReturns204() throws Exception {
        mockMvc.perform(delete("/members/1/ratings/10"))
                .andExpect(status().isNoContent());
    }

    @ParameterizedTest
    @CsvSource({"FORBIDDEN,403", "NOT_FOUND,404"})
    void ratingAccessErrorsUseSameFormat(HttpStatus httpStatus, int expected) throws Exception {
        willThrow(new ResponseStatusException(httpStatus, "reason")).given(ratingService).delete(10L, 1L);

        mockMvc.perform(delete("/members/1/ratings/10"))
                .andExpect(status().is(expected))
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON" + expected));
    }
}
