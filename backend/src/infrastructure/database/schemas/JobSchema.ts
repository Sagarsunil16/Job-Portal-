import mongoose, { Document, Schema, Types } from 'mongoose';
import { JobType } from '../../../domain/enums/JobType';

export interface IJob extends Document {
  title: string;
  tags: string[];
  role: string;
  minSalary: number;
  maxSalary: number;
  salaryType: string;
  educationLevel: string;
  experienceLevel: string;
  type: JobType;
  jobLevel: string;
  expirationDate: Date;
  country: string;
  city: string;
  fullyRemote: boolean;
  description: string;
  employerId: Types.ObjectId;  // reference to Employer collection
  companyName: string;          // denormalized for fast reads without populate
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    tags: { type: [String], default: [] },
    role: { type: String, required: true },
    minSalary: { type: Number, required: true },
    maxSalary: { type: Number, required: true },
    salaryType: { type: String, required: true },
    educationLevel: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    type: { type: String, enum: Object.values(JobType), required: true, default: JobType.FULL_TIME },
    jobLevel: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    fullyRemote: { type: Boolean, default: false },
    description: { type: String, required: true },
    employerId: { type: Schema.Types.ObjectId, ref: 'Employer', required: true },
    companyName: { type: String, required: true },
  },
  { timestamps: true }
);

export const JobModel = mongoose.model<IJob>('Job', JobSchema);
