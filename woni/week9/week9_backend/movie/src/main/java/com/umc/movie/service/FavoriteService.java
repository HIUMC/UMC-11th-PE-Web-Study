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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    // Repository 객체는 스프링이 만들어서 주입해 줌 (우리가 new 하지 않음)
    private final FavoriteRepository favoriteRepository;
    private final MemberRepository memberRepository;

    // 이 메서드 안의 DB 작업을 한 묶음으로 처리. 예외가 나면 저장된 것을 되돌림
    // 이 메서드를 호출하는 주체는 Controller (favoriteService.create(...))
    @Transactional
    public FavoriteResponse create(Long memberId, CreateFavoriteRequest request) {

        // [단계 1] 회원 찾기
        // db에 있는 회원 행을 읽어서 JPA가 Member 객체로 가져온 것
        // findById의 반환 타입은 Optional<Member> (회원이 있을 수도 없을 수도 있다는 상자)
        // orElseThrow: 값이 있으면 꺼내고, 없으면 예외를 던짐
        // () -> new ApiException(...) 은 람다. 상자가 비어 있을 때만 실행됨
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."));

        // [단계 2] 중복 검사
        // 이 회원이 이 영화를 이미 즐겨찾기했는지 true/false로 돌려받음
        // 메서드 구현은 없음. 이름을 보고 Spring Data JPA가 자동으로 만들어 줌
        // request.movieId() : record라서 getMovieId()가 아니라 필드 이름 그대로 꺼냄
       if (favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
           // throw가 실행되면 여기서 메서드가 즉시 끝남 (아래 저장 코드는 실행되지 않음)         // Controller의 return에도 닿지 않고, 예외 처리기가 응답을 만듦
           throw new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1",
                   "이미 이 영화를 즐겨찾기하셨습니다.");
      }

        // [단계 3] 저장할 엔티티 객체 만들기
        // 새로 저장할 때 우리가 만든 것. 즐겨찾기는 아직 db에 없는 "새 데이터" (메모리에만 있음)
        // 빌더는 생성자를 이름을 붙여서 호출하는 방법
        // favoriteId, createdAt은 넣지 않음. db가 insert할 때 채워 줌
        Favorite favorite = Favorite.builder()
                .member(member)               // db에서 읽어온 Member 엔티티
                .movieId(request.movieId())   // 요청 dto에서 필요한 값 하나만 꺼낸 것
                .build();

        // [단계 4] 저장하고 응답용 dto로 바꾸기
        // 안쪽부터 읽기: save()가 실행되는 순간 db에 insert가 실행됨
        //   -> db가 부여한 favoriteId가 채워진 Favorite을 돌려받음
        // 바깥쪽: FavoriteResponse.from()이 엔티티에서 응답에 필요한 값만 뽑아 dto로 변환
        // 이 값이 Controller로 돌아가 ApiResponse, ResponseEntity로 포장됨
        return FavoriteResponse.from(favoriteRepository.save(favorite));
    }

    /*----------------------------------------------------------------------------------------*/
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
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "FAVORITE404_1",
                        "즐겨찾기한 영화를 찾을 수 없습니다."));

        favoriteRepository.delete(favorite);
    }
}
