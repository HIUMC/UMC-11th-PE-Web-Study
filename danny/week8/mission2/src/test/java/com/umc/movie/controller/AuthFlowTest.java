package com.umc.movie.controller;

import com.umc.movie.config.PasswordConfig;
import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.service.AuthService;
import com.umc.movie.service.MemberService;
import com.umc.movie.service.RatingService;
import com.umc.movie.util.JwtUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 실제 JwtUtil + AuthInterceptor + AuthService로 7주차 체크리스트의 인증/인가 흐름을 확인합니다.
 * DB만 가짜(MemberRepository mock)로 바꿨습니다.
 */
@WebMvcTest({AuthController.class, MemberController.class, RatingController.class})
@Import({AuthService.class, JwtUtil.class, PasswordConfig.class})
@TestPropertySource(properties = {
        "jwt.secret=test-secret-key-that-is-long-enough-for-hs256",
        "jwt.access-expiration=3600"
})
class AuthFlowTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private MemberRepository memberRepository;
    @MockitoBean private MemberService memberService;
    @MockitoBean private RatingService ratingService;

    @BeforeEach
    void setUpMember() {
        Member member = Member.builder()
                .email("a@b.com").password(passwordEncoder.encode("Test1234!")).nickname("tester").build();
        ReflectionTestUtils.setField(member, "memberId", 1L);
        given(memberRepository.findByEmail("a@b.com")).willReturn(Optional.of(member));
    }

    private String login(String email, String password) throws Exception {
        return mockMvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
    }

    @Test
    void loginIssuesTokenWhosePayloadHoldsMemberId() throws Exception {
        JsonNode body = objectMapper.readTree(login("a@b.com", "Test1234!"));
        assertThat(body.get("code").asText()).isEqualTo("COMMON200");
        assertThat(body.at("/result/nickname").asText()).isEqualTo("tester");

        String token = body.at("/result/accessToken").asText();
        // jwt.io에서 보이는 payload와 같은 내용입니다 (Base64URL 디코딩만 하면 누구나 읽을 수 있습니다)
        JsonNode payload = objectMapper.readTree(Base64.getUrlDecoder().decode(token.split("\\.")[1]));
        assertThat(payload.get("sub").asText()).isEqualTo("1");
        assertThat(payload.get("email").asText()).isEqualTo("a@b.com");
        assertThat(payload.has("exp")).isTrue();
    }

    @Test
    void unknownEmailAndWrongPasswordGiveIdenticalResponse() throws Exception {
        String wrongPassword = login("a@b.com", "Wrong1234!");
        String unknownEmail = login("nobody@b.com", "Test1234!");

        // 응답이 같아야 "이 이메일은 가입되어 있다"는 사실이 새어나가지 않습니다
        assertThat(wrongPassword).isEqualTo(unknownEmail);
        assertThat(objectMapper.readTree(wrongPassword).get("code").asText()).isEqualTo("AUTH401_1");
    }

    @Test
    void myInfoWithoutTokenIs401() throws Exception {
        mockMvc.perform(get("/members/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
        verifyNoInteractions(memberService);
    }

    @Test
    void myInfoWithValidTokenUsesMemberIdFromToken() throws Exception {
        given(memberService.getMyInfo(1L)).willReturn(new MemberInfoResponse("a@b.com", "tester", null));

        mockMvc.perform(get("/members/me")
                        .header("Authorization", "Bearer " + jwtUtil.createAccessToken(1L, "a@b.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.nickname").value("tester"))
                .andExpect(jsonPath("$.result.password").doesNotExist());
    }

    @Test
    void tamperedPayloadFailsSignatureCheck() throws Exception {
        String[] parts = jwtUtil.createAccessToken(1L, "a@b.com").split("\\.");
        // payload의 sub를 1 → 2로 바꿔 다른 회원 행세를 시도합니다
        String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8)
                .replace("\"sub\":\"1\"", "\"sub\":\"2\"");
        String forged = parts[0] + "."
                + Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8))
                + "." + parts[2];

        mockMvc.perform(get("/members/me").header("Authorization", "Bearer " + forged))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_3"));
        verifyNoInteractions(memberService);
    }

    @Test
    void expiredTokenIs401WithDistinctCode() throws Exception {
        // 만료 -120초(시계 오차 허용 60초보다 과거)인 토큰을 같은 키로 만듭니다
        JwtUtil expiredIssuer = new JwtUtil("test-secret-key-that-is-long-enough-for-hs256", -120L);

        mockMvc.perform(get("/members/me")
                        .header("Authorization", "Bearer " + expiredIssuer.createAccessToken(1L, "a@b.com")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_4"));
    }

    @Test
    void ratingWriteWithoutTokenIs401() throws Exception {
        mockMvc.perform(post("/ratings").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":1,\"score\":5,\"comment\":\"good\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
        verifyNoInteractions(ratingService);
    }

    @Test
    void otherMembersRatingIs403NotFor401() throws Exception {
        // 회원 2가 회원 1의 평점(10번)을 수정하려는 상황
        willThrow(new ApiException(HttpStatus.FORBIDDEN, "RATING403_1",
                "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다."))
                .given(ratingService).update(eq(2L), eq(10L), any());

        mockMvc.perform(patch("/ratings/10").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + jwtUtil.createAccessToken(2L, "c@d.com"))
                        .content("{\"score\":4,\"comment\":\"hack\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("RATING403_1"));
    }

    @Test
    void publicRatingListNeedsNoToken() throws Exception {
        mockMvc.perform(get("/members/1/ratings")).andExpect(status().isOk());
    }
}
