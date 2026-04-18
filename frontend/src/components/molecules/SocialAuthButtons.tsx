import React from 'react';
import { Button } from '../atoms/Button';

interface SocialAuthButtonsProps {
  actionText?: string;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ actionText = 'Log in' }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-[16px] w-full max-w-[682px]">
      <Button variant="outline" type="button" className="w-full sm:flex-1 h-[56px] px-4 sm:px-8">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#0C82EE" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073C24 5.405 18.627 0 12 0C5.373 0 0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24V15.563H7.078V12.073H10.125V9.414C10.125 6.402 11.916 4.732 14.656 4.732C15.969 4.732 17.344 4.966 17.344 4.966V7.92H15.83C14.34 7.92 13.875 8.844 13.875 9.791V12.073H17.203L16.671 15.563H13.875V24C19.612 23.094 24 18.1 24 12.073Z"/></svg>
        <span className="text-[14px] sm:text-[18px] font-poppins text-[#434348] ml-3 sm:ml-4">{actionText} with Facebook</span>
      </Button>
      <Button variant="outline" type="button" className="w-full sm:flex-1 h-[56px] px-4 sm:px-8">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.06 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        <span className="text-[14px] sm:text-[18px] font-poppins text-[#434348] ml-3 sm:ml-4">{actionText} with Google</span>
      </Button>
    </div>
  );
};
