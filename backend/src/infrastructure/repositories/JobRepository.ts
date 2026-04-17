import { CreateJobDTO, JobDTO, UpdateJobDTO } from '../../domain/dtos/JobDTO';
import { JobModel, IJob } from '../database/schemas/JobSchema';

export class JobRepository {
  private mapToDTO(job: IJob): JobDTO {
    return {
      id: job._id ? job._id.toString() : '',
      title: job.title,
      description: job.description,
      companyName: job.companyName,
      location: job.location,
      salary: job.salary,
      type: job.type,
      employerId: job.employerId,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }

  async create(data: CreateJobDTO): Promise<JobDTO> {
    const job = new JobModel(data);
    const savedJob = await job.save();
    return this.mapToDTO(savedJob);
  }

  async findById(id: string): Promise<JobDTO | null> {
    const job = await JobModel.findById(id);
    if (!job) return null;
    return this.mapToDTO(job);
  }

  async findAll(filters: Record<string, any> = {}): Promise<JobDTO[]> {
    const jobs = await JobModel.find(filters).sort({ createdAt: -1 });
    return jobs.map((job) => this.mapToDTO(job));
  }

  async update(id: string, data: UpdateJobDTO): Promise<JobDTO | null> {
    const updatedJob = await JobModel.findByIdAndUpdate(id, data, { new: true });
    if (!updatedJob) return null;
    return this.mapToDTO(updatedJob);
  }

  async delete(id: string): Promise<boolean> {
    const result = await JobModel.findByIdAndDelete(id);
    return result !== null;
  }
}
