import React from 'react';

interface AuthTemplateProps {
  leftContent: React.ReactNode;
  rightImageSrc: string;
  rightImageAlt?: string;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({ 
  leftContent, 
  rightImageSrc, 
  rightImageAlt = 'Background' 
}) => {
  return (
    <div className="min-h-screen flex w-full">
      {/* Left Column */}
      <div className="w-full lg:w-1/2 flex flex-col items-center bg-white p-8">
        <div className="w-full max-w-115 h-full flex flex-col relative justify-center">
          {leftContent}
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:block w-1/2 relative bg-gray-100">
        <img
          src={rightImageSrc}
          alt={rightImageAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
