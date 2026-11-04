package com.umc.movie;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {"app.cors.enabled=false", "spring.datasource.url=jdbc:h2:mem:umc_week5_no_cors;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1"})
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CorsDisabledIntegrationTest {
    @Autowired MockMvc mvc;

    @Test
    void noCorsConfigurationLeavesResponseWithoutAllowOriginHeader() throws Exception {
        mvc.perform(get("/members/nickname/noco").header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(true))
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}
