import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
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
import { ApiMovieResult, nullResult } from '../config/swagger.js';

const ratingIdParam = () =>
  ApiParam({
    name: 'ratingId',
    description: '평점 ID',
    schema: { type: 'string', pattern: '^[0-9]+$', example: '1' },
  });

@ApiTags('평점')
@Controller('ratings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RatingController {
  constructor(@Inject(RatingService) private readonly ratings: RatingService) {}
  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: '평점 등록',
    description: 'Bearer 토큰의 회원으로 영화 평점을 등록합니다.',
  })
  @ApiMovieResult(
    201,
    '평점을 등록했습니다.',
    { type: 'integer', minimum: 1 },
    1,
    'myMemberMissing',
    'securedRatingDuplicate',
  )
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
  @ApiOperation({
    summary: '내 평점 수정',
    description: 'Bearer 토큰을 사용해 본인이 작성한 평점을 수정합니다.',
  })
  @ratingIdParam()
  @ApiMovieResult(
    200,
    '평점을 수정했습니다.',
    nullResult,
    null,
    'securedRatingMissing',
    'securedRatingForbidden',
  )
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
  @ApiOperation({
    summary: '내 평점 삭제',
    description: 'Bearer 토큰을 사용해 본인이 작성한 평점을 삭제합니다.',
  })
  @ratingIdParam()
  @ApiMovieResult(
    200,
    '평점을 삭제했습니다.',
    nullResult,
    null,
    'securedRatingMissing',
    'securedRatingForbidden',
  )
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
