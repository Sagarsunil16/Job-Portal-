import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'rounded-full text-[15px] cursor-pointer transition-colors flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[#6366f1] text-white hover:bg-indigo-600 px-6 py-3 shadow-sm',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-6 py-3 text-[14px] gap-2',
    text: 'bg-transparent text-gray-500 hover:text-gray-800 p-2 text-[13px] hover:bg-gray-50',
  };

  const widthClass = fullWidth ? 'w-full' : 'flex-1';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
