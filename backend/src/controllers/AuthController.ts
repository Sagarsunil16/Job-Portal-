import { Request, Response, NextFunction } from 'express';
import { IAuthUseCase } from '../useCases/authUseCase/IAuthUseCase';
import SignupWithSetupSchema from '../infrastructure/validation/auth/SignupWithSetupSchema';
import LoginSchema from '../infrastructure/validation/auth/LoginSchema';

type AuthControllerConstructorParams = {
  AuthUseCase: IAuthUseCase;
};

export class AuthController {
  private authUseCase: IAuthUseCase;

  constructor({ AuthUseCase }: AuthControllerConstructorParams) {
    this.authUseCase = AuthUseCase;
  }

  async signupWithSetup(req: Request, res: Response, next: NextFunction) {
    try {
      // Future-proof: if multer processes the file, `req.file` holds logo.
      // We pass the file path or just proceed with body
      const payload = { ...req.body, logoUrl: req.file ? req.file.path : null };

      await SignupWithSetupSchema.validate(payload, { abortEarly: false });
      
      const result = await this.authUseCase.signupWithSetup(payload);
      
      if (!result.status) {
         res.status(400).json(result);
         return;
      }
      res.status(201).json(result);
    } catch (error: any) {
      if (error.name === 'ValidationError') {
         res.status(400).json({
          status: false,
          message: 'Validation failed',
          errors: error.errors,
        });
        return;
      }
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      await LoginSchema.validate(req.body, { abortEarly: false });
      const result = await this.authUseCase.login(req.body);

      if (!result.status) {
         res.status(401).json(result);
         return;
      }
      res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'ValidationError') {
         res.status(400).json({
          status: false,
          message: 'Validation failed',
          errors: error.errors,
        });
        return;
      }
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
         res.status(400).json({ status: false, message: 'Refresh token is required' });
         return;
      }

      const result = await this.authUseCase.refreshToken(refreshToken);
      if (!result.status) {
         res.status(401).json(result);
         return;
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Assuming AuthMiddleware attaches the user payload to req
      const employerId = (req as any).user?.employerId;
      
      if (!employerId) {
         res.status(400).json({ status: false, message: 'Not authenticated' });
         return;
      }

      await this.authUseCase.logout(employerId);
      res.status(200).json({ status: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
}
