import { HttpException } from '@nestjs/common';

export const ERRORS = {
  authCredentials: {
    status: 401,
    code: 'AUTH401_1',
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
  authMissing: {
    status: 401,
    code: 'AUTH401_2',
    message: '로그인이 필요한 요청입니다.',
  },
  authInvalid: {
    status: 401,
    code: 'AUTH401_3',
    message: '유효하지 않은 토큰입니다.',
  },
  authExpired: {
    status: 401,
    code: 'AUTH401_4',
    message: '토큰이 만료되었습니다. 다시 로그인해주세요.',
  },
  myMemberMissing: {
    status: 404,
    code: 'MEMBER404_1',
    message: '해당 회원을 찾을 수 없습니다.',
  },
  myNicknameDuplicate: {
    status: 409,
    code: 'MEMBER409_1',
    message: '이미 사용 중인 닉네임입니다.',
  },
  securedRatingDuplicate: {
    status: 409,
    code: 'RATING409_1',
    message: '이미 이 영화에 평점을 남기셨습니다.',
  },
  securedRatingMissing: {
    status: 404,
    code: 'RATING404_1',
    message: '해당 평점을 찾을 수 없습니다.',
  },
  securedRatingForbidden: {
    status: 403,
    code: 'RATING403_1',
    message: '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.',
  },
  emailDuplicate: {
    status: 409,
    code: 'MEMBER4091',
    message: '이미 사용 중인 이메일입니다.',
  },
  nicknameDuplicate: {
    status: 409,
    code: 'MEMBER4092',
    message: '이미 사용 중인 닉네임입니다.',
  },
  memberMissing: {
    status: 404,
    code: 'MEMBER4041',
    message: '존재하지 않는 유저입니다.',
  },
  ratingDuplicate: {
    status: 409,
    code: 'RATING4091',
    message: '이미 이 영화에 평점을 남기셨습니다.',
  },
  ratingMissing: {
    status: 404,
    code: 'RATING4041',
    message: '존재하지 않는 평점입니다.',
  },
  ratingForbidden: {
    status: 403,
    code: 'RATING4031',
    message: '다른 회원의 평점은 변경할 수 없습니다.',
  },
  invalid: {
    status: 400,
    code: 'COMMON400',
    message: '입력값을 확인해주세요.',
  },
  internal: {
    status: 500,
    code: 'COMMON500',
    message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  },
} as const;

export type ErrorKey = keyof typeof ERRORS;
export class ApiException extends HttpException {
  constructor(key: ErrorKey) {
    const error = ERRORS[key];
    super({ code: error.code, message: error.message }, error.status);
  }
}
