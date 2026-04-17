import { SignupWithSetupDto } from '../../domain/dtos/auth/SignupWithSetupDto';
import { LoginRequestDto } from '../../domain/dtos/auth/LoginRequestDto';
import { AuthResponseDto } from '../../domain/dtos/auth/AuthResponseDto';

export interface IAuthUseCase {
  signupWithSetup(data: SignupWithSetupDto): Promise<AuthResponseDto>;
  login(data: LoginRequestDto): Promise<AuthResponseDto>;
  refreshToken(refreshToken: string): Promise<AuthResponseDto>;
  logout(employerId: string): Promise<void>;
}
