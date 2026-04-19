import React from 'react';
import { Navbar } from '../../components/organisms/Navbar';
import { Sidebar } from '../../components/organisms/Sidebar';
import { AuthGuard } from '../../components/guards/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col h-screen bg-white overflow-hidden w-screen max-w-full overflow-x-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden w-full max-w-full">
          <Sidebar />
          <main className="flex-1 overflow-y-auto w-full max-w-full px-6 md:px-12 py-8 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
