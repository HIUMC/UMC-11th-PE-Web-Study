package com.umc.study.book;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.core.io.ClassPathResource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BookApiIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("DELETE FROM book");
        jdbcTemplate.update("DELETE FROM category");
        jdbcTemplate.update("INSERT INTO category (category_id, name) VALUES (1, '문학'), (2, '과학')");
    }

    @Test
    void listsBooksWithCategoryNameInDescendingOrder() throws Exception {
        insertBook("첫 번째 책", 1);
        insertBook("두 번째 책", 2);

        mockMvc.perform(get("/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("두 번째 책"))
                .andExpect(jsonPath("$[0].categoryName").value("과학"))
                .andExpect(jsonPath("$[1].categoryName").value("문학"));
    }

    @Test
    void searchesTitlesAndTreatsBlankKeywordAsFullList() throws Exception {
        insertBook("스프링으로 배우는 JPA", 2);
        insertBook("달빛 도서관", 1);

        mockMvc.perform(get("/books").param("keyword", " 스프링 "))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("스프링으로 배우는 JPA"));
        mockMvc.perform(get("/books").param("keyword", "   "))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void treatsLikeWildcardAsLiteralSearchText() throws Exception {
        insertBook("100% 이해하는 JPA", 2);
        insertBook("달빛 도서관", 1);

        mockMvc.perform(get("/books").param("keyword", "%"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void createsAvailableBookAndReturnsResponseDto() throws Exception {
        mockMvc.perform(post("/books").contentType(MediaType.APPLICATION_JSON)
                        .content(bookRequest(1, "새 도서")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookId").isNumber())
                .andExpect(jsonPath("$.title").value("새 도서"))
                .andExpect(jsonPath("$.categoryName").value("문학"))
                .andExpect(jsonPath("$.isAvailable").value(true));

        assertThat(bookCount()).isEqualTo(1);
    }

    @Test
    void rejectsBlankTitleWithValidationMessage() throws Exception {
        mockMvc.perform(post("/books").contentType(MediaType.APPLICATION_JSON)
                        .content(bookRequest(1, "   ")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors", hasItem("제목은 공백일 수 없습니다.")));

        assertThat(bookCount()).isZero();
    }

    @Test
    void rejectsNonPositiveCategoryInBodyAndPath() throws Exception {
        mockMvc.perform(post("/books").contentType(MediaType.APPLICATION_JSON)
                        .content(bookRequest(0, "잘못된 요청")))
                .andExpect(status().isBadRequest());
        mockMvc.perform(get("/books/category/0"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors", hasItem("categoryId는 양의 정수여야 합니다.")));
    }

    @Test
    void rejectsMissingCategoryWithoutSavingBook() throws Exception {
        mockMvc.perform(post("/books").contentType(MediaType.APPLICATION_JSON)
                        .content(bookRequest(999, "없는 카테고리")))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail").value("존재하지 않는 카테고리입니다. categoryId=999"));

        assertThat(bookCount()).isZero();
    }

    @Test
    void rejectsDuplicateTitleWithoutCreatingSecondBook() throws Exception {
        insertBook("중복 도서", 1);

        mockMvc.perform(post("/books").contentType(MediaType.APPLICATION_JSON)
                        .content(bookRequest(2, "중복 도서")))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.detail").value("이미 등록된 도서 제목입니다."));

        assertThat(bookCount()).isEqualTo(1);
    }

    @Test
    void migrationAlsoRejectsDuplicateTitleWhenBypassingService() {
        jdbcTemplate.execute("ALTER TABLE book DROP CONSTRAINT uk_book_title");
        new ResourceDatabasePopulator(new ClassPathResource("db/book-title-unique.sql"))
                .execute(jdbcTemplate.getDataSource());
        insertBook("DB 중복 검증", 1);

        assertThatThrownBy(() -> insertBook("DB 중복 검증", 2))
                .isInstanceOf(DataIntegrityViolationException.class);
        assertThat(bookCount()).isEqualTo(1);
    }

    @Test
    void concurrentRegistrationsCreateOnlyOneBook() throws Exception {
        CyclicBarrier barrier = new CyclicBarrier(2);

        try (var executor = Executors.newFixedThreadPool(2)) {
            var first = executor.submit(() -> registerAfterBarrier(barrier));
            var second = executor.submit(() -> registerAfterBarrier(barrier));

            assertThat(List.of(first.get(10, TimeUnit.SECONDS), second.get(10, TimeUnit.SECONDS)))
                    .containsExactlyInAnyOrder(201, 409);
        }

        assertThat(bookCount()).isEqualTo(1);
    }

    @Test
    void keepsCategoryFilterAndEmptyListBehavior() throws Exception {
        insertBook("문학 도서", 1);
        insertBook("과학 도서", 2);

        mockMvc.perform(get("/books/category/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].categoryName").value("문학"));
        mockMvc.perform(get("/books/category/999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void rejectsMalformedJsonAndTooLongKeyword() throws Exception {
        mockMvc.perform(post("/books").contentType(MediaType.APPLICATION_JSON).content("{"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(get("/books").param("keyword", "a".repeat(101)))
                .andExpect(status().isBadRequest());
    }

    private int registerAfterBarrier(CyclicBarrier barrier) throws Exception {
        barrier.await(5, TimeUnit.SECONDS);
        return mockMvc.perform(post("/books").contentType(MediaType.APPLICATION_JSON)
                        .content(bookRequest(1, "동시 등록 도서")))
                .andReturn().getResponse().getStatus();
    }

    private void insertBook(String title, long categoryId) {
        jdbcTemplate.update("INSERT INTO book (category_id, title, is_available) VALUES (?, ?, TRUE)",
                categoryId, title);
    }

    private long bookCount() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM book", Long.class);
    }

    private String bookRequest(long categoryId, String title) {
        return """
                {"categoryId": %d, "title": "%s", "description": "실습 도서"}
                """.formatted(categoryId, title);
    }
}
