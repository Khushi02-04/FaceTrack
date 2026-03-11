'use client';

import Link from 'next/link';
import { useSidebar } from '@/contexts/sidebar-context';
import { useTenant } from '@/contexts/tenant-context';
import { DASHBOARD_MENU_ITEMS } from '@/lib/constants';
import { NavMenu } from '@/components/navigation/nav-menu';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { isOpen, toggle } = useSidebar();
  const { tenant } = useTenant();

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="lg:hidden fixed top-4 left-4 z-40"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {/* Sidebar Backdrop (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm lg:hidden z-30"
          onClick={() => toggle()}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex flex-col h-full bg-sidebar border-r border-border transition-all duration-300',
          'w-64 lg:sticky lg:top-0',
          !isOpen && '-translate-x-full lg:translate-x-0 lg:w-20'
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-4 py-6 border-b border-border">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-primary-foreground shrink-0">
            <span className="font-bold text-lg">CMS</span>
          </div>
          {isOpen && (
            <div className="flex flex-col flex-1 min-w-0">
              <h1 className="text-sm font-bold truncate">College ERP</h1>
              <p className="text-xs text-muted-foreground truncate">
                {tenant.name}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-2">
          <NavMenu items={DASHBOARD_MENU_ITEMS} />
        </div>

        {/* Footer Section */}
        <div className="px-2 py-4 border-t border-border space-y-2">
          {isOpen && (
            <p className="text-xs text-muted-foreground px-2 font-medium">
              System Status
            </p>
          )}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/50">
            <div className="size-2 rounded-full bg-green-500" />
            {isOpen && <span className="text-xs font-medium">Online</span>}
          </div>
        </div>
      </aside>
    </>
  );
}
