import { TokenPayloadDto } from '../../domain/dtos/auth/TokenPayloadDto';

export interface ITokenEngine {
  generateAccessToken(payload: TokenPayloadDto): string;
  generateRefreshToken(payload: TokenPayloadDto): string;
  verifyAccessToken(token: string): TokenPayloadDto | null;
  verifyRefreshToken(token: string): TokenPayloadDto | null;
}
