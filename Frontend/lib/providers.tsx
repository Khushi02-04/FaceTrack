'use client'

import { type ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth-context'
import { TenantProvider } from '@/contexts/tenant-context'
import { SidebarProvider } from '@/contexts/sidebar-context'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TenantProvider>
          <SidebarProvider>
            {children}
            <Toaster />
          </SidebarProvider>
        </TenantProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
