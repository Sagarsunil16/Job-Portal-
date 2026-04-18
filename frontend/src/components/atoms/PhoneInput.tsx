import React, { forwardRef } from 'react';
import PhoneInputLib from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, error, className = '', ...props }, ref) => {
    return (
      <div 
        className={`w-full p-3 border rounded-lg text-[14px] text-black bg-white transition-colors flex items-center
        ${error 
          ? 'border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500' 
          : 'border-gray-300 focus-within:border-[#6366f1] focus-within:ring-1 focus-within:ring-[#6366f1]'
        } 
        ${className}`}
      >
        <PhoneInputLib
          placeholder="Enter phone number"
          value={value}
          onChange={onChange as any} // react-phone-number-input typing quirk
          defaultCountry="US"
          className="w-full outline-none [&_input]:outline-none [&_input]:border-none [&_input]:bg-transparent"
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
