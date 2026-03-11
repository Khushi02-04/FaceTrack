'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useSidebar } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';

export function Breadcrumb() {
  const pathname = usePathname();
  const { isOpen } = useSidebar();

  // Generate breadcrumbs from pathname
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter((s) => s !== 'dashboard');

  if (segments.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-6 py-3 bg-background border-b border-border text-sm transition-all duration-300',
        isOpen ? 'lg:ml-64' : 'lg:ml-20'
      )}
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="size-4" />
        <span>Dashboard</span>
      </Link>

      {segments.map((segment, index) => (
        <div key={segment} className="flex items-center gap-2">
          <ChevronRight className="size-4 text-muted-foreground" />
          <span className="capitalize text-foreground">
            {segment.replace('-', ' ')}
          </span>
        </div>
      ))}
    </div>
  );
}
