import { HttpException } from '@nestjs/common';

export const ERRORS = {
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
