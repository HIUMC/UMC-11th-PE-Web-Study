package com.umc.movie.service;

import com.umc.movie.dto.favorite.CreateFavoriteRequest;
import com.umc.movie.dto.favorite.FavoriteResponse;
import com.umc.movie.dto.favorite.FavoriteStatusResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final MemberRepository memberRepository;

    //로그인한 회원의 즐겨찾기에 영화를 추가
    @Transactional
    public FavoriteResponse create(Long memberId, CreateFavoriteRequest request) {
        //즐겨찾기의 주인으로 연결할 회원 조회
        //회원 없으면 404 예외
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER_404_1",
                        "해당 회원을 찾을 수 없습니다."));
        //같은 회원이 같은 영화를 이미 등록했다면 409 예외
        if (favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1",
                    "이미 이 영화를 즐겨찾기 하셨습니다.");
        }

        //회원 정보와 요청으로 받은 TMDB 영화 ID로 즐겨찾기 엔티티 생성
        Favorite favorite = Favorite.builder()
                .member(member)
                .movieId(request.movieId())
                .build();

        //DB에 저장한 엔티티를 응답 DTO로 변환
        return FavoriteResponse.from(favoriteRepository.save(favorite));
    }

    //로그인한 회원의 즐겨찾기 ID가 큰 순서대로 조회
    @Transactional(readOnly = true)
    public List<FavoriteResponse> getMyFavorites(Long memberId) {
        return favoriteRepository.findByMember_MemberIdOrderByFavoriteIdDesc(memberId).stream()
                .map(FavoriteResponse::from) //각 엔티티를 응답 DTO로 변환
                .toList();
    }

    //로그인한 회원이 해당 영화를 즐겨찾기 했는지 확인
    @Transactional(readOnly = true)
    public FavoriteStatusResponse getStatus(Long memberId, Long movieId) {
        //등록되어있으면 true, 아니면 false
        boolean isFavorite = favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, movieId);
        return new FavoriteStatusResponse(isFavorite);
    }

    //로그인한 회원의 즐겨찾기에서 해당 영화 제거
    @Transactional
    public void delete(Long memberId, Long movieId) {
        //회원 ID와 영화 ID를 함께 사용해 본인의 즐겨찾기 항목만 찾음
        //해당 항목이 없으면 404 예외르 ㄹ던짐
        Favorite favorite = favoriteRepository.findByMember_MemberIdAndMovieId(memberId, movieId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "FAVORITE404_1",
                        "즐겨찾기한 영화를 찾을 수 없습니다"));

        favoriteRepository.delete(favorite);
    }
}
