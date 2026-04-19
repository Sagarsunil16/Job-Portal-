import { ErrorCode } from "../enums/ErrorCode";

export default class ErrorResponseDto {
  public status: boolean = false;
  public message: string;
  public errorCode: ErrorCode;
  public errorDetails: string[];

  constructor(
    message: string,
    errorCode: ErrorCode = ErrorCode.InternalError,
    errorDetails: string[] = []
  ) {
    this.message = message;
    this.errorCode = errorCode;
    this.errorDetails = errorDetails;
  }
}
