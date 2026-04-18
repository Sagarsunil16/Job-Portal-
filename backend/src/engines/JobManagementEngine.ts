import { CreateJobDTO, JobDTO, UpdateJobDTO } from '../domain/dtos/JobDTO';
import { JobRepository } from '../repositories/jobRepository/JobRepository';

export class JobManagementEngine {
  private jobRepository: JobRepository;

  constructor() {
    this.jobRepository = new JobRepository();
  }

  async createJob(data: CreateJobDTO): Promise<JobDTO> {
    if (!data.title || !data.employerId) {
      throw new Error('Title and employerId are required.');
    }
    return await this.jobRepository.create(data);
  }

  async getJobById(id: string): Promise<JobDTO | null> {
    return await this.jobRepository.findById(id);
  }

  async getAllJobs(
    filters?: Record<string, any>,
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: JobDTO[]; total: number; page: number; totalPages: number }> {
    return await this.jobRepository.findPaginated(filters || {}, page, limit, search);
  }

  async getJobsByEmployer(
    employerId: string,
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: JobDTO[]; total: number; page: number; totalPages: number }> {
    return await this.jobRepository.findPaginated({ employerId }, page, limit, search);
  }

  async updateJob(id: string, data: UpdateJobDTO): Promise<JobDTO | null> {
    return await this.jobRepository.update(id, data);
  }

  async deleteJob(id: string): Promise<boolean> {
    return await this.jobRepository.delete(id);
  }
}
