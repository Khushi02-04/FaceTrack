'use client';

import { useAuth } from '@/contexts/auth-context';
import { useSidebar } from '@/contexts/sidebar-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  Moon,
  Sun,
  LogOut,
  Settings,
  User,
  Search,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function Topbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { isOpen } = useSidebar();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-background border-b border-border transition-all duration-300 ${
        isOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}
    >
      {/* Left Section - Search */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm px-4 py-2 rounded-lg bg-accent/50 border border-border">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm placeholder-muted-foreground outline-none"
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-destructive" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </Button>

        {/* User Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="size-8 rounded-full"
                  />
                ) : (
                  <User className="size-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1 capitalize">
                  {user.role}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="size-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="size-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
