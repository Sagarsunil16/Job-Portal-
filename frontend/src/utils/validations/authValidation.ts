import * as yup from 'yup';

// Reusable password constraint
const strongPassword = yup
  .string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one symbol');

export const loginSchema = yup.object().shape({
  username: yup.string().required('Username or Email is required'),
  password: yup.string().required('Password is required'), // Login usually doesn't need to strictly re-validate standard constraints
});

export const signupSchema = yup.object().shape({
  fullName: yup.string().required('Full Name is required'),
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  email: yup.string().email('Must be a valid email format').required('Email is required'),
  password: strongPassword,
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const accountSetupSchema = yup.object().shape({
  logo: yup.mixed().nullable(), // Optional initially
  companyName: yup.string().required('Company Name is required'),
  organizationType: yup.string().required('Organization Type is required'),
  industryType: yup.string().required('Industry Type is required'),
  teamSize: yup.string().required('Team Size is required'),
  yearEstablished: yup.string().required('Year of Establishment is required'),
  aboutUs: yup.string().required('About Us is required').min(20, 'Please write at least 20 characters'),
  location: yup.string().required('Location is required'),
  contactNumber: yup.string().required('Contact Number is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
});
