'use client';

import { useAuth } from '@/contexts/auth-context';
import { useTenant } from '@/contexts/tenant-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  BookOpen,
  CheckSquare2,
  TrendingUp,
  GraduationCap,
  Calendar,
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
}

const stats: StatCard[] = [
  {
    title: 'Total Students',
    value: '2,845',
    description: 'Active students enrolled',
    icon: <GraduationCap className="size-6" />,
    trend: '+12% from last month',
  },
  {
    title: 'Teachers',
    value: '156',
    description: 'Faculty members',
    icon: <BookOpen className="size-6" />,
    trend: '+2% from last month',
  },
  {
    title: 'Attendance Today',
    value: '92%',
    description: 'Student attendance rate',
    icon: <CheckSquare2 className="size-6" />,
    trend: '+5% from yesterday',
  },
  {
    title: 'Classes',
    value: '48',
    description: 'Active classes',
    icon: <Users className="size-6" />,
    trend: 'No change',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back, {user?.name.split(' ')[0]}!
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Here's what's happening at {tenant.name} today.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="text-muted-foreground">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              {stat.trend && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  {stat.trend}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your institution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                'New attendance records updated',
                'Student 2845 submitted assignment',
                'Class schedule modified for Class 10-A',
                'New notice posted for all faculty',
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:pb-0 last:border-0">
                  <div className="size-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.floor(Math.random() * 24)} hours ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <CheckSquare2 className="size-4 mr-2" />
              Mark Attendance
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="size-4 mr-2" />
              Manage Classes
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="size-4 mr-2" />
              View Timetable
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="size-4 mr-2" />
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: 'Today', event: 'Annual Sports Day Begins' },
              { date: 'Tomorrow', event: 'Faculty Meeting - 2:00 PM' },
              { date: 'Feb 21', event: 'Parent-Teacher Conference' },
              { date: 'Feb 22', event: 'Final Exams - Batch A' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{item.event}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <div className="size-2 rounded-full bg-primary" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
