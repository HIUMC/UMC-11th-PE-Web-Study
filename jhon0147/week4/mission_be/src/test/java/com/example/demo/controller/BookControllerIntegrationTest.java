package com.example.demo.controller;

import com.example.demo.entity.Book;
import com.example.demo.entity.Category;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class BookControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void getBooksReturnsNewestBookFirst() throws Exception {
        Category category = categoryRepository.save(new Category("IT"));
        Book firstBook = bookRepository.save(new Book(category, "SQL 입문", "Raw SQL 학습"));
        Book secondBook = bookRepository.save(new Book(category, "JPA 입문", "ORM 학습"));

        mockMvc.perform(get("/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].bookId").value(secondBook.getBookId()))
                .andExpect(jsonPath("$[0].title").value("JPA 입문"))
                .andExpect(jsonPath("$[0].categoryName").value("IT"))
                .andExpect(jsonPath("$[1].bookId").value(firstBook.getBookId()));
    }

    @Test
    void createBookReturnsCreatedBook() throws Exception {
        Category category = categoryRepository.save(new Category("IT"));

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": %d,
                                  "title": "스프링 데이터 JPA",
                                  "description": "ORM 기반 도서 등록"
                                }
                                """.formatted(category.getCategoryId())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookId").isNumber())
                .andExpect(jsonPath("$.title").value("스프링 데이터 JPA"))
                .andExpect(jsonPath("$.description").value("ORM 기반 도서 등록"))
                .andExpect(jsonPath("$.categoryName").value("IT"))
                .andExpect(jsonPath("$.isAvailable").value(true));
    }

    @Test
    void createBookRejectsBlankTitle() throws Exception {
        Category category = categoryRepository.save(new Category("IT"));

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": %d,
                                  "title": "   ",
                                  "description": "잘못된 요청"
                                }
                                """.formatted(category.getCategoryId())))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createBookRejectsUnknownCategory() throws Exception {
        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 999999,
                                  "title": "존재할 수 없는 도서",
                                  "description": "없는 카테고리"
                                }
                                """))
                .andExpect(status().isNotFound());
    }
}
