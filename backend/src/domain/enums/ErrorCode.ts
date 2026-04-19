export enum ErrorCode {
  InternalError = 0,
  ValidationError = 1,
  Unauthorized = 2,
  Forbidden = 3,
  NotFound = 4,
  DuplicatePayload = 5,
  AlreadyExists = 6,
  InvalidCredentials = 7,
  UserNotFound = 8,
  PayloadError = 9,
}

export default ErrorCode;
