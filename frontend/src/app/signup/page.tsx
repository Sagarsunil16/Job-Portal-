'use client';

import { useRouter } from 'next/navigation';
import { SignupPageUI } from './components/SignupPageUI';
import { savePendingRegistration } from '../../store/slices/employerSlice';
import { useAppDispatch } from '../../hooks';
import { GuestGuard } from '../../components/guards/GuestGuard';

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSignupSubmit = async (data: Record<string, string>) => {
    // Strip confirmPassword before saving to Redux
    const { confirmPassword, ...registrationData } = data as any;
    
    // Save to Redux temporarily
    dispatch(savePendingRegistration(registrationData));
    
    // Route to the account setup page
    router.push('/account-setup');
  };

  return (
    <GuestGuard>
      <SignupPageUI onSignupSubmit={handleSignupSubmit} />
    </GuestGuard>
  );
}
