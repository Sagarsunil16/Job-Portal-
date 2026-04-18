'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../atoms/Logo';
import { Button } from '../atoms/Button';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { toggleMobileSidebar } from '../../store/slices/employerSlice';
import { Menu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { logoUrl } = useAppSelector((state) => state.employer);
  const dispatch = useAppDispatch();
  
  return (
    <nav className="w-full bg-white border-b border-[#E5E5E6] sticky top-0 z-50">
      <div className="w-full px-6 md:px-10 h-18 md:h-[96px] flex items-center justify-between">
        {/* Left Section: Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 text-[#434348] hover:bg-gray-100 rounded-md focus:outline-none"
            onClick={() => dispatch(toggleMobileSidebar())}
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/dashboard" className="flex items-center">
            <Logo />
          </Link>
        </div>
        
        {/* Right Section: CTA & Profile */}
        <div className="flex items-center gap-6">
          {/* Post a Job Button - Desktop Only */}
          <Link href="/post-job" className="hidden sm:block">
            <Button 
              variant="outline" 
              className="w-30! md:w-[158px]! h-10! md:h-[48px]! border-[1.5px]! border-[#5D5FEF]! text-[#5D5FEF]! text-[18px]! font-medium! leading-[27px]! rounded-[32px]! px-0! flex items-center justify-center hover:bg-[#F5F5FF]! transition-colors"
            >
              Post a Job
            </Button>
          </Link>
          
          {/* User Profile - 48x48px circle */}
          <div className="w-10 md:w-[48px] h-10 md:h-[48px] rounded-full bg-[#EF5DA8] flex items-center justify-center overflow-hidden shrink-0 transition-transform hover:scale-105 cursor-pointer">
            {logoUrl ? (
              <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
