import React from 'react';
import { Logo } from '../../../components/atoms/Logo';
import { DynamicForm } from '../../../components/organisms/DynamicForm';
import { accountSetupConfig } from '../../../configs/formConfig';
import { accountSetupSchema } from '../../../utils/validations/authValidation';
import { useAppSelector } from '../../../hooks';

interface AccountSetupPageUIProps {
  onSubmit: (data: Record<string, any>) => void;
}

export const AccountSetupPageUI: React.FC<AccountSetupPageUIProps> = ({ onSubmit }) => {
  const pendingData = useAppSelector((state) => state.employer.pendingRegistrationData);
  
  // Pre-fill email from the signup data
  const initialData = {
    email: pendingData?.email || ''
  };

  return (
    <div className="min-h-screen bg-white font-poppins px-6 lg:px-0 overflow-x-hidden">
      {/* Custom layout: Logo top left, content offset below */}
      <div className="max-w-[1512px] mx-auto relative pt-[48px] lg:pl-[200px]">
        
        {/* Logo Section */}
        <div className="mb-[40px]">
          <Logo />
        </div>

        {/* Content Section */}
        <div className="w-full max-w-[1112px] flex flex-col gap-[32px] pb-[100px] animate-in fade-in duration-500">
          <h1 className="text-[32px] font-medium leading-[48px] text-[#434348]">
            Account Setup
          </h1>

          <DynamicForm 
            config={accountSetupConfig} 
            validationSchema={accountSetupSchema}
            onSubmit={onSubmit} 
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
};
