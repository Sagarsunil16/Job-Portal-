import React, { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        className={`w-full p-4 border rounded-[12px] text-[16px] font-poppins text-[#111111] bg-white outline-none transition-colors min-h-[100px] resize-y
        ${error 
          ? 'border-[#EE1D52] focus:border-[#EE1D52] focus:ring-1 focus:ring-[#EE1D52]' 
          : 'border-[rgba(126,126,134,0.35)] focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF]'
        } 
        ${props.disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : 'bg-white'}
        ${className}`}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
