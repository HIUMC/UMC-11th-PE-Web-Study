import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FavoriteResponseDto } from '../dto/favorite.dto.js';
import type {
  CreateMovieRecordDto,
  MovieRecordResponseDto,
} from '../dto/movie-record.dto.js';
import { RatingResponseDto } from '../dto/rating-response.dto.js';
import { Favorite } from '../entity/favorite.entity.js';
import { Member } from '../entity/member.entity.js';
import { Rating } from '../entity/rating.entity.js';
import { ApiException } from '../filter/errors.js';

@Injectable()
export class MovieRecordService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  create(
    memberId: string,
    dto: CreateMovieRecordDto,
  ): Promise<MovieRecordResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const members = manager.getRepository(Member);
      const ratings = manager.getRepository(Rating);
      const favorites = manager.getRepository(Favorite);
      const key = { memberId, movieId: String(dto.movieId) };

      if (!(await members.existsBy({ memberId }))) {
        throw new ApiException('myMemberMissing');
      }
      if (await ratings.existsBy(key)) {
        throw new ApiException('securedRatingDuplicate');
      }
      if (dto.addToFavorites && (await favorites.existsBy(key))) {
        throw new ApiException('favoriteDuplicate');
      }

      const rating = await ratings.save(
        ratings.create({
          ...key,
          score: dto.score,
          comment: dto.comment ?? null,
        }),
      );
      const favorite = dto.addToFavorites
        ? await favorites.save(favorites.create(key))
        : null;

      return {
        rating: RatingResponseDto.from(rating),
        favorite: favorite ? FavoriteResponseDto.from(favorite) : null,
      };
    });
  }
}
