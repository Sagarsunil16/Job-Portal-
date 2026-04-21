import { CreateJobDTO, JobDTO, UpdateJobDTO } from '../../domain/dtos/JobDTO';

export interface IJobManagementUseCase {
  createJob(data: CreateJobDTO & { employerId: string }): Promise<JobDTO>;
  getAllJobs(filter: Record<string, any>, page: number, limit: number, search?: string): Promise<{ data: JobDTO[]; total: number; page: number; totalPages: number }>;
  getJobsByEmployer(employerId: string, page: number, limit: number, search?: string): Promise<{ data: JobDTO[]; total: number; page: number; totalPages: number }>;
  getJobById(jobId: string): Promise<JobDTO | null>;
  updateJob(jobId: string, update: UpdateJobDTO, employerId: string): Promise<JobDTO | null>;
  deleteJob(jobId: string, employerId: string): Promise<boolean>;
}
