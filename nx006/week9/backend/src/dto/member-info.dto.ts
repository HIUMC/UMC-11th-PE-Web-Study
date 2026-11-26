import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import type { Member } from '../entity/member.entity.js';
import { CodePointLength } from './validation.decorators.js';
export class UpdateMemberDto {
  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  @CodePointLength(2, 12, { message: '닉네임은 2~12자여야 합니다.' })
  @ApiProperty({ minLength: 2, maxLength: 12, example: '영화탐험가' })
  nickname: string;
}
export class MemberInfoDto {
  @ApiProperty({
    format: 'email',
    maxLength: 254,
    example: 'learner@example.test',
  })
  email: string;
  @ApiProperty({ minLength: 2, maxLength: 12, example: '영화탐험가' })
  nickname: string;
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
  static from(member: Member): MemberInfoDto {
    return Object.assign(new MemberInfoDto(), {
      email: member.email,
      nickname: member.nickname,
      createdAt: member.createdAt,
    });
  }
}
