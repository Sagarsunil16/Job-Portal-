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
      className={`relative w-full rounded-lg border-2 border-dashed p-8 text-center transition-colors
        ${dragActive ? 'border-[#6366f1] bg-indigo-50' : 'border-gray-300 bg-white hover:bg-gray-50'}
        ${error ? 'border-red-500' : ''}
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
        <div className="flex flex-col items-center">
          <img src={previewUrl} alt="Preview" className="h-24 w-auto object-contain rounded mb-4" />
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); if (onChange) onChange(null); }}
            className="text-[13px] text-red-500 hover:text-red-700 font-medium"
          >
            Remove / Change Photo
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center cursor-pointer" onClick={triggerSelect}>
          <svg className="mb-3 w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
          </svg>
          <p className="text-[14px] text-gray-600 mb-1">
            <span className="font-semibold text-gray-900">Browse photo</span> or drop here
          </p>
          <p className="text-[12px] text-gray-400">
            A photo larger than 400 pixels work best. <br/> Max file size 5 MB.
          </p>
        </div>
      )}
    </div>
  );
};
