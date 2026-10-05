import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity.js';

@Entity('book')
export class Book {
  @PrimaryGeneratedColumn({ name: 'book_id', type: 'bigint' })
  bookId: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_available', type: 'boolean', default: true })
  isAvailable: boolean;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
