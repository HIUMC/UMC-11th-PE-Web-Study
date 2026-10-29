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

@Entity('rating')
@Unique('uk_rating_member_movie', ['memberId', 'movieId'])
export class Rating extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'rating_id', type: 'bigint' })
  ratingId: string;

  @Column({ name: 'member_id', type: 'bigint' })
  memberId: string;

  @ManyToOne(() => Member, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ name: 'movie_id', type: 'bigint' })
  movieId: string;

  @Column({ type: 'tinyint' })
  score: number;

  @Column({ type: 'text', nullable: true })
  comment: string | null;
}
