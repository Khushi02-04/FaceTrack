'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { Breadcrumb } from './breadcrumb';
import { useSidebar } from '@/contexts/sidebar-context';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Page Content */}
        <main
          className={`flex-1 overflow-y-auto px-6 py-6 transition-all duration-300 ${
            isOpen ? 'lg:ml-0' : 'lg:ml-0'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
