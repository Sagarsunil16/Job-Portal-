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
    <>
      <div className="absolute top-2 left-0 flex items-center">
        <Logo />
      </div>

      <div className="w-full flex flex-col mt-16 md:mt-0">
        <h2 className="text-[28px] font-semibold text-gray-900 mb-2">Welcome to JobPilot</h2>
        <p className="text-[14px] text-gray-500 mb-8">
          Already have an account?{' '}
          <Link href="/login" className="text-gray-700 underline font-medium hover:text-gray-900">
            Log in
          </Link>
        </p>

        <DynamicForm 
          config={signupConfig} 
          validationSchema={signupSchema}
          onSubmit={onSignupSubmit} 
          forgotPasswordLink={
            <div className="text-[13px] text-gray-500 mb-5">
              By creating an account, you agree to the <Link href="#" className="font-medium text-gray-700 underline underline-offset-2">Terms of use</Link> and <Link href="#" className="font-medium text-gray-700 underline underline-offset-2">Privacy Policy</Link>.
            </div>
          }
        />
        
        <Divider text="OR" className="my-6" />
        <SocialAuthButtons actionText="Sign up" />
      </div>
    </>
  );

  return (
    <AuthTemplate 
      leftContent={signupContent}
      rightImageSrc="/images/login-bg.jpg"
      rightImageAlt="Team collaborating"
    />
  );
};
