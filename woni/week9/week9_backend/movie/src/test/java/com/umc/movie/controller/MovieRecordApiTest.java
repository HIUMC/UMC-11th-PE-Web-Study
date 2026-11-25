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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.willReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 영화 기록 저장(평점 + 즐겨찾기)이 실패했을 때 앞서 저장한 평점까지 되돌려지는지 확인합니다.
 *
 * 클래스에 @Transactional을 붙이지 않습니다.
 * 붙이면 테스트 전체가 하나의 트랜잭션으로 묶여 끝날 때 무조건 롤백되므로,
 * 서비스의 @Transactional이 롤백한 것인지 테스트가 롤백한 것인지 구분할 수 없습니다.
 * 대신 요청은 실제로 커밋되고, 데이터는 @BeforeEach/@AfterEach에서 직접 지웁니다.
 */
@SpringBootTest        // 진짜 서버를 띄우듯 모든 Bean을 올립니다
@AutoConfigureMockMvc  // HTTP 요청을 흉내 내는 MockMvc를 준비합니다
class MovieRecordApiTest {

    private static final long MOVIE_ID = 238L;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper; // 객체를 JSON 문자열로 바꿔줍니다

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RatingRepository ratingRepository;

    // 평소에는 진짜 Repository처럼 동작하고, 필요한 메서드만 바꿔 끼울 수 있는 스파이입니다.
    // 두 번째 테스트에서 "중복 검사는 통과했지만 저장에서 실패하는" 상황을 만들 때만 사용합니다.
    @MockitoSpyBean
    private FavoriteRepository favoriteRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private Member member;
    private String authorizationHeader;

    @BeforeEach
    void setUp() {
        // 이전 테스트가 남긴 데이터가 있으면 지우고 시작합니다 (외래 키 때문에 자식 테이블부터)
        cleanUp();

        // 로그인한 회원을 저장하고 토큰을 직접 발급합니다.
        member = memberRepository.save(Member.builder()
                .email("record@umc.com")
                .password("$2a$10$abcdefghijklmnopqrstuv") // 로그인 API를 거치지 않으므로 아무 값이나 괜찮습니다
                .nickname("기록왕")
                .build());

        authorizationHeader = "Bearer " + jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());

        // 이 회원은 238번 영화를 이미 즐겨찾기해 둔 상태입니다.
        favoriteRepository.save(Favorite.builder().member(member).movieId(MOVIE_ID).build());
    }

    @AfterEach
    void tearDown() {
        // 클래스에 @Transactional이 없어 요청이 실제로 커밋되므로 직접 지웁니다.
        cleanUp();
    }

    private void cleanUp() {
        favoriteRepository.deleteAll();
        ratingRepository.deleteAll();
        memberRepository.deleteAll();
    }

    @Test
    @DisplayName("이미 즐겨찾기한 영화에 즐겨찾기 추가를 포함해 기록하면 409 FAVORITE409_1로 실패하고 평점이 남지 않는다")
    void createMovieRecordWhenFavoriteDuplicated() throws Exception {
        // given: 요청 전 평점 개수를 기억해 둔다
        long ratingCountBefore = ratingRepository.count();
        CreateMovieRecordRequest request = new CreateMovieRecordRequest(MOVIE_ID, 5, "다시 보고 싶은 영화입니다.", true);

        // when: 이미 즐겨찾기한 영화에 addToFavorites true로 영화 기록을 저장하면
        mockMvc.perform(post("/movie-records")
                        .header(HttpHeaders.AUTHORIZATION, authorizationHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                // then: 409와 FAVORITE409_1로 실패하고
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("FAVORITE409_1"));

        // then: 평점 개수가 요청 전과 같고, 이 영화에 대한 평점도 남아 있지 않다
        assertThat(ratingRepository.count()).isEqualTo(ratingCountBefore);
        assertThat(ratingRepository.existsByMember_MemberIdAndMovieId(member.getMemberId(), MOVIE_ID)).isFalse();
        // 즐겨찾기는 원래 있던 1개 그대로다
        assertThat(favoriteRepository.count()).isEqualTo(1L);
    }

    @Test
    @DisplayName("평점 저장 뒤 즐겨찾기 저장에서 실패하면 먼저 저장한 평점까지 롤백된다")
    void rollbackRatingWhenFavoriteSaveFails() throws Exception {
        // given: 중복 검사는 "아직 즐겨찾기 안 함"으로 통과시키고, 실제 DB에는 즐겨찾기가 이미 있는 상황
        // (두 요청이 동시에 들어와 둘 다 중복 검사를 통과한 경우를 흉내 냅니다)
        // 그러면 서비스는 평점을 먼저 INSERT한 뒤, 즐겨찾기 INSERT에서 UNIQUE 제약 위반으로 실패합니다.
        willReturn(false).given(favoriteRepository)
                .existsByMember_MemberIdAndMovieId(member.getMemberId(), MOVIE_ID);

        long ratingCountBefore = ratingRepository.count();
        CreateMovieRecordRequest request = new CreateMovieRecordRequest(MOVIE_ID, 5, "다시 보고 싶은 영화입니다.", true);

        // when: 영화 기록을 저장하면
        mockMvc.perform(post("/movie-records")
                        .header(HttpHeaders.AUTHORIZATION, authorizationHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                // then: 즐겨찾기 UNIQUE 제약 위반이 GlobalExceptionHandler에서 409 COMMON4091로 바뀌어 응답되고
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4091"));

        // then: 이미 INSERT 되었던 평점까지 롤백되어 개수가 요청 전과 같다
        // (서비스의 @Transactional을 지우면 평점이 커밋된 채 남아 이 검증이 실패합니다)
        assertThat(ratingRepository.count()).isEqualTo(ratingCountBefore);
        assertThat(ratingRepository.existsByMember_MemberIdAndMovieId(member.getMemberId(), MOVIE_ID)).isFalse();
    }
}
