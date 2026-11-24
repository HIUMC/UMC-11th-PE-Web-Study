package com.umc.movie.service;

import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public FavoriteResponse create(Long memberId, CreateFavoriteRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."));

        if (favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw duplicateFavorite();
        }

        Favorite favorite = Favorite.builder()
                .member(member)
                .movieId(request.movieId())
                .build();

        try {
            return FavoriteResponse.from(favoriteRepository.save(favorite));
        } catch (DataIntegrityViolationException exception) {
            if (exception.getCause() instanceof ConstraintViolationException violation
                    && violation.getKind() == ConstraintViolationException.ConstraintKind.UNIQUE) {
                throw duplicateFavorite();
            }
            throw exception;
        }
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponse> getMyFavorites(Long memberId) {
        return favoriteRepository.findByMember_MemberIdOrderByFavoriteIdDesc(memberId).stream()
                .map(FavoriteResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public FavoriteStatusResponse getStatus(Long memberId, Long movieId) {
        boolean isFavorite = favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, movieId);
        return new FavoriteStatusResponse(isFavorite);
    }

    @Transactional
    public void delete(Long memberId, Long movieId) {
        if (favoriteRepository.deleteByMemberAndMovie(memberId, movieId) == 0) {
            throw new ApiException(HttpStatus.NOT_FOUND, "FAVORITE404_1",
                    "즐겨찾기한 영화를 찾을 수 없습니다.");
        }
    }

    private ApiException duplicateFavorite() {
        return new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1",
                "이미 이 영화를 즐겨찾기하셨습니다.");
    }
}
