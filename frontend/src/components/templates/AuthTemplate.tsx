import React from 'react';

interface AuthTemplateProps {
  children?: React.ReactNode; // Alternative to leftContent for more flexibility
  leftContent?: React.ReactNode;
  logo?: React.ReactNode;
  rightImageSrc: string;
  rightImageAlt?: string;
}

/**
 * AuthTemplate provides a split layout for Auth pages.
 * Desktop specification: Left Section (842px wide), Right Section (Image).
 * Provides absolute anchors for Logo and Form positioning.
 */
export const AuthTemplate: React.FC<AuthTemplateProps> = ({ 
  leftContent, 
  children,
  logo,
  rightImageSrc, 
  rightImageAlt = 'Background' 
}) => {
  const content = children || leftContent;

  return (
    <div className="min-h-screen flex flex-col xl:flex-row w-full bg-white relative">
      {/* Left Section - Strict 842px column on XL screens */}
      <div className="w-full xl:w-[842px] xl:shrink-0 relative bg-white flex flex-col">
        
        {/* Universal Logo Container (Absolute Positioned at 80/48) */}
        {logo && (
          <div className="xl:absolute xl:left-[80px] xl:top-[48px] px-6 pt-8 xl:p-0 z-20">
            {logo}
          </div>
        )}

        {/* Content Anchor Shell: Added bottom padding for scroll space */}
        <div className="flex-1 relative w-full xl:min-h-[982px] flex flex-col items-center xl:items-start px-6 pt-32 pb-20 xl:p-0">
          {content}
        </div>
      </div>

      {/* Right Section - Visible only on XL screens (>1280px) */}
      <div className="hidden xl:block flex-1 relative bg-gray-100">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={rightImageSrc}
            alt={rightImageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
