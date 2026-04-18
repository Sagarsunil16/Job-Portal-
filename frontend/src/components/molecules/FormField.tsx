import React, { useState } from 'react';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Textarea } from '../atoms/Textarea';
import { PhoneInput } from '../atoms/PhoneInput';
import { FileUpload } from './FileUpload';

export interface FormFieldProps {
  name: string;
  label?: string;
  error?: string;
  type?: string;
  placeholder?: string;
  controlType?: 'input' | 'select' | 'textarea' | 'phone' | 'file';
  options?: { label: string; value: string }[];
  value: any;
  onChange: (e: any) => void;
  showEyeIcon?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  name,
  label, 
  error, 
  type = 'text', 
  controlType = 'input',
  options = [],
  value,
  onChange,
  showEyeIcon, 
  placeholder
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const currentType = showEyeIcon && isVisible ? 'text' : type;

  const renderControl = () => {
    switch (controlType) {
      case 'select':
        return (
          <Select 
            name={name}
            value={value || ''}
            onChange={onChange}
            options={options}
            placeholder={placeholder}
            error={!!error}
          />
        );
      case 'textarea':
        return (
          <Textarea 
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            error={!!error}
          />
        );
      case 'phone':
        return (
          <PhoneInput 
            value={value || ''}
            onChange={(val) => onChange({ target: { name, value: val } })}
            error={!!error}
          />
        );
      case 'file':
        return (
          <FileUpload 
            value={value}
            onChange={(file) => onChange({ target: { name, value: file } })}
            error={!!error}
          />
        );
      case 'input':
      default:
        return (
          <div className="relative">
            <Input 
              name={name}
              type={currentType} 
              value={value || ''}
              onChange={onChange}
              placeholder={placeholder}
              error={!!error}
            />
            {showEyeIcon && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`text-left w-full ${controlType === 'file' ? 'mb-8' : 'mb-[16px]'}`}>
      {label && <label className="block text-[16px] leading-[24px] font-poppins text-[#7E7E86] mb-[4px]">{label}</label>}
      {renderControl()}
      {error && <p className="mt-[4px] text-[14px] leading-[21px] font-poppins text-[#EE1D52]">{error}</p>}
    </div>
  );
};
