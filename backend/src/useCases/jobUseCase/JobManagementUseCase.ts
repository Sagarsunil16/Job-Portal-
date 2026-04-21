import { IJobManagementEngine } from '../../engines/jobManagementEngine/IJobManagementEngine';
import { IJobManagementUseCase } from './IJobManagementUseCase';

import { CreateJobDTO, JobDTO, UpdateJobDTO } from '../../domain/dtos/JobDTO';

export class JobManagementUseCase implements IJobManagementUseCase {
  private jobEngine: IJobManagementEngine;

  constructor({ JobEngine }: { JobEngine: IJobManagementEngine }) {
    this.jobEngine = JobEngine;
  }

  async createJob(data: CreateJobDTO & { employerId: string }): Promise<JobDTO> {
    // The engine handles repo and business logic
    return this.jobEngine.createJob(data);
  }

  async getAllJobs(filter: Record<string, any>, page: number, limit: number, search?: string): Promise<{ data: JobDTO[]; total: number; page: number; totalPages: number }> {
    return this.jobEngine.getAllJobs(filter, page, limit, search);
  }

  async getJobsByEmployer(employerId: string, page: number, limit: number, search?: string): Promise<{ data: JobDTO[]; total: number; page: number; totalPages: number }> {
    return this.jobEngine.getJobsByEmployer(employerId, page, limit, search);
  }

  async getJobById(jobId: string): Promise<JobDTO | null> {
    return this.jobEngine.getJobById(jobId);
  }

  async updateJob(jobId: string, update: UpdateJobDTO, employerId: string): Promise<JobDTO | null> {
    // Authorization logic
    const job = await this.jobEngine.getJobById(jobId);
    if (!job) throw new Error('Job not found');
    if (job.employerId !== employerId) throw new Error('Forbidden: You do not own this job');
    return this.jobEngine.updateJob(jobId, update);
  }

  async deleteJob(jobId: string, employerId: string): Promise<boolean> {
    const job = await this.jobEngine.getJobById(jobId);
    if (!job) throw new Error('Job not found');
    if (job.employerId !== employerId) throw new Error('Forbidden: You do not own this job');
    return this.jobEngine.deleteJob(jobId);
  }
}

