import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id', type: 'bigint' })
  categoryId: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  // MySQL BIGINT values are kept as strings until a safe API number is needed.
}
