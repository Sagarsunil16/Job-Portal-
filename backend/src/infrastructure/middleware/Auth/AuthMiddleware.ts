import { Request, Response, NextFunction } from 'express';
import { ITokenEngine } from '../../../engines/tokenEngine/ITokenEngine';
import { TokenPayloadDto } from '../../../domain/dtos/auth/TokenPayloadDto';

export interface IAuthMiddleware {
  verify(): (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

type AuthMiddlewareConstructorParams = {
  TokenEngine: ITokenEngine;
};

declare module 'express' {
  interface Request {
    user?: TokenPayloadDto;
  }
}

export class AuthMiddleware implements IAuthMiddleware {
  private tokenEngine: ITokenEngine;

  constructor({ TokenEngine }: AuthMiddlewareConstructorParams) {
    this.tokenEngine = TokenEngine;
  }

  verify(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
          throw new Error('Access Denied: No token provided');
        }

        const payload = this.tokenEngine.verifyAccessToken(token);

        if (payload) {
          req.user = payload;
          next();
        } else {
          throw new Error('Access Denied: Invalid or expired token');
        }
      } catch (error: any) {
        res.status(401).json({ status: false, message: 'Unauthorized', error: error.message });
      }
    };
  }
}
