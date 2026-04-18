'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout, toggleMobileSidebar } from '../../store/slices/employerSlice';
import { 
  LayoutDashboard, 
  User, 
  PlusCircle, 
  Briefcase, 
  Bookmark, 
  CreditCard, 
  Settings,
  LogOut 
} from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Employers profile', href: '#', icon: User, disabled: true },
  { name: 'Post a Job', href: '/post-job', icon: PlusCircle },
  { name: 'My Jobs', href: '/my-jobs', icon: Briefcase },
  { name: 'Saved Candidate', href: '#', icon: Bookmark, disabled: true },
  { name: 'Plans & Billing', href: '#', icon: CreditCard, disabled: true },
  { name: 'Settings', href: '#', icon: Settings, disabled: true },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const source = searchParams.get('source');

  const { isMobileSidebarOpen } = useAppSelector((state) => state.employer);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in transition-opacity"
          onClick={() => dispatch(toggleMobileSidebar())}
        />
      )}

      <aside className={`w-[320px] h-full bg-white border-r border-[#E5E5E6] flex flex-col py-5 pl-10 pr-0 shrink-0 
        fixed md:relative top-0 left-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0`}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col gap-[11px]">
            <div className="w-[280px]">
              <span className="text-[14px] font-medium text-[#7E7E86] leading-[21px] tracking-tight">EMPLOYERS DASHBOARD</span>
            </div>
            
            <nav className="flex flex-col">
              {MENU_ITEMS.map((item) => {
                if (item.disabled) {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.name} 
                      className="flex items-center gap-[16px] w-[280px] h-[48px] px-[20px] py-[12px] text-[16px] font-medium text-[#7E7E86] opacity-40 cursor-not-allowed font-poppins"
                    >
                      <Icon className="w-6 h-6 text-[#7E7E86]" />
                      <span className="flex-1">{item.name}</span>
                    </div>
                  );
                }

                const isActive = 
                  item.href === '/dashboard' 
                    ? pathname === '/dashboard' || source === 'overview'
                    : item.href === '/my-jobs'
                      ? pathname.startsWith('/my-jobs') || (pathname.startsWith('/jobs') && source !== 'overview')
                      : source === 'overview' ? false : pathname.startsWith(item.href);
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`flex items-center gap-[16px] w-[280px] h-[48px] px-[20px] py-[12px] text-[16px] font-medium transition-colors font-poppins ${
                      isActive 
                        ? 'bg-[#E5E6FB] text-[#5D5FEF] border-l-[3px] border-[#5D5FEF]' 
                        : 'text-[#7E7E86] hover:text-[#333333]'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isActive ? 'text-[#5D5FEF]' : 'text-[#7E7E86]'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="w-[280px]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-[16px] w-full h-[48px] px-[20px] py-[12px] text-[16px] font-medium text-[#7E7E86] hover:text-[#333333] transition-colors"
            >
              <LogOut className="w-6 h-6 text-[#7E7E86]" />
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
