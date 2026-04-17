import * as Yup from 'yup';
declare const SignupSchema: Yup.ObjectSchema<{
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}, Yup.AnyObject, {
    fullName: undefined;
    username: undefined;
    email: undefined;
    password: undefined;
    confirmPassword: undefined;
}, "">;
export default SignupSchema;
//# sourceMappingURL=SignupSchema.d.ts.map