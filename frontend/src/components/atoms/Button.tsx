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
  const baseStyles = 'cursor-pointer transition-all flex items-center justify-center font-poppins focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#5D5FEF] text-white hover:bg-[#4b4ce0] h-[56px] text-[18px] font-medium rounded-[32px] shadow-sm whitespace-nowrap px-8',
    outline: 'bg-white text-[#434348] border-[1.5px] border-[#E5E5E5] hover:bg-gray-50 h-[56px] text-[18px] rounded-[40px] px-8 gap-4 whitespace-nowrap',
    text: 'bg-transparent text-[#7E7E86] hover:text-[#434348] p-2 text-[14px] hover:bg-gray-50 rounded-lg whitespace-nowrap',
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
