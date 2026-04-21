import { CreateJobDTO, JobDTO, UpdateJobDTO } from '../../domain/dtos/JobDTO';

export interface IJobManagementEngine {
  createJob(data: CreateJobDTO): Promise<JobDTO>;
  getJobById(id: string): Promise<JobDTO | null>;
  getAllJobs(
    filters?: Record<string, any>,
    page?: number,
    limit?: number,
    search?: string
  ): Promise<{ data: JobDTO[]; total: number; page: number; totalPages: number }>;
  getJobsByEmployer(
    employerId: string,
    page?: number,
    limit?: number,
    search?: string
  ): Promise<{ data: JobDTO[]; total: number; page: number; totalPages: number }>;
  updateJob(id: string, data: UpdateJobDTO): Promise<JobDTO | null>;
  deleteJob(id: string): Promise<boolean>;
}
