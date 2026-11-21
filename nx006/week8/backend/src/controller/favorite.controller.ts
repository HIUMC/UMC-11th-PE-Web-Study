import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
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
import { ApiMovieId, ApiMovieResult } from '../config/swagger.js';
import { LoginMember } from '../decorator/login-member.decorator.js';
import { success } from '../dto/api-response.dto.js';
import {
  CreateFavoriteDto,
  FavoriteResponseDto,
  FavoriteStatusDto,
} from '../dto/favorite.dto.js';
import { JwtAuthGuard } from '../guard/jwt-auth.guard.js';
import { MovieIdPipe } from '../pipe/movie-id.pipe.js';
import { NoQueryPipe } from '../pipe/no-query.pipe.js';
import { FavoriteService } from '../service/favorite.service.js';

const favoriteExample = {
  favoriteId: 1,
  movieId: 238,
  createdAt: '2026-11-22T00:00:00.000Z',
};
const favoriteSchema = { $ref: getSchemaPath(FavoriteResponseDto) };
const messages = {
  create: '즐겨찾기를 등록했습니다.',
  list: '즐겨찾기 목록을 조회했습니다.',
  status: '즐겨찾기 여부를 조회했습니다.',
  remove: '즐겨찾기를 해제했습니다.',
};

@ApiTags('즐겨찾기')
@ApiBearerAuth()
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  constructor(
    @Inject(FavoriteService) private readonly favorites: FavoriteService,
  ) {}

  @Post()
  @ApiOperation({ summary: '내 즐겨찾기 등록' })
  @ApiBody({ type: CreateFavoriteDto })
  @ApiMovieResult(
    201,
    messages.create,
    favoriteSchema,
    favoriteExample,
    'myMemberMissing',
    'favoriteDuplicate',
  )
  async create(
    @LoginMember() memberId: string,
    @Body() dto: CreateFavoriteDto,
    @Query(NoQueryPipe) _query: void,
  ) {
    return success(
      'COMMON201',
      messages.create,
      await this.favorites.create(memberId, String(dto.movieId)),
    );
  }

  @Get()
  @ApiOperation({
    summary: '내 즐겨찾기 목록',
    description:
      'favoriteId 내림차순으로 조회합니다. 등록한 영화가 없으면 빈 배열을 반환합니다.',
  })
  @ApiMovieResult(
    200,
    messages.list,
    { type: 'array', items: favoriteSchema },
    [favoriteExample],
  )
  async list(
    @LoginMember() memberId: string,
    @Query(NoQueryPipe) _query: void,
  ) {
    return success(
      'COMMON200',
      messages.list,
      await this.favorites.list(memberId),
    );
  }

  @Get(':movieId')
  @ApiOperation({ summary: '내 즐겨찾기 여부' })
  @ApiMovieId()
  @ApiMovieResult(
    200,
    messages.status,
    { $ref: getSchemaPath(FavoriteStatusDto) },
    { isFavorite: true },
  )
  async status(
    @LoginMember() memberId: string,
    @Param('movieId', MovieIdPipe) movieId: string,
    @Query(NoQueryPipe) _query: void,
  ) {
    return success(
      'COMMON200',
      messages.status,
      await this.favorites.status(memberId, movieId),
    );
  }

  @Delete(':movieId')
  @HttpCode(200)
  @ApiOperation({ summary: '내 즐겨찾기 해제' })
  @ApiMovieId()
  @ApiMovieResult(
    200,
    messages.remove,
    { type: 'object', nullable: true, enum: [null] },
    null,
    'favoriteMissing',
  )
  async remove(
    @LoginMember() memberId: string,
    @Param('movieId', MovieIdPipe) movieId: string,
    @Query(NoQueryPipe) _query: void,
  ) {
    await this.favorites.remove(memberId, movieId);
    return success('COMMON200', messages.remove, null);
  }
}
