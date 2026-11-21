import type { Member } from '../entity/member.entity.js';
import { safeId } from './rating-response.dto.js';

export class MemberResponseDto {
  memberId: number;
  email: string;
  nickname: string;

  static from(member: Member): MemberResponseDto {
    return Object.assign(new MemberResponseDto(), {
      memberId: safeId(member.memberId),
      email: member.email,
      nickname: member.nickname,
    });
  }
}
