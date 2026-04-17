import { IEmployerRepository } from './IEmployerRepository';
import { IEmployer } from '../models/EmployerModel';
export declare class EmployerRepository implements IEmployerRepository {
    findByEmail(email: string): Promise<IEmployer | null>;
    findByUsername(username: string): Promise<IEmployer | null>;
    findByEmailOrUsername(identifier: string): Promise<IEmployer | null>;
    findById(id: string): Promise<IEmployer | null>;
    create(data: {
        fullName: string;
        username: string;
        email: string;
        passwordHash: string;
    }): Promise<IEmployer>;
    updateRefreshToken(id: string, refreshToken: string | null): Promise<void>;
}
//# sourceMappingURL=EmployerRepository.d.ts.map