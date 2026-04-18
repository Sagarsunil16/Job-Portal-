import React from 'react';
import Link from 'next/link';
import { AuthTemplate } from '../../../components/templates/AuthTemplate';
import { Logo } from '../../../components/atoms/Logo';
import { Divider } from '../../../components/atoms/Divider';
import { SocialAuthButtons } from '../../../components/molecules/SocialAuthButtons';
import { DynamicForm } from '../../../components/organisms/DynamicForm';
import { signupConfig } from '../../../configs/formConfig';
import { signupSchema } from '../../../utils/validations/authValidation';

interface SignupPageUIProps {
  onSignupSubmit: (data: Record<string, string>) => void;
}

export const SignupPageUI: React.FC<SignupPageUIProps> = ({ onSignupSubmit }) => {
  const signupContent = (
    /* Form Wrapper: Absolute positioning on desktop, fixed width as per Figma */
    <div className="xl:absolute xl:left-[80px] xl:top-[120px] w-full max-w-[682px] flex flex-col gap-6 sm:gap-[32px] animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col gap-[2px] xl:w-[331px]">
        <h2 className="text-2xl sm:text-[32px] font-medium leading-tight sm:leading-[48px] text-[#434348] font-poppins flex items-center">
          Welcome to JobPilot
        </h2>
        <div className="flex items-center gap-[4px] xl:w-[266px] h-[28px] p-[2px]">
          <span className="text-sm sm:text-[16px] leading-[24px] text-[#434348] font-poppins">
            Already have an account?
          </span>
          <Link href="/login" className="text-sm sm:text-[16px] leading-[24px] text-[#434348] font-poppins underline decoration-1 underline-offset-2">
            Log in
          </Link>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-col">
        <DynamicForm 
          config={signupConfig} 
          validationSchema={signupSchema}
          onSubmit={onSignupSubmit} 
          forgotPasswordLink={
            <div className="xl:w-[584px] text-sm sm:text-[16px] leading-relaxed sm:leading-[24px] text-[#434348] mb-[24px] font-poppins">
              By creating an account, you agree to the{' '}
              <Link href="#" className="font-medium text-[#434348] underline decoration-1 underline-offset-2 hover:text-[#5D5FEF]">
                Terms of use
              </Link>{' '}
              and{' '}
              <Link href="#" className="font-medium text-[#434348] underline decoration-1 underline-offset-2 hover:text-[#5D5FEF]">
                Privacy Policy
              </Link>.
            </div>
          }
        />
      </div>

      {/* Divider and Social Section */}
      <div className="flex flex-col gap-[24px]">
        <Divider text="OR" />
        <SocialAuthButtons actionText="Sign up" />
      </div>
    </div>
  );

  return (
    <AuthTemplate 
      logo={<Logo />}
      leftContent={signupContent}
      rightImageSrc="/images/login-bg.jpg"
      rightImageAlt="Team collaborating"
    />
  );
};
