package com.umc.umcine;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.umcine.dto.SignUpRequest;
import com.umc.umcine.entity.Member;
import com.umc.umcine.repository.MemberRepository;
import com.umc.umcine.service.MemberService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doAnswer;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
@AutoConfigureMockMvc
class MemberSignUpIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoSpyBean
    private MemberRepository memberRepository;

    @Autowired
    private MemberService memberService;

    @MockitoSpyBean
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void clearTestDatabase() {
        memberRepository.deleteAll();
    }

    @Test
    void signUpCommitsMemberAndStoresOnlyPasswordHash() throws Exception {
        String body = mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"umc@example.com","password":"Umc!1234","nickname":"moviefan"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.email").value("umc@example.com"))
                .andExpect(jsonPath("$.result.nickname").value("moviefan"))
                .andExpect(jsonPath("$.result.password").doesNotExist())
                .andReturn().getResponse().getContentAsString();

        JsonNode result = objectMapper.readTree(body).get("result");
        Member saved = memberRepository.findById(result.get("memberId").asLong()).orElseThrow();
        assertThat(memberRepository.count()).isEqualTo(1);
        assertThat(saved.getPassword()).hasSize(60).isNotEqualTo("Umc!1234");
        assertThat(passwordEncoder.matches("Umc!1234", saved.getPassword())).isTrue();
        assertThat(saved.getCreatedAt()).isNotNull();

        mockMvc.perform(get("/members/email/umc@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(false));
        mockMvc.perform(get("/members/nickname/moviefan"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(false));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "{\"email\":\"invalid\",\"password\":\"Umc!1234\",\"nickname\":\"moviefan\"}",
            "{\"email\":\"\",\"password\":\"Umc!1234\",\"nickname\":\"moviefan\"}",
            "{\"email\":\"umc@example.com\",\"password\":\"password\",\"nickname\":\"moviefan\"}",
            "{\"email\":\"umc@example.com\",\"password\":\"Umc!1234\",\"nickname\":\"a\"}",
            "{\"email\":\"umc@example.com\",\"password\":\"Umc!1234\",\"nickname\":\"1234567890123\"}",
            "{}"
    })
    void invalidRequestsReturn400AndDoNotSave(String body) throws Exception {
        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4001"))
                .andExpect(jsonPath("$.message").isNotEmpty())
                .andExpect(jsonPath("$.result").value(nullValue()));
        assertThat(memberRepository.count()).isZero();
    }

    @Test
    void duplicateEmailReturns409AndDoesNotSaveAnotherMember() throws Exception {
        memberService.signUp(new SignUpRequest("umc@example.com", "Umc!1234", "moviefan"));

        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new SignUpRequest("umc@example.com", "Umc!1234", "otherfan"))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("MEMBER4091"))
                .andExpect(jsonPath("$.message").value("이미 사용 중인 이메일입니다."))
                .andExpect(jsonPath("$.result").value(nullValue()));
        assertThat(memberRepository.count()).isEqualTo(1);
    }

    @Test
    void duplicateNicknameReturns409AndDoesNotSaveAnotherMember() throws Exception {
        memberService.signUp(new SignUpRequest("umc@example.com", "Umc!1234", "moviefan"));

        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new SignUpRequest("other@example.com", "Umc!1234", "moviefan"))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("MEMBER4092"))
                .andExpect(jsonPath("$.message").value("이미 사용 중인 닉네임입니다."))
                .andExpect(jsonPath("$.result").value(nullValue()));
        assertThat(memberRepository.count()).isEqualTo(1);
    }

    @ParameterizedTest
    @ValueSource(strings = {"email", "nickname"})
    void databaseUniqueViolationReturns409WhenPrecheckMissesDuplicate(String duplicateField) throws Exception {
        memberService.signUp(new SignUpRequest("umc@example.com", "Umc!1234", "moviefan"));
        // 동시 요청처럼 사전 검사가 중복을 발견하지 못해도 DB 제약은 중복 저장을 막아야 합니다.
        SignUpRequest duplicate;
        if (duplicateField.equals("email")) {
            doReturn(false).when(memberRepository).existsByEmail("umc@example.com");
            duplicate = new SignUpRequest("umc@example.com", "Umc!1234", "otherfan");
        } else {
            doReturn(false).when(memberRepository).existsByNickname("moviefan");
            duplicate = new SignUpRequest("other@example.com", "Umc!1234", "moviefan");
        }

        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4091"))
                .andExpect(jsonPath("$.message").value("이미 존재하는 데이터입니다."))
                .andExpect(jsonPath("$.result").value(nullValue()));
        assertThat(memberRepository.count()).isEqualTo(1);
    }

    @ParameterizedTest
    @ValueSource(strings = {"email", "nickname"})
    void concurrentSignUpsPassPrechecksButDatabaseAllowsOnlyOneMember(String duplicateField) throws Exception {
        CyclicBarrier afterPrechecks = new CyclicBarrier(2);
        // 실제 사전 검사를 마친 두 요청을 해시 생성 후, DB 저장 직전에 맞춥니다.
        doAnswer(invocation -> {
            String hash = (String) invocation.callRealMethod();
            afterPrechecks.await(10, TimeUnit.SECONDS);
            return hash;
        }).when(passwordEncoder).encode(org.mockito.ArgumentMatchers.anyString());

        SignUpRequest first = new SignUpRequest("race@example.com", "Umc!1234", "racefan");
        SignUpRequest second = duplicateField.equals("email")
                ? new SignUpRequest("race@example.com", "Umc!1234", "otherfan")
                : new SignUpRequest("other@example.com", "Umc!1234", "racefan");

        try (var executor = Executors.newFixedThreadPool(2)) {
            var futures = executor.<MvcResult>invokeAll(List.of(
                    () -> performConcurrentSignUp(first),
                    () -> performConcurrentSignUp(second)
            ), 20, TimeUnit.SECONDS);
            var responses = List.of(futures.get(0).get(), futures.get(1).get());
            assertThat(responses.stream().map(response -> response.getResponse().getStatus()).toList())
                    .containsExactlyInAnyOrder(201, 409);
            var failure = responses.stream().filter(response -> response.getResponse().getStatus() == 409)
                    .findFirst().orElseThrow();
            JsonNode body = objectMapper.readTree(failure.getResponse().getContentAsString());
            assertThat(body.get("isSuccess").asBoolean()).isFalse();
            assertThat(body.get("code").asText()).isEqualTo("COMMON4091");
            assertThat(body.get("message").asText()).isEqualTo("이미 존재하는 데이터입니다.");
            assertThat(body.get("result").isNull()).isTrue();
        }
        assertThat(memberRepository.count()).isEqualTo(1);
        System.out.printf("선택 미션 경합 검증 [%s]: 사전 검사 통과 2건 → 201 1건 / DB UNIQUE 409 1건 / 저장된 회원 1명%n", duplicateField);
    }

    private MvcResult performConcurrentSignUp(SignUpRequest request) throws Exception {
        return mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andReturn();
    }

    @ParameterizedTest
    @ValueSource(strings = {"{", ""})
    void malformedOrMissingBodyReturnsCommon400Response(String body) throws Exception {
        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4001"))
                .andExpect(jsonPath("$.message").value("요청 본문이 없거나 JSON 형식이 올바르지 않습니다."))
                .andExpect(jsonPath("$.result").value(nullValue()));
        assertThat(memberRepository.count()).isZero();
    }

    @Test
    void missingMemberRatingsReturnCommon404Response() throws Exception {
        mockMvc.perform(get("/members/{memberId}/ratings", Long.MAX_VALUE))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON404"))
                .andExpect(jsonPath("$.message").value("존재하지 않는 유저입니다."))
                .andExpect(jsonPath("$.result").value(nullValue()));
    }
}
