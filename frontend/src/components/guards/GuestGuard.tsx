'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_KEY = 'employer_auth';

interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * GuestGuard prevents authenticated users from accessing guest-only pages (like Login/Signup).
 * If a user is logged in, they are redirected to the dashboard.
 */
export const GuestGuard = ({ children }: GuestGuardProps) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem(AUTH_KEY);
    
    if (isLoggedIn) {
      router.replace('/dashboard');
    } else {
      setIsVisible(true);
    }
  }, [router]);

  // Prevent flash of content or blank space during check
  if (!isVisible) return null;

  return <>{children}</>;
};
