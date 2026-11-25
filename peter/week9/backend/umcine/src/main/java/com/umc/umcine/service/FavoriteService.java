package com.umc.umcine.service;

import com.umc.umcine.dto.CreateFavoriteRequest;
import com.umc.umcine.dto.FavoriteResponse;
import com.umc.umcine.dto.FavoriteStatusResponse;
import com.umc.umcine.entity.Favorite;
import com.umc.umcine.entity.Member;
import com.umc.umcine.exception.ApiException;
import com.umc.umcine.exception.MemberErrorCode;
import com.umc.umcine.exception.FavoriteErrorCode;
import com.umc.umcine.repository.FavoriteRepository;
import com.umc.umcine.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
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
                .orElseThrow(() -> new ApiException(MemberErrorCode.NOT_FOUND));

        if (favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(FavoriteErrorCode.DUPLICATE_FAVORITE);
        }

        Favorite favorite = Favorite.builder()
                .member(member)
                .movieId(request.movieId())
                .build();

        return FavoriteResponse.from(favoriteRepository.save(favorite));
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
        Favorite favorite = favoriteRepository.findByMember_MemberIdAndMovieId(memberId, movieId)
                .orElseThrow(() -> new ApiException(FavoriteErrorCode.NOT_FOUND));

        favoriteRepository.delete(favorite);
    }
}
