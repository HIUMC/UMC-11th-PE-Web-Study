package com.umc.hoStudy.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.hoStudy.dto.book.BookResponse;
import com.umc.hoStudy.exception.CategoryNotFoundException;
import com.umc.hoStudy.service.BookService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

class BookControllerTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private BookService bookService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        bookService = mock(BookService.class);

        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        mockMvc = standaloneSetup(new BookController(bookService))
                .setValidator(validator)
                .build();
    }

    @Test
    void getBooksReturnsResponseDtos() throws Exception {
        when(bookService.getBooks()).thenReturn(List.of(
                new BookResponse(2L, "두 번째 책", "설명", "소설", true),
                new BookResponse(1L, "첫 번째 책", null, "에세이", false)
        ));

        mockMvc.perform(get("/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].bookId").value(2))
                .andExpect(jsonPath("$[0].categoryName").value("소설"))
                .andExpect(jsonPath("$[0].isAvailable").value(true));
    }

    @Test
    void createBookReturnsCreated() throws Exception {
        BookResponse response = new BookResponse(3L, "새 책", "새 설명", "소설", true);
        when(bookService.createBook(any())).thenReturn(response);

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreateRequest(1L, "새 책", "새 설명"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookId").value(3))
                .andExpect(jsonPath("$.title").value("새 책"));
    }

    @Test
    void createBookRejectsInvalidRequest() throws Exception {
        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreateRequest(null, "", null))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createBookRejectsUnknownCategory() throws Exception {
        when(bookService.createBook(any())).thenThrow(new CategoryNotFoundException(999L));

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreateRequest(999L, "새 책", null))))
                .andExpect(status().isNotFound());
    }

    private record CreateRequest(Long categoryId, String title, String description) {
    }
}
