import { isEmail, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginRequestDto {
  @IsEmail({}, {message: '이메일 형식이 올바르지 않습니다.'})
  @IsNotEmpty({message: '이메일을 입력해주세요.'})
  email: string;

  //로그인 단계에서는 비밀번호 규칙까지 검사하지 않는다. (규칙이 바뀌기 전에 가입한 회원이 로그인조차 못하게 될 수 있음)
  @IsString()
  @IsNotEmpty({message: '비밀번호를 입력해주세요.'})
  password: string;
}