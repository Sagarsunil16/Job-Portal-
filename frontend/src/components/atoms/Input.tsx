import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`w-full h-[48px] px-[24px] border rounded-[12px] text-[16px] font-poppins text-[#111111] placeholder:text-gray-400 outline-none transition-all
        ${error 
          ? 'border-[#EE1D52] focus:border-[#EE1D52] focus:ring-1 focus:ring-[#EE1D52]' 
          : 'border-[rgba(102,102,102,0.35)] focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF]'
        } 
        ${className}`}
      />
    );
  }
);

Input.displayName = 'Input';
