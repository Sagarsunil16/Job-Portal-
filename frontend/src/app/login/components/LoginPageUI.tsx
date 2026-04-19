import React from 'react';
import Link from 'next/link';
import { AuthTemplate } from '../../../components/templates/AuthTemplate';
import { Logo } from '../../../components/atoms/Logo';
import { Divider } from '../../../components/atoms/Divider';
import { SocialAuthButtons } from '../../../components/molecules/SocialAuthButtons';
import { DynamicForm } from '../../../components/organisms/DynamicForm';
import { loginConfig } from '../../../configs/formConfig';
import { loginSchema } from '../../../utils/validations/authValidation';

interface LoginPageUIProps {
  onLoginSubmit: (data: Record<string, string>) => void;
}

export const LoginPageUI: React.FC<LoginPageUIProps> = ({ onLoginSubmit }) => {
  const loginContent = (
    /* Form Wrapper: Absolute positioning on desktop as per Figma */
    <div className="xl:absolute xl:left-[80px] xl:top-[224px] w-full max-w-[682px] flex flex-col gap-6 sm:gap-[32px] animate-in fade-in duration-500">
      
      {/* Demo Credentials Section - Made more minute and moved to top */}
      <div className="py-2 px-3 bg-indigo-50/40 border border-indigo-100/50 rounded-[8px] flex items-center justify-between w-fit animate-in fade-in duration-700">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-[#5D5FEF] uppercase tracking-[0.5px] font-poppins shrink-0">Demo:</span>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5">
                <span className="text-[12px] text-[#7E7E86] font-poppins">Email:</span>
                <code className="text-[12px] font-semibold text-[#434348] font-poppins select-all">bluemax@gmail.com</code>
             </div>
             <div className="flex items-center gap-1.5">
                <span className="text-[12px] text-[#7E7E86] font-poppins">Pass:</span>
                <code className="text-[12px] font-semibold text-[#434348] font-poppins select-all">Sagar123#</code>
             </div>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col gap-[2px]">
        <h2 className="text-2xl sm:text-[32px] font-medium leading-tight sm:leading-[48px] text-[#434348] font-poppins flex items-center">
          Log In to JobPilot
        </h2>
        <div className="flex items-center gap-[4px] p-[2px] flex-wrap">
          <span className="text-sm sm:text-[16px] leading-[24px] text-[#434348] font-poppins">
            Don't have an account?
          </span>
          <Link href="/signup" className="text-sm sm:text-[16px] leading-[24px] text-[#434348] font-poppins underline decoration-1 underline-offset-2">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-col">
        <DynamicForm 
          config={loginConfig} 
          validationSchema={loginSchema}
          onSubmit={onLoginSubmit} 
          forgotPasswordLink={
            <div className="flex justify-end mt-[4px] mb-[24px]">
              <Link href="/forgot-password" title="Forget your password" className="text-[16px] leading-[24px] text-[#434348] font-poppins underline underline-offset-2">
                Forget your password
              </Link>
            </div>
          }
        />
      </div>

      {/* Divider and Social Section */}
      <div className="flex flex-col gap-[24px]">
        <Divider text="OR" />
        <SocialAuthButtons />
      </div>
    </div>
  );

  return (
    <AuthTemplate 
      logo={<Logo />}
      leftContent={loginContent}
      rightImageSrc="/images/login-bg.jpg"
      rightImageAlt="Team collaborating"
    />
  );
};
