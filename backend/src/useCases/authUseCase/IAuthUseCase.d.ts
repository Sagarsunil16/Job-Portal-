import { SignupRequestDto } from '../../domain/dtos/auth/SignupRequestDto';
import { LoginRequestDto } from '../../domain/dtos/auth/LoginRequestDto';
import { AuthResponseDto } from '../../domain/dtos/auth/AuthResponseDto';
export interface IAuthUseCase {
    signup(data: SignupRequestDto): Promise<AuthResponseDto>;
    login(data: LoginRequestDto): Promise<AuthResponseDto>;
    refreshToken(refreshToken: string): Promise<AuthResponseDto>;
    logout(employerId: string): Promise<void>;
}
//# sourceMappingURL=IAuthUseCase.d.ts.map