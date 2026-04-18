import React from 'react';
import Link from 'next/link';
import { Logo } from '../../../../components/atoms/Logo';
import { Button } from '../../../../components/atoms/Button';
import { CenteredCardTemplate } from '../../../../components/templates/CenteredCardTemplate';

export const SetupSuccessUI: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-poppins px-6 lg:px-0 overflow-x-hidden">
      {/* Custom layout: Logo top left, content offset below to match Setup page */}
      <div className="max-w-[1512px] mx-auto relative pt-[48px] lg:pl-[200px]">
        
        {/* Logo Section */}
        <div className="mb-[40px]">
          <Logo />
        </div>

        {/* Success Content - Offset vertically as per Figma top: 357px (pt-48 + logo 32 + mb-40 + pt-237 = 357px) */}
        <div className="w-full max-w-[1112px] flex flex-col items-center justify-center pt-[100px] md:pt-[237px] gap-[32px] animate-in fade-in zoom-in duration-500">
          
          {/* Success Checkmark Circle - 80x80px */}
          <div className="w-[80px] h-[80px] bg-[#E5E6FB] rounded-[62px] flex items-center justify-center relative flex-shrink-0">
            {/* ditto double-tick Icon matching the provided image */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 13L7 18L18 7" stroke="#5D5FEF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 13L11 18L22 7" stroke="#5D5FEF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Header Text */}
          <div className="flex flex-col items-center text-center max-w-[596px] px-4">
            <h1 className="text-[20px] md:text-[24px] font-medium leading-tight md:leading-[36px] text-[#434348]">
              🎉 Congratulations, Your profile is 100% complete!
            </h1>
          </div>

          {/* Buttons Section - Stacked on mobile, row on desktop */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-[12px] md:gap-[8px] w-full md:w-auto">
            <Link href="/dashboard" className="w-full md:w-auto">
              <Button 
                variant="primary" 
                className="!w-full md:!w-[229px] !h-[48px] !bg-[#E5E6FB] !text-[#5D5FEF] !text-[18px] !font-medium !leading-[27px] !shadow-none hover:!bg-[#d8d9f5]"
              >
                View Dashboard
              </Button>
            </Link>
            <Link href="/post-job" className="w-full md:w-auto">
              <Button 
                variant="primary" 
                className="!w-full md:!w-[229px] !h-[48px] !text-[18px] !font-medium !leading-[27px] !shadow-none"
              >
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
