import { ErrorCode } from '../enums/ErrorCode';

export class ApiError extends Error {
  public errorCode: ErrorCode;
  public errorDetails: string[];

  constructor(
    message: string, 
    errorCode: ErrorCode = ErrorCode.InternalError, 
    errorDetails: string[] = []
  ) {
    super(message);
    this.name = 'ApiError';
    this.errorCode = errorCode;
    this.errorDetails = errorDetails;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
