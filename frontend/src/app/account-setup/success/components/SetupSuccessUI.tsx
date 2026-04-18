import React from 'react';
import Link from 'next/link';
import { Logo } from '../../../../components/atoms/Logo';
import { Button } from '../../../../components/atoms/Button';
import { CenteredCardTemplate } from '../../../../components/templates/CenteredCardTemplate';

export const SetupSuccessUI: React.FC = () => {
  return (
    <CenteredCardTemplate>
      <div className="mb-8">
        <Logo />
      </div>

      <div className="flex flex-col items-center justify-center flex-grow min-h-[65vh] text-center w-full">
        {/* Success Checkmark Circle */}
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h2 className="text-[20px] md:text-[24px] font-semibold text-gray-900 mb-8">
          🎉 Congratulations, Your profile is 100% complete!
        </h2>

        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="primary" className="!bg-indigo-100 !text-[#5D5FEF] !shadow-none hover:!bg-indigo-200 px-8">
              View Dashboard
            </Button>
          </Link>
          <Link href="/post-job">
            <Button variant="primary" className="px-8">
              Post a Job
            </Button>
          </Link>
        </div>
      </div>
    </CenteredCardTemplate>
  );
};
