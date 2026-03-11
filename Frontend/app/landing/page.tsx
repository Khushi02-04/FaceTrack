'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Smile,
  Users,
  BarChart3,
  Clock,
  Shield,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: <Smile className="size-6" />,
    title: 'Face Recognition Attendance',
    description: 'Automated attendance tracking using advanced facial recognition technology',
  },
  {
    icon: <Users className="size-6" />,
    title: 'Student Management',
    description: 'Comprehensive student information system with enrollment tracking',
  },
  {
    icon: <BarChart3 className="size-6" />,
    title: 'Analytics & Reports',
    description: 'Detailed insights and reporting on academic and administrative metrics',
  },
  {
    icon: <Clock className="size-6" />,
    title: 'Timetable Management',
    description: 'Flexible scheduling and timetable creation for classes and resources',
  },
  {
    icon: <Shield className="size-6" />,
    title: 'Secure & Scalable',
    description: 'Enterprise-grade security with support for multiple institutions',
  },
  {
    icon: <Zap className="size-6" />,
    title: 'Real-time Updates',
    description: 'Live notifications and instant data synchronization across all devices',
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-primary-foreground">
              <span className="font-bold">CMS</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-lg font-bold">College ERP</h1>
              <p className="text-xs text-muted-foreground">Educational Resource Planning</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push('/login')}>
              Sign In
            </Button>
            <Button onClick={() => router.push('/signup')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-6">
          <div className="inline-block">
            <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium text-primary">
                New: Face Recognition Attendance System
              </p>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Modern ERP for Educational Institutions
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your college management with our comprehensive ERP system featuring advanced face recognition attendance, student management, and real-time analytics.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={() => router.push('/signup')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold tracking-tight">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your educational institution efficiently
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-4 text-primary">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="border-0 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="pt-12 space-y-8 text-center">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">Ready to transform your institution?</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join hundreds of educational institutions already using College ERP to streamline their operations.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" onClick={() => router.push('/signup')}>
                Get Started Now
              </Button>
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">API Reference</a></li>
                <li><a href="#" className="hover:text-foreground">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
                <li><a href="#" className="hover:text-foreground">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2026 College ERP. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ for educators
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
