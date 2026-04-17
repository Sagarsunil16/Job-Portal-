import jwt from 'jsonwebtoken';
import { ITokenEngine } from './ITokenEngine';
import { TokenPayloadDto } from '../../domain/dtos/auth/TokenPayloadDto';

export class TokenEngine implements ITokenEngine {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiry: string;
  private readonly refreshExpiry: string;

  constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET || 'access_secret_fallback';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret_fallback';
    this.accessExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  }

  generateAccessToken(payload: TokenPayloadDto): string {
    return jwt.sign(payload, this.accessSecret, { expiresIn: this.accessExpiry } as jwt.SignOptions);
  }

  generateRefreshToken(payload: TokenPayloadDto): string {
    return jwt.sign(payload, this.refreshSecret, { expiresIn: this.refreshExpiry } as jwt.SignOptions);
  }

  verifyAccessToken(token: string): TokenPayloadDto | null {
    try {
      return jwt.verify(token, this.accessSecret) as TokenPayloadDto;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): TokenPayloadDto | null {
    try {
      return jwt.verify(token, this.refreshSecret) as TokenPayloadDto;
    } catch {
      return null;
    }
  }
}
