import { Injectable, NotFoundException } from '@nestjs/common';
import { RentalRepository } from './rental.repository.js';

@Injectable()
export class RentalService {
  constructor(private readonly rentals: RentalRepository) {}

  async create(userId: number, bookId: number) {
    const rentalId = await this.rentals.create(userId, bookId);
    return { message: '대여 등록이 완료되었습니다!', rentalId };
  }

  async returnBook(rentalId: number) {
    const affectedRows = await this.rentals.returnBook(rentalId);
    if (affectedRows === 0) throw new NotFoundException('대여 기록을 찾을 수 없습니다');
    return { message: '반납이 완료되었습니다!', rentalId, affectedRows };
  }
}
