package com.umc.movie;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:umc_week6_race;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1")
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SignUpConcurrencyIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @MockitoSpyBean PasswordEncoder passwordEncoder;

    @BeforeEach
    void cleanDatabase() {
        ratings.deleteAll();
        members.deleteAll();
    }

    @ParameterizedTest
    @ValueSource(strings = {"email", "nickname"})
    void databaseRejectsDuplicatesEvenAfterAllPrechecksPass(String duplicateField) throws Exception {
        int requests = 4;
        CyclicBarrier beforeHash = new CyclicBarrier(requests);
        // 모두 사전 검사를 통과한 뒤 저장을 진행하도록 실행 시점만 맞춥니다.
        // 실제 bcrypt, JPA 저장과 DB UNIQUE 제약은 그대로 사용합니다.
        doAnswer(invocation -> {
            beforeHash.await(10, TimeUnit.SECONDS);
            return invocation.callRealMethod();
        }).when(passwordEncoder).encode(any(CharSequence.class));

        List<MockHttpServletResponse> responses = new ArrayList<>();
        try (var executor = Executors.newFixedThreadPool(requests)) {
            List<Future<MockHttpServletResponse>> futures = new ArrayList<>();
            for (int i = 0; i < requests; i++) {
                String email = duplicateField.equals("email") ? "race@umc.com" : "race" + i + "@umc.com";
                String nickname = duplicateField.equals("nickname") ? "같은닉네임" : "동시요청" + i;
                String body = json.writeValueAsString(Map.of("email", email, "nickname", nickname, "password", "Umc!1234"));
                futures.add(executor.submit(() -> mvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON).content(body)).andReturn().getResponse()));
            }
            for (Future<MockHttpServletResponse> future : futures) {
                responses.add(future.get(20, TimeUnit.SECONDS));
            }
        }

        assertThat(responses).filteredOn(r -> r.getStatus() == 201).hasSize(1);
        assertThat(responses).filteredOn(r -> r.getStatus() == 409).hasSize(3);
        String expectedCode = duplicateField.equals("email") ? "MEMBER4091" : "MEMBER4092";
        for (MockHttpServletResponse response : responses) {
            if (response.getStatus() == 409) {
                assertThat(json.readTree(response.getContentAsString()).path("code").asText()).isEqualTo(expectedCode);
            }
        }
        assertThat(members.count()).isEqualTo(1);
    }
}
