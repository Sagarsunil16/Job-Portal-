import { SignupWithSetupDto } from '../../domain/dtos/auth/SignupWithSetupDto';
import { LoginRequestDto } from '../../domain/dtos/auth/LoginRequestDto';
import { IEmployer } from '../../infrastructure/models/EmployerModel';

export interface IAuthEngine {
  registerEmployer(data: SignupWithSetupDto): Promise<IEmployer>;
  verifyCredentials(data: LoginRequestDto): Promise<IEmployer>;
  verifyEmployerSession(employerId: string, refreshToken: string): Promise<IEmployer>;
  updateRefreshToken(employerId: string, token: string | null): Promise<void>;
}
