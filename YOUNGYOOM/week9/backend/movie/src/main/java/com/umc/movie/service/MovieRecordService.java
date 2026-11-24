package com.umc.movie.service;

import com.umc.movie.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.favorite.FavoriteResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MovieRecordService {
    private final MemberRepository memberRepository;
    private final RatingRepository ratingRepository;
    private final FavoriteRepository favoriteRepository;

    //평점 등록하고, 요청에 따라 즐겨찾기도 같은 트랜잭션에서 등록함
    @Transactional
    public MovieRecordResponse create(Long memberId, CreateMovieRecordRequest request) {
        //평점과 즐겨찾기에 연결할 회원 조회
        //회원이 없으면 404 예외
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "RATING404_1",
                        "해당 회원을 찾을 수 없습니다."));

        //같은 회원이 같은 영화에 이미 평점을 남겼으면 409 예외를 던짐
        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(HttpStatus.CONFLICT, "RATING409_1", "이미 이 영화에 평점을 남겼습니다.");
        }

        //즐겨찾기 추가를 요청한 경우에만 기존 등록 여부를 확인함
        //이미 등록되어 있으면 평점을 저장하기 전에 409 예외를 던짐
        if (request.addToFavorites()
                && favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1",
                    "이미 이 영화를 즐겨찾기 하였습니다.");
        }

        //로그인한 회원과 요청으로 받은 영화 ID, 별점, 코멘트로 평점을 생성해 저장
        Rating rating = Rating.builder()
                .member(member)
                .movieId(request.movieId())
                .score(request.score())
                .comment(request.comment())
                .build();
        Rating savedRating = ratingRepository.save(rating);

        //즐겨찾기를 추가한 경우에만 저장한 항목을 응답 DTO로 변환
        FavoriteResponse favoriteResponse = null;
        if (request.addToFavorites()) {
            if (favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
                throw new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1",
                        "이미 이 영화를 즐겨찾기 하였습니다.");
            }
            Favorite favorite = Favorite.builder()
                    .member(member)
                    .movieId(request.movieId())
                    .build();
            //즐겨찾기 항목을 DB에 저장
            Favorite savedFavorite = favoriteRepository.save(favorite);
            //저장된 객체에서 favoriteId, movieId, createdAt을 꺼내서 응답용 DTO를 만듦
            favoriteResponse = FavoriteResponse.from(savedFavorite);
        }

        //저장한 평점과 선택적으로 추가한 즐겨찾기 정보를 함께 반환
        return new MovieRecordResponse(
                RatingResponse.from(savedRating),
                favoriteResponse
        );
    }
}
