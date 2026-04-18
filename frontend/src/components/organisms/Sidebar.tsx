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
  { name: 'Employers profile', href: '/dashboard/profile', icon: User },
  { name: 'Post a Job', href: '/dashboard/post-job', icon: PlusCircle },
  { name: 'My Jobs', href: '/dashboard/my-jobs', icon: Briefcase },
  { name: 'Saved Candidate', href: '/dashboard/candidates', icon: Bookmark },
  { name: 'Plans & Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
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

      <aside className={`w-[280px] h-full bg-white border-r border-gray-200 flex flex-col pt-6 shrink-0 
        fixed md:relative top-0 left-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0`}
      >
      <div className="px-8 pb-4">
        <span className="text-xs font-semibold text-gray-400 tracking-wider">EMPLOYERS DASHBOARD</span>
      </div>
      
      <nav className="flex-1 px-4 flex flex-col gap-1">
        {MENU_ITEMS.map((item) => {
          const isActive = 
            item.href === '/dashboard' 
              ? pathname === '/dashboard' || source === 'overview'
              : item.href === '/dashboard/my-jobs'
                ? pathname.startsWith('/dashboard/my-jobs') || (pathname.startsWith('/dashboard/jobs') && source !== 'overview')
                : source === 'overview' ? false : pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-[#EBF1FF] text-indigo-600 border-l-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
    </>
  );
};
