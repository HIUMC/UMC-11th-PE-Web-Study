import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Member } from '../entity/member.entity.js';
import { CheckResponseDto } from '../dto/check-response.dto.js';
import bcrypt from 'bcrypt';
import type { CreateMemberDto } from '../dto/create-member.dto.js';
import { MemberResponseDto } from '../dto/member-response.dto.js';
import { ApiException } from '../filter/errors.js';
import { MemberInfoDto, type UpdateMemberDto } from '../dto/member-info.dto.js';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private readonly members: Repository<Member>,
  ) {}

  async checkNickname(nickname: string): Promise<CheckResponseDto> {
    return new CheckResponseDto(!(await this.members.existsBy({ nickname })));
  }

  async checkEmail(email: string): Promise<CheckResponseDto> {
    return new CheckResponseDto(!(await this.members.existsBy({ email })));
  }

  async signUp(dto: CreateMemberDto): Promise<MemberResponseDto> {
    if (await this.members.existsBy({ email: dto.email }))
      throw new ApiException('emailDuplicate');
    if (await this.members.existsBy({ nickname: dto.nickname }))
      throw new ApiException('nicknameDuplicate');
    const password = await bcrypt.hash(dto.password, 10);
    const member = this.members.create({
      email: dto.email,
      password,
      nickname: dto.nickname,
    });
    return MemberResponseDto.from(await this.members.save(member));
  }

  async myInfo(memberId: string): Promise<MemberInfoDto> {
    const member = await this.members.findOneBy({ memberId });
    if (!member) throw new ApiException('myMemberMissing');
    return MemberInfoDto.from(member);
  }

  async updateMyInfo(
    memberId: string,
    dto: UpdateMemberDto,
  ): Promise<MemberInfoDto> {
    const member = await this.members.findOneBy({ memberId });
    if (!member) throw new ApiException('myMemberMissing');
    if (
      await this.members.existsBy({
        nickname: dto.nickname,
        memberId: Not(memberId),
      })
    )
      throw new ApiException('myNicknameDuplicate');
    member.nickname = dto.nickname;
    return MemberInfoDto.from(await this.members.save(member));
  }
}
