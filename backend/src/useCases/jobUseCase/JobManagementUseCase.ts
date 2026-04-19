import { JobManagementEngine } from '../../engines/JobManagementEngine';

export class JobManagementUseCase {
  private jobEngine: JobManagementEngine;

  constructor({ JobEngine }: { JobEngine: JobManagementEngine }) {
    this.jobEngine = JobEngine;
  }

  async createJob(data: any) {
    // The engine handles repo and business logic
    return this.jobEngine.createJob(data);
  }

  async getAllJobs(filter: any, page: number, limit: number, search?: string) {
    return this.jobEngine.getAllJobs(filter, page, limit, search);
  }

  async getJobsByEmployer(employerId: string, page: number, limit: number, search?: string) {
    return this.jobEngine.getJobsByEmployer(employerId, page, limit, search);
  }

  async getJobById(jobId: string) {
    return this.jobEngine.getJobById(jobId);
  }

  async updateJob(jobId: string, update: any, employerId: string) {
    // Authorization logic can be here if needed
    const job = await this.jobEngine.getJobById(jobId);
    if (!job) throw new Error('Job not found');
    if (job.employerId !== employerId) throw new Error('Forbidden: You do not own this job');
    return this.jobEngine.updateJob(jobId, update);
  }

  async deleteJob(jobId: string, employerId: string) {
    const job = await this.jobEngine.getJobById(jobId);
    if (!job) throw new Error('Job not found');
    if (job.employerId !== employerId) throw new Error('Forbidden: You do not own this job');
    return this.jobEngine.deleteJob(jobId);
  }
}
