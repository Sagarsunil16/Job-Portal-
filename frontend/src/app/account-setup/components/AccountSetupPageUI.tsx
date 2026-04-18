import React from 'react';
import { CenteredCardTemplate } from '../../../components/templates/CenteredCardTemplate';
import { Logo } from '../../../components/atoms/Logo';
import { DynamicForm } from '../../../components/organisms/DynamicForm';
import { accountSetupConfig } from '../../../configs/formConfig';
import { accountSetupSchema } from '../../../utils/validations/authValidation';

interface AccountSetupPageUIProps {
  onSubmit: (data: Record<string, any>) => void;
}

export const AccountSetupPageUI: React.FC<AccountSetupPageUIProps> = ({ onSubmit }) => {
  return (
    <CenteredCardTemplate>
      <div className="mb-8">
        <Logo />
      </div>
      
      <h1 className="text-[32px] font-semibold text-gray-900 mb-8">
        Account Setup
      </h1>

      <DynamicForm 
        config={accountSetupConfig} 
        validationSchema={accountSetupSchema}
        onSubmit={onSubmit} 
      />
    </CenteredCardTemplate>
  );
};
