import {
  Body,
  Controller,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiMovieResult } from '../config/swagger.js';
import { LoginMember } from '../decorator/login-member.decorator.js';
import { success } from '../dto/api-response.dto.js';
import {
  CreateMovieRecordDto,
  MovieRecordResponseDto,
} from '../dto/movie-record.dto.js';
import { JwtAuthGuard } from '../guard/jwt-auth.guard.js';
import { NoQueryPipe } from '../pipe/no-query.pipe.js';
import { MovieRecordService } from '../service/movie-record.service.js';

const createdAt = '2026-11-22T00:00:00.000Z';
const message = '영화 기록을 저장했습니다.';

@ApiTags('영화 기록')
@ApiBearerAuth()
@Controller('movie-records')
@UseGuards(JwtAuthGuard)
export class MovieRecordController {
  constructor(
    @Inject(MovieRecordService) private readonly records: MovieRecordService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '평점과 선택한 즐겨찾기 저장',
    description:
      'addToFavorites가 true이면 두 행을 같은 트랜잭션으로 저장합니다. false이면 평점만 저장하고 favorite은 null입니다.',
  })
  @ApiBody({ type: CreateMovieRecordDto })
  @ApiMovieResult(
    201,
    message,
    { $ref: getSchemaPath(MovieRecordResponseDto) },
    {
      rating: {
        ratingId: 4,
        movieId: 238,
        score: 5,
        comment: '다시 보고 싶은 영화입니다.',
        createdAt,
        updatedAt: createdAt,
      },
      favorite: { favoriteId: 1, movieId: 238, createdAt },
    },
    'myMemberMissing',
    'securedRatingDuplicate',
    'favoriteDuplicate',
  )
  async create(
    @LoginMember() memberId: string,
    @Body() dto: CreateMovieRecordDto,
    @Query(NoQueryPipe) _query: void,
  ) {
    return success(
      'COMMON201',
      message,
      await this.records.create(memberId, dto),
    );
  }
}
