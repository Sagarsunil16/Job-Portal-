import * as yup from 'yup';

export const jobValidationSchema = yup.object().shape({
  title: yup.string().required('Job title is required').max(100, 'Title is too long'),
  tags: yup.string().required('At least one tag is required (comma separated)'),
  role: yup.string().required('Job role is required'),
  minSalary: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .required('Min salary is required')
    .positive('Min salary must be positive'),
  maxSalary: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .required('Max salary is required')
    .moreThan(yup.ref('minSalary'), 'Max salary must be greater than Min salary'),
  salaryType: yup.string().required('Salary type is required'),
  educationLevel: yup.string().required('Education level is required'),
  experienceLevel: yup.string().required('Experience level is required'),
  type: yup.string().required('Job type is required'),
  jobLevel: yup.string().required('Job level is required'),
  expirationDate: yup
    .date()
    .transform((value, originalValue) => {
      return originalValue ? new Date(originalValue) : value;
    })
    .min(new Date(new Date().setHours(0, 0, 0, 0)), 'Expiration date cannot be in the past')
    .required('Expiration date is required'),
  country: yup.string().required('Country is required'),
  city: yup.string().required('City is required'),
  fullyRemote: yup.boolean().default(false),
  description: yup.string().required('Job description is required').min(50, 'Description must be at least 50 characters long'),
});
