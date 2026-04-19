import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../domain/errors/ApiError";
import { ErrorCode } from "../../domain/enums/ErrorCode";
import ErrorResponseDto from "../../domain/dtos/ErrorResponseDto";

/**
 * Sanitizes error messages to prevent exposing technical stack details to users.
 */
function sanitizeErrorMessage(errorMessage: string): string {
  // Check for common technical indicators
  if (
    errorMessage.includes("duplicate key value violates unique constraint") ||
    errorMessage.includes("MongoError") ||
    errorMessage.includes("MongooseError") ||
    errorMessage.includes("validation failed")
  ) {
    return "Unable to process request due to a database service error";
  }

  if (
    errorMessage.includes("Error:") ||
    errorMessage.includes("\n    at ") ||
    errorMessage.includes("TypeError") ||
    errorMessage.includes("ReferenceError")
  ) {
    return "An unexpected error occurred. Please try again";
  }

  return errorMessage;
}

export function getResponseCode(errorCode: ErrorCode): number {
  switch (errorCode) {
    case ErrorCode.UserNotFound:
    case ErrorCode.InvalidCredentials:
    case ErrorCode.Unauthorized:
      return 401;

    case ErrorCode.PayloadError:
    case ErrorCode.DuplicatePayload:
    case ErrorCode.ValidationError:
    case ErrorCode.AlreadyExists:
      return 400;

    case ErrorCode.Forbidden:
      return 403;

    case ErrorCode.NotFound:
      return 404;

    default:
      return 500;
  }
}

export default function handleErrors(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error for backend debugging (visible in Render logs)
  console.error("[GlobalErrorHandler] Error captured:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // If it's a known ApiError
  if (err instanceof ApiError) {
    const responseCode = getResponseCode(err.errorCode);
    const sanitizedMessage = sanitizeErrorMessage(err.message);
    
    res
      .status(responseCode)
      .json(new ErrorResponseDto(sanitizedMessage, err.errorCode, err.errorDetails));
    return;
  }

  // Handle generic errors (fallback)
  const sanitizedMessage = sanitizeErrorMessage(err.message);
  res.status(500).json(new ErrorResponseDto(sanitizedMessage, ErrorCode.InternalError));
}
