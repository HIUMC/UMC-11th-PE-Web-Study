
import {
  ConflictException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Not, Repository } from "typeorm";

import { CheckResponseDto } from "../dto/check-response.dto.js";
import { CreateMemberDto } from "../dto/create-member.dto.js";
import { MemberInfoResponseDto } from "../dto/member-info-response.dto.js";
import { MemberUpdateRequestDto } from "../dto/member-update-request.dto.js";
import { Member } from "../entity/member.entity.js";
import { ApiException } from "../exception/api.exception.js";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async checkNickname(nickname: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.exists({
      where: { nickname },
    });
    return { available: !exists };
  }

  async checkEmail(email: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.exists({
      where: { email },
    });
    return { available: !exists };
  }

  async signUp(dto: CreateMemberDto) {
    const existingEmail = await this.memberRepository.findOneBy({
      email: dto.email,
    });

    if (existingEmail) {
      throw new ConflictException("이미 사용 중인 이메일입니다.");
    }

    const existingNickname = await this.memberRepository.findOneBy({
      nickname: dto.nickname,
    });

    if (existingNickname) {
      throw new ConflictException("이미 사용 중인 닉네임입니다.");
    }

    const savedMember = await this.memberRepository.save(
      this.memberRepository.create({
        email: dto.email,
        password: await bcrypt.hash(dto.password, 10),
        nickname: dto.nickname,
      }),
    );

    return {
      memberId: savedMember.memberId,
      email: savedMember.email,
      nickname: savedMember.nickname,
    };
  }

  // 로그인한 사용자 정보 조회
  async getMyInfo(memberId: number): Promise<MemberInfoResponseDto> {
    const member = await this.memberRepository.findOne({
      where: { memberId },
    });

    if (!member) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        "MEMBER404_1",
        "해당 회원을 찾을 수 없습니다.",
      );
    }

    return MemberInfoResponseDto.from(member);
  }

  // 로그인한 사용자 정보 수정
  async updateMyInfo(
    memberId: number,
    dto: MemberUpdateRequestDto,
  ): Promise<MemberInfoResponseDto> {
    const member = await this.memberRepository.findOne({
      where: { memberId },
    });

    if (!member) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        "MEMBER404_1",
        "해당 회원을 찾을 수 없습니다.",
      );
    }

    // 본인을 제외한 다른 회원의 닉네임 중복 확인
    const duplicated = await this.memberRepository.findOne({
      where: {
        nickname: dto.nickname,
        memberId: Not(memberId),
      },
    });

    if (duplicated) {
      throw new ApiException(
        HttpStatus.CONFLICT,
        "MEMBER409_1",
        "이미 사용 중인 닉네임입니다.",
      );
    }

    // 닉네임 수정 및 DB 저장
    member.nickname = dto.nickname;
    await this.memberRepository.save(member);

    return MemberInfoResponseDto.from(member);
  }
}
