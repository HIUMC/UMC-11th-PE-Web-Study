import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { RatingService } from '../service/rating.service.js';
import { MemberIdPipe } from '../pipe/member-id.pipe.js';

import { PaginationPipe } from '../pipe/pagination.pipe.js';
import type { PaginationDto } from '../dto/pagination.dto.js';

@Controller('members')
export class RatingController {
  constructor(@Inject(RatingService) private readonly ratings: RatingService) {}

  @Get(':memberId/ratings')
  findByMember(
    @Param('memberId', MemberIdPipe) memberId: string,
    @Query(PaginationPipe) pagination?: PaginationDto,
  ) {
    return this.ratings.findByMember(memberId, pagination);
  }
}
