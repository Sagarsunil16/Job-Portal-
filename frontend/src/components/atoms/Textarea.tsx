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
        className={`w-full p-3 border rounded-lg text-[14px] text-black outline-none transition-colors min-h-[100px] resize-y
        ${error 
          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
          : 'border-gray-300 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]'
        } 
        ${className}`}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
