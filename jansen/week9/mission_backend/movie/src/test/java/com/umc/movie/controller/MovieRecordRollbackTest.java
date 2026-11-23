package com.umc.movie.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// 주의: 이 클래스에는 일부러 @Transactional을 붙이지 않습니다.
// 테스트 전체를 트랜잭션으로 감싸면, 서비스가 롤백한 것인지 테스트가 되돌린 것인지 구분할 수 없기 때문입니다.
// 대신 실제로 커밋된 데이터를 @AfterEach에서 직접 지웁니다.
@SpringBootTest
@AutoConfigureMockMvc
class MovieRecordRollbackTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @AfterEach
    void cleanUp() {
        ratingRepository.deleteAll();
        favoriteRepository.deleteAll();
        memberRepository.deleteAll();
    }

    @Test
    @DisplayName("즐겨찾기 저장이 실패하면 앞서 저장하려던 평점도 남지 않는다")
    void movieRecordRollbackWhenFavoriteFails() throws Exception {
        // given: 이미 즐겨찾기해 둔 영화가 있는 회원
        Member member = memberRepository.save(Member.builder()
                .email("tx@umc.com")
                .password("$2a$10$abcdefghijklmnopqrstuv")
                .nickname("트랜잭션")
                .build());
        favoriteRepository.save(Favorite.builder().member(member).movieId(550L).build());
        String authorization = "Bearer " + jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());

        long ratingCountBefore = ratingRepository.count();

        // when: 같은 영화를 addToFavorites=true로 기록하면 즐겨찾기 단계에서 실패한다
        mockMvc.perform(post("/movie-records")
                        .header(HttpHeaders.AUTHORIZATION, authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new CreateMovieRecordRequest(550L, 5, "인생 영화", true))))
                .andExpect(status().isConflict());

        // then: 예외가 났다는 것에서 멈추지 않고, 평점이 하나도 늘지 않았는지까지 확인한다
        assertThat(ratingRepository.count()).isEqualTo(ratingCountBefore);
    }
}
