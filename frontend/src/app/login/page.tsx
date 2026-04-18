'use client';

import { useRouter } from 'next/navigation';
import { LoginPageUI } from './components/LoginPageUI';
import { loginSuccess } from '../../store/slices/employerSlice';
import { useAppDispatch } from '../../hooks';
import { loginEmployer } from '../../services/authService';
import { GuestGuard } from '../../components/guards/GuestGuard';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLoginSubmit = async (data: Record<string, string>) => {
    try {
      const response = await loginEmployer(data as any);
      
      if (response.data.status) {
        const { employerId, accessToken, refreshToken, logoUrl } = response.data.data;
        
        // Store refresh token securely in localStorage for interceptor
        localStorage.setItem('refreshToken', refreshToken);
        
        // Dispatch React Context/Redux
        dispatch(loginSuccess({ employerId, accessToken, logoUrl }));
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        alert(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Server error during login');
    }
  };

  return (
    <GuestGuard>
      <LoginPageUI onLoginSubmit={handleLoginSubmit} />
    </GuestGuard>
  );
}
