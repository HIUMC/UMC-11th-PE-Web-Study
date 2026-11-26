import { ApiProperty } from '@nestjs/swagger';
import type { Member } from '../entity/member.entity.js';
import { safeId } from './rating-response.dto.js';

export class MemberResponseDto {
  @ApiProperty({ type: 'integer', minimum: 1, example: 1 })
  memberId: number;
  @ApiProperty({
    format: 'email',
    maxLength: 254,
    example: 'learner@example.test',
  })
  email: string;
  @ApiProperty({ minLength: 2, maxLength: 12, example: '영화탐험가' })
  nickname: string;

  static from(member: Member): MemberResponseDto {
    return Object.assign(new MemberResponseDto(), {
      memberId: safeId(member.memberId),
      email: member.email,
      nickname: member.nickname,
    });
  }
}
