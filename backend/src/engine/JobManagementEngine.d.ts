import { CreateJobDTO, JobDTO, UpdateJobDTO } from '../domain/dtos/JobDTO';
export declare class JobManagementEngine {
    private jobRepository;
    constructor();
    createJob(data: CreateJobDTO): Promise<JobDTO>;
    getJobById(id: string): Promise<JobDTO | null>;
    getAllJobs(filters?: Record<string, any>): Promise<JobDTO[]>;
    updateJob(id: string, data: UpdateJobDTO): Promise<JobDTO | null>;
    deleteJob(id: string): Promise<boolean>;
}
//# sourceMappingURL=JobManagementEngine.d.ts.map