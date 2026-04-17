import mongoose, { Document } from 'mongoose';
export interface IEmployer extends Document {
    fullName: string;
    username: string;
    email: string;
    passwordHash: string;
    refreshToken?: string;
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
//# sourceMappingURL=EmployerModel.d.ts.map