import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListBooksQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  keyword?: string;
}
