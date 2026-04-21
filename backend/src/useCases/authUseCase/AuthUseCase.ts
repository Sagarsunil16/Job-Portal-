import { IAuthUseCase } from './IAuthUseCase';
import { SignupWithSetupDto } from '../../domain/dtos/auth/SignupWithSetupDto';
import { LoginRequestDto } from '../../domain/dtos/auth/LoginRequestDto';
import { AuthResponseDto } from '../../domain/dtos/auth/AuthResponseDto';
import { IAuthEngine } from '../../engines/authEngine/IAuthEngine';
import { ITokenEngine } from '../../engines/tokenEngine/ITokenEngine';
import { ICloudinaryEngine } from '../../engines/cloudinaryEngine/ICloudinaryEngine';

type AuthUseCaseConstructorParams = {
  AuthEngine: IAuthEngine;
  TokenEngine: ITokenEngine;
  CloudinaryEngine: ICloudinaryEngine;
};

export class AuthUseCase implements IAuthUseCase {
  private authEngine: IAuthEngine;
  private tokenEngine: ITokenEngine;
  private cloudinaryEngine: ICloudinaryEngine;

  constructor({ AuthEngine, TokenEngine, CloudinaryEngine }: AuthUseCaseConstructorParams) {
    this.authEngine = AuthEngine;
    this.tokenEngine = TokenEngine;
    this.cloudinaryEngine = CloudinaryEngine;
  }

  async signupWithSetup(data: SignupWithSetupDto, file?: { buffer: Buffer; originalname: string; mimetype?: string; size?: number }): Promise<AuthResponseDto> {
    try {
      // 1. Orchestrate File Upload & Validation
      let logoUrl = data.logoUrl;
      if (file && file.buffer) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype || '')) {
          throw new Error('Invalid file type. Only images are allowed.');
        }
        const maxSize = 2 * 1024 * 1024; // 2MB
        if ((file.size || 0) > maxSize) {
          throw new Error('File too large. Max size is 2MB.');
        }
        const filename = file.originalname || `logo_${Date.now()}`;
        const uploadResult = await this.cloudinaryEngine.uploadLogo(file.buffer, filename);
        logoUrl = uploadResult.url;
      }

      // 2. Call Domain Engine with final payload
      if (logoUrl) {
        data.logoUrl = logoUrl;
      }
      const newEmployer = await this.authEngine.registerEmployer(data);
      
      const tokenPayload = {
        employerId: newEmployer.id,
        username: newEmployer.username,
        email: newEmployer.email,
      };

      const accessToken = this.tokenEngine.generateAccessToken(tokenPayload);
      const refreshToken = this.tokenEngine.generateRefreshToken(tokenPayload);

      await this.authEngine.updateRefreshToken(newEmployer.id, refreshToken);

      return {
        status: true,
        message: 'Signup successful',
        data: {
          employerId: newEmployer.id,
          accessToken,
          refreshToken,
          logoUrl: newEmployer.logoUrl,
        },
      };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  async login(data: LoginRequestDto): Promise<AuthResponseDto> {
    try {
      const employer = await this.authEngine.verifyCredentials(data);
      
      const tokenPayload = {
        employerId: employer.id,
        username: employer.username,
        email: employer.email,
      };

      const accessToken = this.tokenEngine.generateAccessToken(tokenPayload);
      const refreshToken = this.tokenEngine.generateRefreshToken(tokenPayload);

      await this.authEngine.updateRefreshToken(employer.id, refreshToken);

      return {
        status: true,
        message: 'Login successful',
        data: {
          employerId: employer.id,
          accessToken,
          refreshToken,
          logoUrl: employer.logoUrl,
        },
      };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = this.tokenEngine.verifyRefreshToken(refreshToken);

      if (!payload) {
        return { status: false, message: 'Invalid or expired refresh token' };
      }

      const employer = await this.authEngine.verifyEmployerSession(payload.employerId, refreshToken);

      const newAccessToken = this.tokenEngine.generateAccessToken({
        employerId: employer.id,
        username: employer.username,
        email: employer.email,
      });

      return {
        status: true,
        message: 'Token refreshed',
        data: {
          employerId: employer.id,
          accessToken: newAccessToken,
          refreshToken,
          logoUrl: employer.logoUrl,
        },
      };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  async logout(employerId: string): Promise<void> {
    await this.authEngine.updateRefreshToken(employerId, null);
  }
}

