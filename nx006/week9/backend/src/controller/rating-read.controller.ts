import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { RatingService } from '../service/rating.service.js';
import { MemberIdPipe } from '../pipe/member-id.pipe.js';
import { PaginationPipe } from '../pipe/pagination.pipe.js';
import type { PaginationDto } from '../dto/pagination.dto.js';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiBusinessErrors } from '../config/swagger.js';
import { RatingResponseDto } from '../dto/rating-response.dto.js';

@ApiTags('평점')
@Controller('members')
export class RatingReadController {
  constructor(@Inject(RatingService) private readonly ratings: RatingService) {}
  @Get(':memberId/ratings')
  @ApiOperation({
    summary: '회원별 평점 공개 조회',
    description:
      '인증 없이 회원의 평점을 조회합니다. page와 size를 모두 생략하면 전체 배열을 반환합니다.',
  })
  @ApiParam({ name: 'memberId', schema: { type: 'string', example: '1' } })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '페이지 번호 (0~1000000, 기본값 0)',
  })
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
    description: '페이지당 평점 수 (1~100, 기본값 10)',
  })
  @ApiOkResponse({
    description: '기존 평점 배열 응답',
    type: RatingResponseDto,
    isArray: true,
  })
  @ApiBusinessErrors('invalid', 'memberMissing')
  findByMember(
    @Param('memberId', MemberIdPipe) memberId: string,
    @Query(PaginationPipe) pagination?: PaginationDto,
  ) {
    return this.ratings.findByMember(memberId, pagination);
  }
}
