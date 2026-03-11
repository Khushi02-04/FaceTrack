'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import * as Icons from 'lucide-react';
import { MenuItem } from '@/types/common';
import { useSidebar } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';

interface NavItemProps {
  item: MenuItem;
  level?: number;
}

export function NavItem({ item, level = 0 }: NavItemProps) {
  const pathname = usePathname();
  const { isOpen } = useSidebar();
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = item.path ? pathname === item.path : false;
  const hasChildren = item.children && item.children.length > 0;

  // Get the icon component
  const IconComponent =
    Icons[item.icon as keyof typeof Icons] || Icons.Folder;

  const padding = level * 16;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-all',
            'text-sm font-medium',
            'hover:bg-accent hover:text-accent-foreground',
            isActive && 'bg-accent text-accent-foreground'
          )}
          style={{ paddingLeft: `calc(1rem + ${padding}px)` }}
        >
          <div className="flex items-center gap-3 flex-1">
            <IconComponent className="size-4 shrink-0" />
            {isOpen && <span className="truncate">{item.label}</span>}
          </div>
          {isOpen && (
            <Icons.ChevronDown
              className={cn(
                'size-4 shrink-0 transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          )}
        </button>
        {isExpanded && isOpen && (
          <div className="space-y-1">
            {item.children.map((child) => (
              <NavItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.path || '#'}
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-all',
        'text-sm font-medium',
        'hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent text-accent-foreground'
      )}
      style={{ paddingLeft: `calc(1rem + ${padding}px)` }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <IconComponent className="size-4 shrink-0" />
        {isOpen && <span className="truncate">{item.label}</span>}
      </div>
      {item.badge && isOpen && (
        <span className="shrink-0 flex items-center justify-center size-5 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
