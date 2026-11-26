import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class LoginDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @MaxLength(254)
  @ApiProperty({
    format: 'email',
    maxLength: 254,
    example: 'learner@example.test',
  })
  email: string;
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @ApiProperty({
    format: 'password',
    writeOnly: true,
    example: 'StudyExample1!',
  })
  password: string;
}
