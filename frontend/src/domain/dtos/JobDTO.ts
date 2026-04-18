// Frontend-side typed shape for a Job, mirroring the backend JobDTO
export interface JobDTO {
  id: string;
  title: string;
  tags: string[];
  role: string;
  minSalary: number;
  maxSalary: number;
  salaryType: string;
  educationLevel: string;
  experienceLevel: string;
  type: string;
  jobLevel: string;
  expirationDate: string | null;
  country: string;
  city: string;
  fullyRemote: boolean;
  description: string;
  employerId: string;
  companyName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobPayload {
  title: string;
  tags: string;          // comma-separated string from form input
  role: string;
  minSalary: number;
  maxSalary: number;
  salaryType: string;
  educationLevel: string;
  experienceLevel: string;
  type: string;
  jobLevel: string;
  expirationDate: string;
  country: string;
  city: string;
  fullyRemote: boolean;
  description: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}
