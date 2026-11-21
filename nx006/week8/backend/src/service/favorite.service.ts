import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FavoriteResponseDto,
  type FavoriteStatusDto,
} from '../dto/favorite.dto.js';
import { Favorite } from '../entity/favorite.entity.js';
import { Member } from '../entity/member.entity.js';
import { ApiException } from '../filter/errors.js';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Member) private readonly members: Repository<Member>,
    @InjectRepository(Favorite)
    private readonly favorites: Repository<Favorite>,
  ) {}

  async create(
    memberId: string,
    movieId: string,
  ): Promise<FavoriteResponseDto> {
    if (!(await this.members.existsBy({ memberId }))) {
      throw new ApiException('myMemberMissing');
    }
    const key = { memberId, movieId };
    if (await this.favorites.existsBy(key)) {
      throw new ApiException('favoriteDuplicate');
    }
    const favorite = this.favorites.create(key);
    return FavoriteResponseDto.from(await this.favorites.save(favorite));
  }

  async list(memberId: string): Promise<FavoriteResponseDto[]> {
    const favorites = await this.favorites.find({
      where: { memberId },
      order: { favoriteId: 'DESC' },
    });
    return favorites.map(FavoriteResponseDto.from);
  }

  async status(memberId: string, movieId: string): Promise<FavoriteStatusDto> {
    return { isFavorite: await this.favorites.existsBy({ memberId, movieId }) };
  }

  async remove(memberId: string, movieId: string): Promise<void> {
    const result = await this.favorites.delete({ memberId, movieId });
    if (!result.affected) {
      throw new ApiException('favoriteMissing');
    }
  }
}
