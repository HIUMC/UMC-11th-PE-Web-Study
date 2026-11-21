export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T; // API마다 달라지는 데이터
}
