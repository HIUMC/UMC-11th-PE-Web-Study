import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { CreateRatingDto } from './create-rating.dto.js';
import { FavoriteResponseDto } from './favorite.dto.js';
import { RatingResponseDto } from './rating-response.dto.js';

export class CreateMovieRecordDto extends CreateRatingDto {
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'false이면 평점만 저장합니다.',
  })
  @IsBoolean({ message: 'addToFavorites는 boolean이어야 합니다.' })
  addToFavorites: boolean;
}

export class MovieRecordResponseDto {
  @ApiProperty({ type: RatingResponseDto })
  rating: RatingResponseDto;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(FavoriteResponseDto) },
      { type: 'object', nullable: true, enum: [null] },
    ],
  })
  favorite: FavoriteResponseDto | null;
}
