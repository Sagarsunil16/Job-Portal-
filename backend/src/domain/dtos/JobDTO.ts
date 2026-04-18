import { JobType } from '../enums/JobType';

export interface CreateJobDTO {
  title: string;
  tags: string[];
  role: string;
  minSalary: number;
  maxSalary: number;
  salaryType: string;
  educationLevel: string;
  experienceLevel: string;
  type: JobType;
  jobLevel: string;
  expirationDate: Date;
  country: string;
  city: string;
  fullyRemote: boolean;
  description: string;
  employerId: string;
  companyName: string;
}

export interface UpdateJobDTO {
  title?: string;
  tags?: string[];
  role?: string;
  minSalary?: number;
  maxSalary?: number;
  salaryType?: string;
  educationLevel?: string;
  experienceLevel?: string;
  type?: JobType;
  jobLevel?: string;
  expirationDate?: Date;
  country?: string;
  city?: string;
  fullyRemote?: boolean;
  description?: string;
  companyName?: string;
}

export interface JobDTO extends CreateJobDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
