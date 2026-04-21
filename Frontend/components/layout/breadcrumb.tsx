'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useSidebar } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';

export function Breadcrumb() {
  const pathname = usePathname();
  const { isOpen } = useSidebar();

  // Generate breadcrumbs from pathname
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const breadcrumbItems = ['Dashboard'];

  if (segments[0] === 'admin') {
    breadcrumbItems.push('Admin');
    breadcrumbItems.push(
      ...segments
        .slice(1)
        .filter((segment) => !segment.startsWith('['))
        .map((segment) => segment.replace('-', ' '))
    );
  } else {
    breadcrumbItems.push(...segments.map((segment) => segment.replace('-', ' ')));
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-6 py-3 bg-background border-b border-border text-sm transition-all duration-300',
        isOpen ? 'lg:ml-64' : 'lg:ml-20'
      )}
    >
      {breadcrumbItems.map((segment, index) => (
        <div key={`${segment}-${index}`} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="size-4 text-muted-foreground" />}
          {index === 0 ? (
            <Link
              href="/admin"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {segment}
            </Link>
          ) : (
            <span className="capitalize text-foreground">{segment}</span>
          )}
        </div>
      ))}
    </div>
  );
}
