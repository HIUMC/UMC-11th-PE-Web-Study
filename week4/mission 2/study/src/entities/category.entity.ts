import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id', type: 'bigint' })
  categoryId: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;
}
