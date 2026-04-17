import { IEmployer } from '../models/EmployerModel';

export interface IEmployerRepository {
  findByEmail(email: string): Promise<IEmployer | null>;
  findByUsername(username: string): Promise<IEmployer | null>;
  findByEmailOrUsername(identifier: string): Promise<IEmployer | null>;
  findById(id: string): Promise<IEmployer | null>;
  create(data: {
    fullName: string;
    username: string;
    email: string;
    passwordHash: string;
    logoUrl?: string;
    companyName: string;
    organizationType: string;
    industryType: string;
    teamSize: string;
    yearEstablished: string;
    aboutUs: string;
    location: string;
    contactNumber: string;
  }): Promise<IEmployer>;
  updateRefreshToken(id: string, refreshToken: string | null): Promise<void>;
}
