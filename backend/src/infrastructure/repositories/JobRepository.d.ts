import { CreateJobDTO, JobDTO, UpdateJobDTO } from '../../domain/dtos/JobDTO';
export declare class JobRepository {
    private mapToDTO;
    create(data: CreateJobDTO): Promise<JobDTO>;
    findById(id: string): Promise<JobDTO | null>;
    findAll(filters?: Record<string, any>): Promise<JobDTO[]>;
    update(id: string, data: UpdateJobDTO): Promise<JobDTO | null>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=JobRepository.d.ts.map