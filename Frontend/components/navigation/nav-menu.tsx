'use client';

import { MenuItem } from '@/types/common';
import { NavItem } from './nav-item';

interface NavMenuProps {
  items: MenuItem[];
}

export function NavMenu({ items }: NavMenuProps) {
  return (
    <nav className="space-y-1 py-4">
      {items.map((item) => (
        <NavItem key={item.id} item={item} />
      ))}
    </nav>
  );
}
