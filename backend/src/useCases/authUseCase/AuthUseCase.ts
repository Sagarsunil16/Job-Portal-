import bcrypt from 'bcryptjs';
import { IAuthUseCase } from './IAuthUseCase';
import { SignupWithSetupDto } from '../../domain/dtos/auth/SignupWithSetupDto';
import { uploadLogoToCloudinary } from '../../engines/cloudinaryEngine';
import { LoginRequestDto } from '../../domain/dtos/auth/LoginRequestDto';
import { AuthResponseDto } from '../../domain/dtos/auth/AuthResponseDto';
import { IEmployerRepository } from '../../repositories/employerRepository/IEmployerRepository';
import { ITokenEngine } from '../../engines/tokenEngine/ITokenEngine';

type AuthUseCaseConstructorParams = {
  EmployerRepository: IEmployerRepository;
  TokenEngine: ITokenEngine;
};

export class AuthUseCase implements IAuthUseCase {
  private employerRepository: IEmployerRepository;
  private tokenEngine: ITokenEngine;

  constructor({ EmployerRepository, TokenEngine }: AuthUseCaseConstructorParams) {
    this.employerRepository = EmployerRepository;
    this.tokenEngine = TokenEngine;
  }

  async signupWithSetup(data: SignupWithSetupDto, file?: { buffer: Buffer; originalname: string; mimetype?: string; size?: number }): Promise<AuthResponseDto> {
    // Check for existing user
    const existingUser = await this.employerRepository.findByEmailOrUsername(
      data.email
    ) || await this.employerRepository.findByEmailOrUsername(data.username);

    if (existingUser) {
      return {
        status: false,
        message: 'Username or email already exists',
      };
    }

    // File validation (moved from controller)
    let logoUrl = data.logoUrl;
    if (file && file.buffer) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.mimetype || '')) {
        return {
          status: false,
          message: 'Invalid file type. Only images are allowed.',
        };
      }
      const maxSize = 2 * 1024 * 1024; // 2MB
      if ((file.size || 0) > maxSize) {
        return {
          status: false,
          message: 'File too large. Max size is 2MB.',
        };
      }
      // Upload to Cloudinary
      const filename = file.originalname || `logo_${Date.now()}`;
      const uploadResult = await uploadLogoToCloudinary(file.buffer, filename);
      logoUrl = uploadResult.url;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password || 'temp', salt);

    const newEmployerPayload: any = {
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      passwordHash,
      companyName: data.companyName,
      organizationType: data.organizationType,
      industryType: data.industryType,
      teamSize: data.teamSize,
      yearEstablished: data.yearEstablished,
      aboutUs: data.aboutUs,
      location: data.location,
      contactNumber: data.contactNumber,
      logoUrl,
    };

    const newEmployer = await this.employerRepository.create(newEmployerPayload);

    const tokenPayload = {
      employerId: newEmployer.id,
      username: newEmployer.username,
      email: newEmployer.email,
    };

    const accessToken = this.tokenEngine.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenEngine.generateRefreshToken(tokenPayload);

    await this.employerRepository.updateRefreshToken(newEmployer.id, refreshToken);

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
  }

  async login(data: LoginRequestDto): Promise<AuthResponseDto> {
    const employer = await this.employerRepository.findByEmailOrUsername(data.username);

    if (!employer) {
      return {
        status: false,
        message: 'Invalid credentials',
      };
    }

    const isMatch = await bcrypt.compare(data.password, employer.passwordHash);

    if (!isMatch) {
      return {
        status: false,
        message: 'Invalid credentials',
      };
    }

    const tokenPayload = {
      employerId: employer.id,
      username: employer.username,
      email: employer.email,
    };

    const accessToken = this.tokenEngine.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenEngine.generateRefreshToken(tokenPayload);

    await this.employerRepository.updateRefreshToken(employer.id, refreshToken);

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
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    const payload = this.tokenEngine.verifyRefreshToken(refreshToken);

    if (!payload) {
      return { status: false, message: 'Invalid or expired refresh token' };
    }

    const employer = await this.employerRepository.findById(payload.employerId);

    if (!employer || employer.refreshToken !== refreshToken) {
      return { status: false, message: 'Token revoked or invalid' };
    }

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
        refreshToken, // Optionally rotate refresh token here as well
        logoUrl: employer.logoUrl,
      },
    };
  }

  async logout(employerId: string): Promise<void> {
    await this.employerRepository.updateRefreshToken(employerId, null);
  }
}
