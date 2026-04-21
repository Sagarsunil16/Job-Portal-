import { Request, Response, NextFunction } from 'express';
import { IAuthUseCase } from '../useCases/authUseCase/IAuthUseCase';
import { IAuthMiddleware } from '../infrastructure/middleware/Auth/AuthMiddleware';
import SignupWithSetupSchema from '../infrastructure/validation/auth/SignupWithSetupSchema';
import LoginSchema from '../infrastructure/validation/auth/LoginSchema';
import { ApiError } from '../domain/errors/ApiError';
import { ErrorCode } from '../domain/enums/ErrorCode';

type AuthControllerConstructorParams = {
  AuthUseCase: IAuthUseCase;
  AuthMiddleware: IAuthMiddleware;
};

export class AuthController {
  private authUseCase: IAuthUseCase;
  private auth: IAuthMiddleware;

  constructor({ AuthUseCase, AuthMiddleware }: AuthControllerConstructorParams) {
    this.authUseCase = AuthUseCase;
    this.auth = AuthMiddleware;
  }

  signupWithSetup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file && req.file.buffer ? { buffer: req.file.buffer, originalname: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size } : undefined;
      const payload = { ...req.body };

      await SignupWithSetupSchema.validate({ ...payload }, { abortEarly: false });

      const result = await this.authUseCase.signupWithSetup(payload, file);

      if (!result.status) {
        throw new ApiError(result.message || 'Signup failed', ErrorCode.ValidationError);
      }
      res.status(201).json(result);
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        return next(new ApiError('Validation failed', ErrorCode.ValidationError, error.errors));
      }
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await LoginSchema.validate(req.body, { abortEarly: false });
      const result = await this.authUseCase.login(req.body);

      if (!result.status) {
        throw new ApiError(result.message || 'Login failed', ErrorCode.InvalidCredentials);
      }
      res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        return next(new ApiError('Validation failed', ErrorCode.ValidationError, error.errors));
      }
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new ApiError('Refresh token is required', ErrorCode.PayloadError);
      }

      const result = await this.authUseCase.refreshToken(refreshToken);
      if (!result.status) {
        throw new ApiError(result.message || 'Refresh failed', ErrorCode.Unauthorized);
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    (await this.auth.verify())(req, res, async () => {
      try {
        const employerId = req.user?.employerId;
        if (!employerId) {
          throw new ApiError('Not authenticated', ErrorCode.Unauthorized);
        }

        await this.authUseCase.logout(employerId);
        res.status(200).json({ status: true, message: 'Logged out successfully' });
      } catch (error) {
        next(error);
      }
    });
  };
}
