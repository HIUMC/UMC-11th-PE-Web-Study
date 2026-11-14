import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { Member } from '../entity/member.entity.js';
import type { LoginDto } from '../dto/login.dto.js';
import { ApiException } from '../filter/errors.js';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member) private readonly members: Repository<Member>,
    @Inject(JwtService) private readonly jwt: JwtService,
  ) {}
  async login(dto: LoginDto) {
    const member = await this.members
      .createQueryBuilder('member')
      .addSelect('member.password')
      .where('member.email = :email', { email: dto.email })
      .getOne();
    // Prevent bcrypt's >72-byte password aliases; login does not reapply complexity rules.
    if (
      !member ||
      Buffer.byteLength(dto.password, 'utf8') > 72 ||
      !(await bcrypt.compare(dto.password, member.password))
    )
      throw new ApiException('authCredentials');
    return {
      nickname: member.nickname,
      accessToken: await this.jwt.signAsync({ sub: String(member.memberId) }),
    };
  }
}
