import mongoose, { Document, Schema } from 'mongoose';
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

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    companyName: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, default: '' },
    type: {
      type: String,
      enum: Object.values(JobType),
      required: true,
      default: JobType.FULL_TIME,
    },
    employerId: { type: String, required: true },
  },
  { timestamps: true }
);

export const JobModel = mongoose.model<IJob>('Job', JobSchema);
