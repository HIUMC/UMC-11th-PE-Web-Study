import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    format: 'email',
    maxLength: 254,
    example: 'learner@example.test',
  })
  email: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
    message:
      '비밀번호는 대문자/소문자/숫자/특수문자(!@#$%^&*)를 포함한 8자 이상이어야 합니다.',
  })
  @IsByteLength(0, 72, {
    message: '비밀번호는 UTF-8 기준 72바이트 이하여야 합니다.',
  })
  @ApiProperty({
    format: 'password',
    writeOnly: true,
    example: 'StudyExample1!',
    minLength: 8,
    description: '대소문자, 숫자, 지정 특수문자 포함. UTF-8 72바이트 이하.',
  })
  password: string;

  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  @CodePointLength(2, 12, { message: '닉네임은 2~12자여야 합니다.' })
  @ApiProperty({ minLength: 2, maxLength: 12, example: '영화탐험가' })
  nickname: string;
}
