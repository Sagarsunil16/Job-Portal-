import { api } from './api';
import { LoginDTO, SignupDTO, AccountSetupDTO } from '../domain/dtos/AuthDTO';

// Named service functions — keeps page components free from raw HTTP calls

export const loginEmployer = (dto: LoginDTO) =>
  api.post('/auth/login', dto);

export const signupWithSetup = (registrationData: Omit<SignupDTO, 'confirmPassword'>, setupData: AccountSetupDTO) => {
  const formData = new FormData();
  
  // Append standard registration data
  Object.entries(registrationData).forEach(([key, value]) => {
    let cleanValue = String(value);
    if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
      cleanValue = cleanValue.slice(1, -1);
    }
    formData.set(key, cleanValue);
  });

  // Append account setup data + logo file
  Object.entries(setupData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof Blob || value instanceof File) {
        formData.set(key, value);
      } else {
        let cleanValue = String(value);
        if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
          cleanValue = cleanValue.slice(1, -1);
        }
        formData.set(key, cleanValue);
      }
    }
  });

  return api.post('/auth/signup-with-setup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
