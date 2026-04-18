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
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="w-full px-6 md:px-12 lg:px-16 h-[80px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none"
            onClick={() => dispatch(toggleMobileSidebar())}
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/dashboard" className="flex items-center">
            <Logo />
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/post-job">
            <Button 
              variant="outline" 
              className="!border-indigo-500 !text-indigo-600 hover:!bg-indigo-50 !py-2 !px-4"
            >
              Post a Job
            </Button>
          </Link>
          
          <div className="w-[45px] h-[45px] rounded-full bg-[#E85C9F] flex items-center justify-center overflow-hidden shrink-0 border-2 border-white shadow-sm">
            {logoUrl ? (
              <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
