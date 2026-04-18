import React from 'react';

interface DividerProps {
  text?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ text, className = '' }) => {
  return (
    <div className={`flex items-center text-[16px] font-poppins text-[#7E7E86] ${className}`}>
      <div className="flex-1 h-[2px] bg-[rgba(102,102,102,0.25)]"></div>
      {text && <span className="px-[23px]">{text}</span>}
      <div className="flex-1 h-[2px] bg-[rgba(102,102,102,0.25)]"></div>
    </div>
  );
};
