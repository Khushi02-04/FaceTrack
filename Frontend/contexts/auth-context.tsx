'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { User, UserRole, UserStatus, AuthContextType } from '@/types/auth'
import { MOCK_COLLEGE } from '@/lib/constants'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock credentials for different roles
const MOCK_CREDENTIALS = {
  admin: {
    email: 'admin@college.edu',
    password: 'admin123',
    user: {
      id: 'user-001',
      email: 'admin@college.edu',
      name: 'Dr. Admin User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      collegeName: MOCK_COLLEGE.name,
      createdAt: new Date('2024-01-01'),
    },
  },
  professor: {
    email: 'professor@college.edu',
    password: 'prof123',
    user: {
      id: 'user-002',
      email: 'professor@college.edu',
      name: 'Dr. John Professor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=professor',
      role: UserRole.TEACHER,
      status: UserStatus.ACTIVE,
      collegeName: MOCK_COLLEGE.name,
      createdAt: new Date('2024-01-15'),
    },
  },
  student: {
    email: 'student@college.edu',
    password: 'student123',
    user: {
      id: 'user-003',
      email: 'student@college.edu',
      name: 'John Student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      collegeName: MOCK_COLLEGE.name,
      createdAt: new Date('2024-02-01'),
    },
  },
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null
        if (stored) {
          const parsedUser = JSON.parse(stored)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check against mock credentials
      let validUser: User | null = null
      for (const credType of Object.values(MOCK_CREDENTIALS)) {
        if (credType.email === email && credType.password === password) {
          validUser = credType.user as unknown as User
          break
        }
      }

      if (!validUser) {
        throw new Error('Invalid email or password')
      }

      setUser(validUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(validUser))
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (
    email: string,
    name: string,
    password: string
  ): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        collegeName: MOCK_COLLEGE.name,
        createdAt: new Date(),
      }

      setUser(newUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(newUser))
      }
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_user')
      }
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
