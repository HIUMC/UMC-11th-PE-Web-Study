import type { ApiResponse } from "../../types/api";
import { authApi } from "../auth-api";
import type {
  CreateRatingRequest,
  MemberRatingsPage,
  Rating,
  UpdateRatingRequest,
} from "../../types/rating";

type GetMemberRatingsResponse = MemberRatingsPage;
type SaveRatingResponse = ApiResponse<Rating>;
type DeleteRatingResponse = ApiResponse<null>;

//평점 받아오기
function getMemberRatings(memberId: number, page = 0, size = 10) {
  // 회원의 평점 목록을 페이지 단위로 조회
  return authApi
    .get(`members/${memberId}/ratings`, {
      searchParams: { page, size },
    })
    .json<GetMemberRatingsResponse>();
}

//평점 생성
function createRating(body: CreateRatingRequest) {
  // 작성자 ID는 서버가 JWT에서 읽으므로 본문에는 영화 ID와 입력값만 보냄
  return authApi.post("ratings", { json: body }).json<SaveRatingResponse>();
}

//평점 갱신
function updateRating(ratingId: number, body: UpdateRatingRequest) {
  // 영화 ID가 아닌, 저장된 평점의 ratingId로 수정 대상을 지정
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<SaveRatingResponse>();
}

//평점 삭제
function deleteRating(ratingId: number) {
  // 현재 컨트롤러는 200과 성공 메시지가 담긴 JSON을 반환
  return authApi.delete(`ratings/${ratingId}`).json<DeleteRatingResponse>();
}

export { getMemberRatings, createRating, updateRating, deleteRating };
