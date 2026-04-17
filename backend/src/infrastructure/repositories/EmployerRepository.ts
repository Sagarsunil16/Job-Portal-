import { IEmployerRepository } from './IEmployerRepository';
import { EmployerModel, IEmployer } from '../models/EmployerModel';

export class EmployerRepository implements IEmployerRepository {
  async findByEmail(email: string): Promise<IEmployer | null> {
    return EmployerModel.findOne({ email: email.toLowerCase() });
  }

  async findByUsername(username: string): Promise<IEmployer | null> {
    return EmployerModel.findOne({ username: username.toLowerCase() });
  }

  async findByEmailOrUsername(identifier: string): Promise<IEmployer | null> {
    const lower = identifier.toLowerCase();
    return EmployerModel.findOne({
      $or: [{ email: lower }, { username: lower }],
    });
  }

  async findById(id: string): Promise<IEmployer | null> {
    return EmployerModel.findById(id);
  }

  async create(data: {
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
  }): Promise<IEmployer> {
    const employer = new EmployerModel(data);
    return employer.save();
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await EmployerModel.findByIdAndUpdate(id, { refreshToken });
  }
}
