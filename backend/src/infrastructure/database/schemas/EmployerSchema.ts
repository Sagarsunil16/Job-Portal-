import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployer extends Document {
  userId: string;
  companyName: string;
  website: string;
  logoUrl: string;
  industry: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployerSchema = new Schema<IEmployer>(
  {
    userId: { type: String, required: true },
    companyName: { type: String, required: true },
    website: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    industry: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export const EmployerModel = mongoose.model<IEmployer>('Employer', EmployerSchema);
