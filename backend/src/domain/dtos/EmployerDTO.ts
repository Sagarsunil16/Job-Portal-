export interface EmployerDTO {
  id: string;
  userId: string;
  companyName: string;
  website?: string;
  logoUrl?: string;
  industry?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
