'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { Tenant } from '@/types/common'
import { MOCK_COLLEGE } from '@/lib/constants'

interface TenantContextType {
  tenant: Tenant
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

interface TenantProviderProps {
  children: ReactNode
}

export function TenantProvider({ children }: TenantProviderProps) {
  const value: TenantContextType = { tenant: MOCK_COLLEGE }
  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider')
  }
  return context
}
