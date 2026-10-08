package com.umc.study;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class BookApiTest {

    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;

    @Test
    void scenario() throws Exception {
        jdbc.update("INSERT INTO category (name) VALUES ('문학'), ('과학')");
        jdbc.update("INSERT INTO book (category_id, title, description, is_available) VALUES " +
                "(1,'달빛 도서관','소설',1),(1,'겨울의 편지','에세이',0),(2,'우주를 읽는 법','과학 교양',1)");

        mvc.perform(get("/books")).andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].bookId").value(3))
                .andExpect(jsonPath("$[0].categoryName").value("과학"))
                .andExpect(jsonPath("$[1].isAvailable").value(false));

        mvc.perform(post("/books").contentType(MediaType.APPLICATION_JSON)
                .content("{\"categoryId\":2,\"title\":\"클린 코드\",\"description\":\"개발 도서\"}"))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookId").value(4))
                .andExpect(jsonPath("$.categoryName").value("과학"))
                .andExpect(jsonPath("$.isAvailable").value(true));

        mvc.perform(post("/books").contentType(MediaType.APPLICATION_JSON)
                .content("{\"categoryId\":999,\"title\":\"없는 카테고리\"}"))
                .andDo(print()).andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("CATEGORY_NOT_FOUND"));

        mvc.perform(post("/books").contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"  \"}"))
                .andDo(print()).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title").exists())
                .andExpect(jsonPath("$.errors.categoryId").exists());

        mvc.perform(get("/books/category/1")).andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }
}
