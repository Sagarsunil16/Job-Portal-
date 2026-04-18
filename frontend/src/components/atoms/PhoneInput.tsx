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
        className={`w-full h-[48px] px-[24px] border rounded-[12px] text-[16px] font-poppins text-[#111111] transition-all flex items-center
        ${error 
          ? 'border-[#EE1D52] focus-within:border-[#EE1D52] focus-within:ring-1 focus-within:ring-[#EE1D52]' 
          : 'border-[rgba(126,126,134,0.35)] focus-within:border-[#5D5FEF] focus-within:ring-1 focus-within:ring-[#5D5FEF]'
        } 
        ${props.disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : 'bg-white'}
        ${className}`}
      >
        <PhoneInputLib
          placeholder="Enter phone number"
          ref={ref as any}
          value={value}
          onChange={onChange as any} 
          defaultCountry="US"
          className="w-full flex items-center outline-none [&_input]:outline-none [&_input]:border-none [&_input]:bg-transparent [&_input]:font-poppins [&_input]:text-[16px] [&_input]:text-[#111111] [&_.PhoneInputCountry]:border-r [&_.PhoneInputCountry]:border-[rgba(126,126,134,0.35)] [&_.PhoneInputCountry]:pr-3 [&_.PhoneInputCountry]:mr-3 [&_.PhoneInputCountrySelectArrow]:text-[#434348]"
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
