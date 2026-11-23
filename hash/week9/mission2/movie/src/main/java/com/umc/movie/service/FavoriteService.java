package com.umc.movie.service;

import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.BusinessException;
import com.umc.movie.exception.ErrorCode;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoriteService {

    private final MemberRepository memberRepository;
    private final FavoriteRepository favoriteRepository;

    @Transactional
    public FavoriteResponse create(Long memberId, Long movieId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

        if (favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, movieId)) {
            throw new BusinessException(ErrorCode.DUPLICATE_FAVORITE);
        }

        return FavoriteResponse.from(favoriteRepository.saveAndFlush(new Favorite(member, movieId)));
    }

    public List<FavoriteResponse> getFavorites(Long memberId) {
        return favoriteRepository.findByMember_MemberIdOrderByCreatedAtDescFavoriteIdDesc(memberId)
                .stream()
                .map(FavoriteResponse::from)
                .toList();
    }

    public FavoriteStatusResponse getStatus(Long memberId, Long movieId) {
        return new FavoriteStatusResponse(
                favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, movieId)
        );
    }

    @Transactional
    public void delete(Long memberId, Long movieId) {
        Favorite favorite = favoriteRepository.findByMember_MemberIdAndMovieId(memberId, movieId)
                .orElseThrow(() -> new BusinessException(ErrorCode.FAVORITE_NOT_FOUND));
        favoriteRepository.delete(favorite);
    }
}