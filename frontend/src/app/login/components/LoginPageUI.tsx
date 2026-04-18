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
    <>
      {/* Logo positioned absolute at the top, aligned perfectly left with the form text */}
      <div className="absolute top-2 left-0 flex items-center">
        <Logo />
      </div>

      <div className="w-full flex flex-col mt-16 md:mt-0">
        <h2 className="text-[28px] font-semibold text-gray-900 mb-2">Log In to JobPilot</h2>
        <p className="text-[14px] text-gray-500 mb-8">
          Don't have an account?{' '}
          <Link href="/signup" className="text-gray-700 underline font-medium hover:text-gray-900">
            Sign Up
          </Link>
        </p>

        <DynamicForm 
          config={loginConfig} 
          validationSchema={loginSchema}
          onSubmit={onLoginSubmit} 
          forgotPasswordLink={
            <div className="text-right mb-5 -mt-2.5">
              <Link href="/forgot-password" className="text-[13px] text-gray-500 hover:text-gray-800 underline decoration-gray-400">
                Forget your password
              </Link>
            </div>
          }
        />

        <Divider text="OR" className="my-6" />
        <SocialAuthButtons />
      </div>
    </>
  );

  return (
    <AuthTemplate 
      leftContent={loginContent}
      rightImageSrc="/images/login-bg.jpg"
      rightImageAlt="Team collaborating"
    />
  );
};
