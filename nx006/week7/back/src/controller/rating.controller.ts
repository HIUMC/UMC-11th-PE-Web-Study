import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RatingService } from '../service/rating.service.js';
import { RatingIdPipe } from '../pipe/rating-id.pipe.js';
import { NoQueryPipe } from '../pipe/no-query.pipe.js';
import { CreateRatingDto, UpdateRatingDto } from '../dto/create-rating.dto.js';
import { success } from '../dto/api-response.dto.js';
import { JwtAuthGuard } from '../guard/jwt-auth.guard.js';
import { LoginMember } from '../decorator/login-member.decorator.js';
@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingController {
  constructor(@Inject(RatingService) private readonly ratings: RatingService) {}
  @Post()
  @HttpCode(201)
  async create(
    @LoginMember() memberId: string,
    @Body() dto: CreateRatingDto,
    @Query(NoQueryPipe) _query: void,
  ) {
    return success(
      'COMMON201',
      '평점을 등록했습니다.',
      await this.ratings.create(memberId, dto),
    );
  }
  @Patch(':ratingId')
  @HttpCode(200)
  async update(
    @LoginMember() memberId: string,
    @Param('ratingId', RatingIdPipe) ratingId: string,
    @Body() dto: UpdateRatingDto,
    @Query(NoQueryPipe) _query: void,
  ) {
    await this.ratings.update(memberId, ratingId, dto);
    return success('COMMON200', '평점을 수정했습니다.', null);
  }
  @Delete(':ratingId')
  @HttpCode(200)
  async remove(
    @LoginMember() memberId: string,
    @Param('ratingId', RatingIdPipe) ratingId: string,
    @Query(NoQueryPipe) _query: void,
  ) {
    await this.ratings.remove(memberId, ratingId);
    return success('COMMON200', '평점을 삭제했습니다.', null);
  }
}
