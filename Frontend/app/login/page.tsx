'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogIn, CheckCircle2, AlertCircle } from 'lucide-react'

// Mock credentials for each role
const ROLE_CREDENTIALS = {
  admin: {
    email: 'admin@college.edu',
    password: 'admin123',
    label: 'Login as Admin',
  },
  professor: {
    email: 'professor@college.edu',
    password: 'prof123',
    label: 'Login as Professor',
  },
  student: {
    email: 'student@college.edu',
    password: 'student123',
    label: 'Login as Student',
  },
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('admin')

  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Update credentials when tab changes
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue)
    const creds = ROLE_CREDENTIALS[tabValue as keyof typeof ROLE_CREDENTIALS]
    if (creds) {
      setEmail(creds.email)
      setPassword(creds.password)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      
      toast({
        title: 'Login Successful',
        description: `Welcome back! Redirecting to dashboard...`,
        duration: 2000,
      })

      // Use a small delay to ensure auth state updates
      setTimeout(() => {
        router.push('/admin')
      }, 500)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed. Please try again.'
      setError(errorMsg)
      
      toast({
        title: 'Login Failed',
        description: errorMsg,
        variant: 'destructive',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-primary-foreground">
            <span className="font-bold">CMS</span>
          </div>
        </div>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Select your role and sign in to access your College ERP dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="professor">Professor</TabsTrigger>
            <TabsTrigger value="student">Student</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <TabsContent value="admin" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="email-admin">Email</Label>
                <Input
                  id="email-admin"
                  type="email"
                  placeholder="admin@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-admin">Password</Label>
                <Input
                  id="password-admin"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="size-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="size-4 mr-2" />
                    Sign In as Admin
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="professor" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="email-prof">Email</Label>
                <Input
                  id="email-prof"
                  type="email"
                  placeholder="professor@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-prof">Password</Label>
                <Input
                  id="password-prof"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="size-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="size-4 mr-2" />
                    Sign In as Professor
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="student" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="email-student">Email</Label>
                <Input
                  id="email-student"
                  type="email"
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-student">Password</Label>
                <Input
                  id="password-student"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="size-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="size-4 mr-2" />
                    Sign In as Student
                  </>
                )}
              </Button>
            </TabsContent>

            <p className="text-center text-sm text-muted-foreground pt-4">
              Don't have an account?{' '}
              <a href="/signup" className="text-primary hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  )
}
