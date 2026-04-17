import mongoose, { Document } from 'mongoose';
import { JobType } from '../../../domain/enums/JobType';
export interface IJob extends Document {
    title: string;
    description: string;
    companyName: string;
    location: string;
    salary: string;
    type: JobType;
    employerId: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const JobModel: mongoose.Model<IJob, {}, {}, {}, mongoose.Document<unknown, {}, IJob, {}, mongoose.DefaultSchemaOptions> & IJob & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IJob>;
//# sourceMappingURL=JobSchema.d.ts.map