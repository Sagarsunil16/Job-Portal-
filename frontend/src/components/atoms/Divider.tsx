import React from 'react';

interface DividerProps {
  text?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ text, className = '' }) => {
  return (
    <div className={`flex items-center text-[13px] text-gray-400 ${className}`}>
      <div className="flex-1 h-px bg-gray-200"></div>
      {text && <span className="px-4">{text}</span>}
      <div className="flex-1 h-px bg-gray-200"></div>
    </div>
  );
};
