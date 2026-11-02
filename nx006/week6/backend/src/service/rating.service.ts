import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entity/member.entity.js';
import { Rating } from '../entity/rating.entity.js';
import { RatingResponseDto } from '../dto/rating-response.dto.js';

import type { PaginationDto } from '../dto/pagination.dto.js';
import type {
  CreateRatingDto,
  UpdateRatingDto,
} from '../dto/create-rating.dto.js';
import { safeId } from '../dto/rating-response.dto.js';
import { ApiException } from '../filter/errors.js';

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
      throw new ApiException('memberMissing');
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

  async create(memberId: string, dto: CreateRatingDto): Promise<number> {
    if (!(await this.members.existsBy({ memberId })))
      throw new ApiException('memberMissing');
    const movieId = String(dto.movieId);
    if (await this.ratings.existsBy({ memberId, movieId }))
      throw new ApiException('ratingDuplicate');
    const rating = this.ratings.create({
      memberId,
      member: { memberId },
      movieId,
      score: dto.score,
      comment: dto.comment ?? null,
    });
    return safeId((await this.ratings.save(rating)).ratingId);
  }

  private async owned(memberId: string, ratingId: string): Promise<Rating> {
    const rating = await this.ratings.findOneBy({ ratingId });
    if (!rating) throw new ApiException('ratingMissing');
    if (String(rating.memberId) !== memberId)
      throw new ApiException('ratingForbidden');
    return rating;
  }

  async update(
    memberId: string,
    ratingId: string,
    dto: UpdateRatingDto,
  ): Promise<void> {
    const rating = await this.owned(memberId, ratingId);
    rating.score = dto.score;
    rating.comment = dto.comment ?? null;
    await this.ratings.save(rating);
  }

  async remove(memberId: string, ratingId: string): Promise<void> {
    const rating = await this.owned(memberId, ratingId);
    await this.ratings.remove(rating);
  }
}
