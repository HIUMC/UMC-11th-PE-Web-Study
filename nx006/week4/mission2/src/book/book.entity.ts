import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Category } from '../category/category.entity.js';
import { bigintNumber } from '../common/bigint-number.js';

@Entity('book')
export class Book {
  @PrimaryGeneratedColumn({ name: 'book_id', type: 'bigint' })
  bookId: string;

  @Column({ name: 'category_id', type: 'bigint', transformer: bigintNumber })
  categoryId: number;

  @ManyToOne(() => Category, { nullable: false, cascade: false })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'categoryId' })
  category: Relation<Category>;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_available', type: 'boolean', default: true })
  isAvailable: boolean;
}
