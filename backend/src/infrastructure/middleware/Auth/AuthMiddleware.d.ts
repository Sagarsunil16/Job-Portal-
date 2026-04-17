import { Request, Response, NextFunction } from 'express';
import { ITokenEngine } from '../../../engine/tokenEngine/ITokenEngine';
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
export declare class AuthMiddleware implements IAuthMiddleware {
    private tokenEngine;
    constructor({ TokenEngine }: AuthMiddlewareConstructorParams);
    verify(): (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export {};
//# sourceMappingURL=AuthMiddleware.d.ts.map