import React, { useState, useRef } from 'react';

export interface FileUploadProps {
  label?: string;
  error?: boolean;
  value?: File | string | null;
  onChange?: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ error, onChange, value }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derive preview URL if value is provided
  const previewUrl = value 
    ? (typeof value === 'string' ? value : URL.createObjectURL(value))
    : null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (onChange) onChange(file);
  };

  const triggerSelect = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`relative w-[332px] h-[160px] rounded-lg border-2 border-dashed transition-colors flex flex-col items-center justify-center p-4
        ${dragActive ? 'border-[#5D5FEF] bg-indigo-50' : 'border-[#D7DADE] bg-white hover:bg-gray-50'}
        ${error ? 'border-[#EE1D52]' : ''}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        ref={inputRef}
        type="file" 
        className="hidden" 
        accept="image/*"
        onChange={handleChange}
      />

      {previewUrl ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <img src={previewUrl} alt="Preview" className="h-16 w-auto object-contain rounded mb-2" />
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); if (onChange) onChange(null); }}
            className="text-[12px] text-red-500 hover:text-red-700 font-poppins font-medium"
          >
            Remove / Change Photo
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center cursor-pointer text-center" onClick={triggerSelect}>
          {/* cloud-upload Icon Placeholder as per Figma */}
          {/* High-fidelity cloud-upload Icon as per Figma */}
          <div className="w-12 h-12 mb-2 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V9M12 9L15 12M12 9L9 12" stroke="#7E7E86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 16.5C18.2091 16.5 20 14.7091 20 12.5C20 10.4357 18.4312 8.73602 16.4258 8.51731C15.9427 6.49504 14.1455 5 12 5C10.0355 5 8.35414 6.27301 7.74959 8.04374C5.59083 8.32832 4 10.222 4 12.5C4 14.7091 5.79086 16.5 8 16.5" stroke="#7E7E86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-poppins font-medium text-[12px] leading-[18px] text-[#434348]">
            <span className="text-[#5D5FEF] font-medium">Browse photo</span> or drop here
          </p>
          <p className="font-poppins font-normal text-[11px] leading-[16px] text-[#7E7E86] mt-1 max-w-[232px]">
            A photo larger than 400 pixels work best. Max file size 5 MB.
          </p>
        </div>
      )}
    </div>
  );
};
