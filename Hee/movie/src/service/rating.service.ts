import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RatingResponseDto } from "../dto/rating-response.dto.js";
import { Rating } from "../entity/rating.entity.js";

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async getMemberRatings(memberId: number): Promise<RatingResponseDto[]> {
    const ratings = await this.ratingRepository.find({
      where: { member: { memberId } },
      order: { createdAt: "DESC" },
    });

    return ratings.map(RatingResponseDto.from);
  }
}
