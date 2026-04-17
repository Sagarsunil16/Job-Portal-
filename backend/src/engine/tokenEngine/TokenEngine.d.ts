import { ITokenEngine } from './ITokenEngine';
import { TokenPayloadDto } from '../../domain/dtos/auth/TokenPayloadDto';
export declare class TokenEngine implements ITokenEngine {
    private readonly accessSecret;
    private readonly refreshSecret;
    private readonly accessExpiry;
    private readonly refreshExpiry;
    constructor();
    generateAccessToken(payload: TokenPayloadDto): string;
    generateRefreshToken(payload: TokenPayloadDto): string;
    verifyAccessToken(token: string): TokenPayloadDto | null;
    verifyRefreshToken(token: string): TokenPayloadDto | null;
}
//# sourceMappingURL=TokenEngine.d.ts.map