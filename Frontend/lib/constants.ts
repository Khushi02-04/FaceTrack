import { MenuItem } from '@/types/common'

export const APP_NAME = 'College ERP'
export const APP_DESCRIPTION = 'Comprehensive Educational Resource Planning System with Face Recognition Attendance'
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export const DASHBOARD_MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/admin',
  },
  {
    id: 'students',
    label: 'Students',
    icon: 'Users',
    path: '/admin/students',
    badge: 0,
  },
  {
    id: 'teachers',
    label: 'Teachers',
    icon: 'BookOpen',
    path: '/admin/teachers',
  },
  {
    id: 'subjects',
    label: 'Subjects',
    icon: 'BookMarked',
    path: '/admin/subjects',
  },
  {
    id: 'timetable',
    label: 'Timetable',
    icon: 'Calendar',
    path: '/admin/timetable',
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: 'CheckSquare2',
    path: '/admin/attendance',
    badge: 5,
    children: [
      {
        id: 'face-recognition',
        label: 'Face Recognition',
        icon: 'Smile',
        path: '/admin/attendance/face-recognition',
      },
      {
        id: 'attendance-reports',
        label: 'Attendance Reports',
        icon: 'BarChart3',
        path: '/admin/attendance/reports',
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'TrendingUp',
    path: '/admin/analytics',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/admin/settings',
    children: [
      {
        id: 'profile',
        label: 'Profile',
        icon: 'User',
        path: '/admin/settings/profile',
      },
      {
        id: 'college',
        label: 'College Settings',
        icon: 'Building2',
        path: '/admin/settings/college',
      },
      {
        id: 'integrations',
        label: 'Integrations',
        icon: 'Plug',
        path: '/admin/settings/integrations',
      },
      {
        id: 'security',
        label: 'Security',
        icon: 'Lock',
        path: '/admin/settings/security',
      },
    ],
  },
]

export const MOCK_COLLEGE = {
  id: 'college-001',
  name: 'Premier Institute of Technology',
  logo: '/logo.png',
  email: 'admin@college.edu',
  phone: '+1 (555) 123-4567',
  address: '123 Education Lane',
  city: 'Academic City',
  state: 'ST',
  country: 'Country',
  postalCode: '12345',
}

export const TOAST_DURATION = 3000

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  STUDENTS: '/dashboard/students',
  TEACHERS: '/dashboard/teachers',
  ATTENDANCE: '/dashboard/attendance',
  SETTINGS: '/dashboard/settings',
} as const
