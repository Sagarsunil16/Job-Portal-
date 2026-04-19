import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../domain/errors/ApiError";
import { ErrorCode } from "../../domain/enums/ErrorCode";
import ErrorResponseDto from "../../domain/dtos/ErrorResponseDto";
import { MulterError } from "multer";

/**
 * Sanitizes error messages to prevent exposing technical stack details to users.
 */
function sanitizeErrorMessage(errorMessage: string): string {
  // 1. Check for database/technical indicators that MUST be hidden
  if (
    errorMessage.includes("duplicate key value violates unique constraint") ||
    errorMessage.includes("MongoError") ||
    errorMessage.includes("MongooseError") ||
    errorMessage.includes("validation failed")
  ) {
    return "Unable to process request due to a database service error";
  }

  // 2. Check for generic catch-all indicators (stack traces, raw errors)
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
  err: any, // Use any for library-specific checks
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error for backend debugging
  console.error("[GlobalErrorHandler] Error captured:", {
    name: err.name,
    message: err.message,
    code: err.code, // Useful for Multer
    stack: err.stack,
    path: req.path,
  });

  // Handle Multer-specific errors (file upload limits, etc.)
  if (err instanceof MulterError) {
    let message = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large. Max size allowed is 2MB.';
    }
    
    res.status(400).json(new ErrorResponseDto(message, ErrorCode.PayloadError));
    return;
  }

  // If it's a known ApiError, we TRUST the message (no sanitization unless it matches DB rules)
  if (err instanceof ApiError) {
    const responseCode = getResponseCode(err.errorCode);
    
    // Only sanitize if it explicitly contains DB strings (highly unlikely for ApiError)
    const finalMessage = err.message.includes("MongoError") || err.message.includes("MongooseError")
      ? sanitizeErrorMessage(err.message)
      : err.message;
    
    res
      .status(responseCode)
      .json(new ErrorResponseDto(finalMessage, err.errorCode, err.errorDetails));
    return;
  }

  // Handle generic errors (fallback with full sanitization)
  const sanitizedMessage = sanitizeErrorMessage(err.message);
  res.status(500).json(new ErrorResponseDto(sanitizedMessage, ErrorCode.InternalError));
}
