package com.umc.movie.controller;

import com.umc.movie.repository.MemberRepository;
import com.umc.movie.service.MemberService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class MemberControllerTest {
    private MemberRepository repository;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        repository = mock(MemberRepository.class);
        mvc = MockMvcBuilders.standaloneSetup(
                new MemberController(new MemberService(repository))).build();
    }

    @Test
    void returnsTrueWhenBothValuesMatchOneMember() throws Exception {
        when(repository.existsByNicknameAndEmail("cinema", "cinema@example.com")).thenReturn(true);

        mvc.perform(post("/members/check").contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nickname":"cinema","email":"cinema@example.com"}
                                """))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"matched\":true}"));
        verify(repository).existsByNicknameAndEmail("cinema", "cinema@example.com");
        verifyNoMoreInteractions(repository);
    }

    @Test
    void separatelyExistingValuesDoNotCountAsAMatch() throws Exception {
        when(repository.existsByNickname("cinema")).thenReturn(true);
        when(repository.existsByEmail("other@example.com")).thenReturn(true);
        when(repository.existsByNicknameAndEmail("cinema", "other@example.com")).thenReturn(false);

        mvc.perform(post("/members/check").contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nickname":"cinema","email":"other@example.com"}
                                """))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"matched\":false}"));
        verify(repository).existsByNicknameAndEmail("cinema", "other@example.com");
        verifyNoMoreInteractions(repository);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "{}",
            "{\"nickname\":\"   \",\"email\":\"cinema@example.com\"}",
            "{\"nickname\":\"cinema\",\"email\":\"\"}",
            "{\"nickname\":\"cinema\",\"email\":\"not-an-email\"}",
            "{\"nickname\":null,\"email\":null}",
            "not-json"
    })
    void rejectsInvalidInputBeforeQueryingDatabase(String body) throws Exception {
        mvc.perform(post("/members/check").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
        verifyNoInteractions(repository);
    }

    @Test
    void rejectsNicknameLongerThanDatabaseColumn() throws Exception {
        String body = "{\"nickname\":\"" + "a".repeat(51) + "\",\"email\":\"cinema@example.com\"}";
        mvc.perform(post("/members/check").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
        verifyNoInteractions(repository);
    }
}
