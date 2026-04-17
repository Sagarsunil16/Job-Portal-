import mongoose, { Document } from 'mongoose';
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
export declare const EmployerModel: mongoose.Model<IEmployer, {}, {}, {}, mongoose.Document<unknown, {}, IEmployer, {}, mongoose.DefaultSchemaOptions> & IEmployer & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IEmployer>;
//# sourceMappingURL=EmployerSchema.d.ts.map