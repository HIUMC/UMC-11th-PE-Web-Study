import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entity/member.entity.js';
import { Rating } from '../entity/rating.entity.js';
import { RatingResponseDto } from '../dto/rating-response.dto.js';

import type { PaginationDto } from '../dto/pagination.dto.js';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Member) private readonly members: Repository<Member>,
    @InjectRepository(Rating) private readonly ratings: Repository<Rating>,
  ) {}

  async findByMember(
    memberId: string,
    pagination?: PaginationDto,
  ): Promise<RatingResponseDto[]> {
    if (!(await this.members.existsBy({ memberId }))) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    const ratings = await this.ratings.find({
      where: { memberId },
      order: { ratingId: 'DESC' },
      ...(pagination
        ? { skip: pagination.page * pagination.size, take: pagination.size }
        : {}),
    });
    return ratings.map(RatingResponseDto.from);
  }
}
