import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-[145px] h-[32px]' }) => {
  return (
    <img 
      src="/images/Logo.svg" 
      alt="JobPilot Logo" 
      className={`${className} object-contain`} 
    />
  );
};
