import { JobType } from '../enums/JobType';
export interface CreateJobDTO {
    title: string;
    description: string;
    companyName: string;
    location: string;
    salary?: string;
    type: JobType;
    employerId: string;
}
export interface UpdateJobDTO {
    title?: string;
    description?: string;
    companyName?: string;
    location?: string;
    salary?: string;
    type?: JobType;
}
export interface JobDTO extends CreateJobDTO {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=JobDTO.d.ts.map