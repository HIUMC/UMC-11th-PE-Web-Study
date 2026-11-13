// 코드 문자열을 직접 지정하는 방법
import { HttpException, HttpStatus } from "@nestjs/common";

export class ApiException extends HttpException { //HttpException을 상속한다.
  // code는 응답 바디의 code 필드에 실릴 문자열
  constructor (
    status: HttpStatus,
    public readonly code: string,
    message: string,
  ) {
    super (message, status);
  }
}