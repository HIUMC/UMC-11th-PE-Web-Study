import {
  IsByteLength,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { CodePointLength } from './validation.decorators.js';

export class CreateMemberDto {
  @IsString({ message: '이메일은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @MaxLength(254, { message: '이메일은 254자 이하여야 합니다.' })
  email: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
    message:
      '비밀번호는 대문자/소문자/숫자/특수문자(!@#$%^&*)를 포함한 8자 이상이어야 합니다.',
  })
  @IsByteLength(0, 72, {
    message: '비밀번호는 UTF-8 기준 72바이트 이하여야 합니다.',
  })
  password: string;

  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  @CodePointLength(2, 12, { message: '닉네임은 2~12자여야 합니다.' })
  nickname: string;
}
