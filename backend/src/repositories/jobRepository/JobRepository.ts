import { CreateJobDTO, JobDTO, UpdateJobDTO } from '../../domain/dtos/JobDTO';
import { JobModel } from '../../infrastructure/database/schemas/JobSchema';

export class JobRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToDTO(job: any): JobDTO {
    return {
      id: job._id ? job._id.toString() : '',
      title: job.title || '',
      tags: Array.isArray(job.tags) ? job.tags : [],
      role: job.role || '',
      minSalary: job.minSalary ?? 0,
      maxSalary: job.maxSalary ?? 0,
      salaryType: job.salaryType || '',
      educationLevel: job.educationLevel || '',
      experienceLevel: job.experienceLevel || '',
      type: job.type || '',
      jobLevel: job.jobLevel || '',
      expirationDate: job.expirationDate ?? null,
      country: job.country || '',
      city: job.city || '',
      fullyRemote: job.fullyRemote ?? false,
      description: job.description || '',
      employerId: job.employerId ? job.employerId.toString() : '',
      companyName: job.companyName || '',
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }

  async create(data: CreateJobDTO): Promise<JobDTO> {
    const job = new JobModel(data);
    const savedJob = await job.save();
    return this.mapToDTO(savedJob.toObject());
  }

  async findById(id: string): Promise<JobDTO | null> {
    const job = await JobModel.findById(id).lean();
    if (!job) return null;
    return this.mapToDTO(job);
  }

  async findPaginated(
    filters: Record<string, any> = {},
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: JobDTO[]; total: number; page: number; totalPages: number }> {
    const query: any = { ...filters };
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      JobModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      JobModel.countDocuments(query)
    ]);

    return {
      data: jobs.map((job) => this.mapToDTO(job)),
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    };
  }

  async findAll(filters: Record<string, any> = {}): Promise<JobDTO[]> {
    const jobs = await JobModel.find(filters).sort({ createdAt: -1 }).lean();
    return jobs.map((job) => this.mapToDTO(job));
  }

  async update(id: string, data: UpdateJobDTO): Promise<JobDTO | null> {
    const updatedJob = await JobModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!updatedJob) return null;
    return this.mapToDTO(updatedJob);
  }

  async delete(id: string): Promise<boolean> {
    const result = await JobModel.findByIdAndDelete(id);
    return result !== null;
  }
}
