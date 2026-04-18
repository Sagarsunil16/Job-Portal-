import React, { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { label: string; value: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className = '', options, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          {...props}
        className={`w-full h-[48px] px-[24px] border rounded-[12px] text-[16px] font-poppins text-[#111111] bg-white outline-none transition-colors appearance-none cursor-pointer
        ${error 
          ? 'border-[#EE1D52] focus:border-[#EE1D52] focus:ring-1 focus:ring-[#EE1D52]' 
          : 'border-[rgba(126,126,134,0.35)] focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF]'
        } 
        ${props.disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : 'bg-white'}
        ${className}`}
      >
        {props.placeholder && (
          <option value="" disabled hidden>
            {props.placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-[24px] top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 9L12 15L6 9" stroke="#434348" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
    );
  }
);

Select.displayName = 'Select';
