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
        className={`w-full p-3 border rounded-lg text-[14px] text-black outline-none transition-colors 
        ${error 
          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
          : 'border-gray-300 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]'
        } 
        ${className}`}
      />
    );
  }
);

Input.displayName = 'Input';
