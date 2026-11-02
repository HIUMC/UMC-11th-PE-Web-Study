import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RatingService } from '../service/rating.service.js';
import { MemberIdPipe } from '../pipe/member-id.pipe.js';

import { PaginationPipe } from '../pipe/pagination.pipe.js';
import type { PaginationDto } from '../dto/pagination.dto.js';
import { RatingIdPipe } from '../pipe/rating-id.pipe.js';
import { CreateRatingDto, UpdateRatingDto } from '../dto/create-rating.dto.js';
import { success } from '../dto/api-response.dto.js';

@Controller('members')
export class RatingController {
  constructor(@Inject(RatingService) private readonly ratings: RatingService) {}

  @Post(':memberId/ratings')
  @HttpCode(201)
  async create(
    @Param('memberId', MemberIdPipe) memberId: string,
    @Body() dto: CreateRatingDto,
  ) {
    return success(
      'COMMON201',
      '평점 등록에 성공했습니다.',
      await this.ratings.create(memberId, dto),
    );
  }

  @Patch(':memberId/ratings/:ratingId')
  @HttpCode(200)
  async update(
    @Param('memberId', MemberIdPipe) memberId: string,
    @Param('ratingId', RatingIdPipe) ratingId: string,
    @Body() dto: UpdateRatingDto,
  ) {
    await this.ratings.update(memberId, ratingId, dto);
    return success('COMMON200', '평점 수정에 성공했습니다.', null);
  }

  @Delete(':memberId/ratings/:ratingId')
  @HttpCode(204)
  async remove(
    @Param('memberId', MemberIdPipe) memberId: string,
    @Param('ratingId', RatingIdPipe) ratingId: string,
  ): Promise<void> {
    await this.ratings.remove(memberId, ratingId);
  }

  @Get(':memberId/ratings')
  findByMember(
    @Param('memberId', MemberIdPipe) memberId: string,
    @Query(PaginationPipe) pagination?: PaginationDto,
  ) {
    return this.ratings.findByMember(memberId, pagination);
  }
}
