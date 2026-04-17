import { IAuthUseCase } from './IAuthUseCase';
import { SignupRequestDto } from '../../domain/dtos/auth/SignupRequestDto';
import { LoginRequestDto } from '../../domain/dtos/auth/LoginRequestDto';
import { AuthResponseDto } from '../../domain/dtos/auth/AuthResponseDto';
import { IEmployerRepository } from '../../infrastructure/repositories/IEmployerRepository';
import { ITokenEngine } from '../../engine/tokenEngine/ITokenEngine';
type AuthUseCaseConstructorParams = {
    EmployerRepository: IEmployerRepository;
    TokenEngine: ITokenEngine;
};
export declare class AuthUseCase implements IAuthUseCase {
    private employerRepository;
    private tokenEngine;
    constructor({ EmployerRepository, TokenEngine }: AuthUseCaseConstructorParams);
    signup(data: SignupRequestDto): Promise<AuthResponseDto>;
    login(data: LoginRequestDto): Promise<AuthResponseDto>;
    refreshToken(refreshToken: string): Promise<AuthResponseDto>;
    logout(employerId: string): Promise<void>;
}
export {};
//# sourceMappingURL=AuthUseCase.d.ts.map