package com.umc.movie;

import org.junit.jupiter.api.Test;
import com.umc.movie.config.WebConfig;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:cors_off;MODE=MySQL")
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CorsDisabledTests {
    @Autowired MockMvc mvc;
    // 실습 0의 WebConfig 등록 전 상태를 테스트에서만 재현한다.
    @MockitoBean WebConfig webConfig;
    @Test void responseHasNoCorsPermissionWhenDisabled() throws Exception {
        mvc.perform(get("/members/email/new@umc.com").header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}
