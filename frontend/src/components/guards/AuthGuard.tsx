'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../hooks';
import { hydrate } from '../../store/slices/employerSlice';

const AUTH_KEY = 'employer_auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard protects routes from unauthenticated access.
 * It also handles the 'hydration' of Redux state from localStorage on mountain.
 */
export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem(AUTH_KEY);
    
    if (!isLoggedIn) {
      router.replace('/login');
    } else {
      // Restore Redux state from localStorage before making the page visible
      dispatch(hydrate());
      setIsVisible(true);
    }
  }, [router, dispatch]);

  // Return null (black background if in dark mode) during the flash check
  if (!isVisible) return null;

  return <>{children}</>;
};
