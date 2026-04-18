import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-8.25 w-auto' }) => {
  return (
    <img 
      src="/images/Logo.svg" 
      alt="JobPilot Logo" 
      className={className} 
    />
  );
};
