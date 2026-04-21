import bcrypt from 'bcryptjs';
import { IAuthEngine } from './IAuthEngine';
import { SignupWithSetupDto } from '../../domain/dtos/auth/SignupWithSetupDto';
import { LoginRequestDto } from '../../domain/dtos/auth/LoginRequestDto';
import { IEmployerRepository } from '../../repositories/employerRepository/IEmployerRepository';
import { ICloudinaryEngine } from '../cloudinaryEngine/ICloudinaryEngine';
import { IEmployer } from '../../infrastructure/models/EmployerModel';

type AuthEngineConstructorParams = {
  EmployerRepository: IEmployerRepository;
};

export class AuthEngine implements IAuthEngine {
  private employerRepository: IEmployerRepository;

  constructor({ EmployerRepository }: AuthEngineConstructorParams) {
    this.employerRepository = EmployerRepository;
  }

  async registerEmployer(data: SignupWithSetupDto): Promise<IEmployer> {
    // Check for existing user
    const existingUser = await this.employerRepository.findByEmailOrUsername(data.email) || 
                         await this.employerRepository.findByEmailOrUsername(data.username);

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    const logoUrl = data.logoUrl;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password || 'temp', salt);

    const newEmployerPayload = {
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
      ...(logoUrl ? { logoUrl } : {}),
    };

    return await this.employerRepository.create(newEmployerPayload);
  }

  async verifyCredentials(data: LoginRequestDto): Promise<IEmployer> {
    const employer = await this.employerRepository.findByEmailOrUsername(data.username);

    if (!employer) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, employer.passwordHash);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return employer;
  }

  async verifyEmployerSession(employerId: string, refreshToken: string): Promise<IEmployer> {
    const employer = await this.employerRepository.findById(employerId);

    if (!employer || employer.refreshToken !== refreshToken) {
      throw new Error('Token revoked or invalid');
    }

    return employer;
  }

  async updateRefreshToken(employerId: string, token: string | null): Promise<void> {
    await this.employerRepository.updateRefreshToken(employerId, token);
  }
}
