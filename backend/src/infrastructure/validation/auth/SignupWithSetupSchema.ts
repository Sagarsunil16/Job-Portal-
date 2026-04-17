import * as Yup from 'yup';

const SignupWithSetupSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  username: Yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one symbol'),
  companyName: Yup.string().required('Company Name is required'),
  organizationType: Yup.string().required('Organization Type is required'),
  industryType: Yup.string().required('Industry Type is required'),
  teamSize: Yup.string().required('Team Size is required'),
  yearEstablished: Yup.string().required('Year Established is required'),
  aboutUs: Yup.string().required('About Us is required'),
  location: Yup.string().required('Location is required'),
  contactNumber: Yup.string().required('Contact Number is required'),
});

export default SignupWithSetupSchema;
