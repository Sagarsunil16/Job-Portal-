'use client';

import { useRouter } from 'next/navigation';
import { AccountSetupPageUI } from './components/AccountSetupPageUI';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginSuccess, clearPendingRegistration } from '../../store/slices/employerSlice';
import { signupWithSetup } from '../../services/authService';
import { AccountSetupDTO } from '../../domain/dtos/AuthDTO';

export default function AccountSetupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pendingRegistrationData = useAppSelector((state) => state.employer.pendingRegistrationData);

  const handleSetupSubmit = async (data: Record<string, any>) => {
    if (!pendingRegistrationData) {
      alert("Registration data lost. Please start over.");
      router.push('/signup');
      return;
    }

    try {
      const response = await signupWithSetup(pendingRegistrationData, data as AccountSetupDTO);

      if (response.data.status) {
        const { employerId, accessToken, refreshToken } = response.data.data;
        
        localStorage.setItem('refreshToken', refreshToken);
        dispatch(loginSuccess({ employerId, accessToken }));
        
        router.push('/account-setup/success');
      } else {
        alert(response.data.message || 'Setup failed');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Server error during setup');
      console.error(error);
    }
  };

  return <AccountSetupPageUI onSubmit={handleSetupSubmit} />;
}
