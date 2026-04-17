import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployer extends Document {
  id: string;
  fullName: string;
  username: string;
  email: string;
  passwordHash: string;
  refreshToken?: string;
  logoUrl?: string;
  companyName: string;
  organizationType: string;
  industryType: string;
  teamSize: string;
  yearEstablished: string;
  aboutUs: string;
  location: string;
  contactNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployerSchema = new Schema<IEmployer>(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    refreshToken: { type: String, default: null },
    logoUrl: { type: String, default: null },
    companyName: { type: String, required: true },
    organizationType: { type: String, required: true },
    industryType: { type: String, required: true },
    teamSize: { type: String, required: true },
    yearEstablished: { type: String, required: true },
    aboutUs: { type: String, required: true },
    location: { type: String, required: true },
    contactNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export const EmployerModel = mongoose.model<IEmployer>('Employer', EmployerSchema);
