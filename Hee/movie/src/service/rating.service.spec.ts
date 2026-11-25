import { describe, expect, it, vi } from 'vitest';
import type { Repository } from 'typeorm';
import type { Member } from '../entity/member.entity.js';
import type { Rating } from '../entity/rating.entity.js';
import { RatingService } from './rating.service.js';

function setup() {
  const ratingRepository = { findOne: vi.fn(), save: vi.fn() };
  const memberRepository = { findOneBy: vi.fn() };
  const service = new RatingService(
    ratingRepository as unknown as Repository<Rating>,
    memberRepository as unknown as Repository<Member>,
  );
  return { service, ratingRepository, memberRepository };
}

describe('RatingService', () => {
  it('같은 영화에 평점을 중복 등록하면 409와 RATING409_1을 반환한다', async () => {
    const { service, ratingRepository, memberRepository } = setup();
    const member = { memberId: 1 };
    memberRepository.findOneBy.mockResolvedValue(member);
    ratingRepository.findOne.mockResolvedValue({ ratingId: 10, movieId: 550, member });

    await expect(service.create(1, { movieId: 550, score: 4 })).rejects.toMatchObject({
      status: 409,
      code: 'RATING409_1',
    });
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });

  it('다른 회원의 평점을 수정하면 403과 RATING403_1을 반환한다', async () => {
    const { service, ratingRepository } = setup();
    ratingRepository.findOne.mockResolvedValue({ ratingId: 10, member: { memberId: 2 } });

    await expect(service.update(1, 10, { score: 4 })).rejects.toMatchObject({
      status: 403,
      code: 'RATING403_1',
    });
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });
});
