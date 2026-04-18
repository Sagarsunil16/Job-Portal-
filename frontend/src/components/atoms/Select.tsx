import React, { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { label: string; value: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className = '', options, ...props }, ref) => {
    return (
      <select
        ref={ref}
        {...props}
        className={`w-full p-3 border rounded-lg text-[14px] text-black bg-white outline-none transition-colors appearance-none cursor-pointer
        ${error 
          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
          : 'border-gray-300 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]'
        } 
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
    );
  }
);

Select.displayName = 'Select';
