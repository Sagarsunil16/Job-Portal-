import React from 'react';

interface CenteredCardTemplateProps {
  children: React.ReactNode;
}

export const CenteredCardTemplate: React.FC<CenteredCardTemplateProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-white flex items-start justify-center py-10 px-4 md:px-12">
      <div className="w-full max-w-[1024px]">
        {children}
      </div>
    </div>
  );
};
