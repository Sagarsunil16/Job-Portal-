import { CreateJobDTO, JobDTO, UpdateJobDTO } from '../domain/dtos/JobDTO';
import { JobRepository } from '../infrastructure/repositories/JobRepository';

export class JobManagementEngine {
  private jobRepository: JobRepository;

  constructor() {
    this.jobRepository = new JobRepository();
  }

  async createJob(data: CreateJobDTO): Promise<JobDTO> {
    if (!data.title || !data.companyName || !data.employerId) {
      throw new Error('Title, companyName, and employerId are required.');
    }
    return await this.jobRepository.create(data);
  }

  async getJobById(id: string): Promise<JobDTO | null> {
    return await this.jobRepository.findById(id);
  }

  async getAllJobs(filters?: Record<string, any>): Promise<JobDTO[]> {
    return await this.jobRepository.findAll(filters || {});
  }

  async updateJob(id: string, data: UpdateJobDTO): Promise<JobDTO | null> {
    return await this.jobRepository.update(id, data);
  }

  async deleteJob(id: string): Promise<boolean> {
    return await this.jobRepository.delete(id);
  }
}
