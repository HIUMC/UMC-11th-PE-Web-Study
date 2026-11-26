import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BaseTimeEntity } from './base-time.entity.js';
import { Member } from './member.entity.js';

@Entity('favorite')
@Unique('uk_favorite_member_movie', ['memberId', 'movieId'])
export class Favorite extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'favorite_id', type: 'bigint' })
  favoriteId: string;

  @Column({ name: 'member_id', type: 'bigint' })
  memberId: string;

  @ManyToOne(() => Member, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'member_id',
    foreignKeyConstraintName: 'fk_favorite_member',
  })
  member: Member;

  @Column({ name: 'movie_id', type: 'bigint' })
  movieId: string;
}
