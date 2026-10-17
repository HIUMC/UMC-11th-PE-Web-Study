// rental.service.ts
import { Injectable } from "@nestjs/common";
import { RentalRepository } from "./rental.repository.js";

@Injectable()
export class RentalService {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async createRental(body: { userId: number; bookId: number }) {
    return await this.rentalRepository.create(body);
  }
}
