'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useTenant } from '@/contexts/tenant-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  attendanceDates,
  dashboardActivities,
  getAllStudents,
  getAttendanceStatsByDate,
  getStudentStats,
  getStudentsMissingFace,
  subscribeToStudentChanges,
  teacherStats,
  type DemoStudent,
} from '@/lib/admin-demo-data'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Camera,
  CheckSquare2,
  GraduationCap,
  TrendingUp,
  UserRoundCheck,
} from 'lucide-react'

const statCardStyles = [
  {
    shell: 'border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50',
    iconWrap: 'bg-sky-600 text-white',
    trend: 'text-sky-700',
  },
  {
    shell: 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50',
    iconWrap: 'bg-emerald-600 text-white',
    trend: 'text-emerald-700',
  },
  {
    shell: 'border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50',
    iconWrap: 'bg-amber-500 text-white',
    trend: 'text-amber-700',
  },
]

export default function DashboardPage() {
  const { tenant } = useTenant()
  const [students, setStudents] = useState<DemoStudent[]>([])

  useEffect(() => {
    const syncStudents = () => setStudents(getAllStudents())
    syncStudents()
    return subscribeToStudentChanges(syncStudents)
  }, [])

  const studentStats = useMemo(() => getStudentStats(students), [students])
  const studentsMissingFace = useMemo(() => getStudentsMissingFace(students), [students])
  const attendanceStats = useMemo(() => getAttendanceStatsByDate(attendanceDates[0], students), [students])

  const stats = [
    {
      title: 'Total Students',
      value: String(studentStats.total),
      description: `${studentStats.faceUploaded} face profiles uploaded`,
      icon: <GraduationCap className="size-5" />,
      trend: `${studentStats.facePending} pending face uploads`,
    },
    {
      title: 'Teachers',
      value: String(teacherStats.total),
      description: `${teacherStats.subjectsCovered} subjects assigned`,
      icon: <BookOpen className="size-5" />,
      trend: `${teacherStats.classesAssigned} classes covered`,
    },
    {
      title: 'Attendance Today',
      value: `${Math.round((attendanceStats.present / attendanceStats.total) * 100)}%`,
      description: `${attendanceStats.present} students present`,
      icon: <CheckSquare2 className="size-5" />,
      trend: `${attendanceStats.absent} students absent`,
    },
  ]

  return (
    <div className="max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_28%),linear-gradient(135deg,_#ffffff_0%,_#f8fbff_44%,_#f5f7fb_100%)] px-6 py-8 shadow-sm md:px-8 md:py-10">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-sky-100/60 blur-3xl" />
        <div className="absolute bottom-0 left-24 h-32 w-32 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-700">Dashboard</p>
              <h1 className="text-5xl font-bold tracking-tight text-slate-950 md:text-6xl">Welcome</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                A clean view of attendance, teacher coverage, and face-recognition readiness for {tenant.name}.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800">
                <Link href="/admin/attendance/face-recognition">
                  <Camera className="mr-2 size-4" />
                  Open Face Recognition
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-slate-300 bg-white/80 px-5">
                <Link href="/admin/attendance/reports">
                  <UserRoundCheck className="mr-2 size-4" />
                  View Attendance Reports
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[1.5rem] border border-sky-200 bg-white/80 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Face Upload Status</p>
                  <p className="mt-1 text-3xl font-bold text-slate-950">{studentStats.faceUploaded}</p>
                </div>
                <div className="rounded-2xl bg-sky-600 p-3 text-white">
                  <Camera className="size-5" />
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                {studentsMissingFace.length} students still need face data before full recognition coverage.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-emerald-200 bg-white/80 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Present Today</p>
                  <p className="mt-1 text-3xl font-bold text-slate-950">{attendanceStats.present}</p>
                </div>
                <div className="rounded-2xl bg-emerald-600 p-3 text-white">
                  <CheckSquare2 className="size-5" />
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                {attendanceStats.absent} absent students currently reflected in the attendance report.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => {
          const palette = statCardStyles[index]

          return (
            <Card key={stat.title} className={`overflow-hidden rounded-[1.6rem] border shadow-sm transition-transform hover:-translate-y-1 ${palette.shell}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <p className="mt-3 text-4xl font-bold tracking-tight text-slate-950">{stat.value}</p>
                  </div>
                  <div className={`rounded-2xl p-3 shadow-sm ${palette.iconWrap}`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600">{stat.description}</p>
                <p className={`mt-3 text-sm font-medium ${palette.trend}`}>{stat.trend}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[1.8rem] border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Module Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Link
              href="/admin/students"
              className="group rounded-[1.4rem] border border-slate-200 bg-gradient-to-br from-white to-sky-50 p-5 transition hover:border-sky-300 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-900">Students</p>
                <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-sky-600" />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-950">{studentStats.total}</p>
              <p className="mt-2 text-sm text-slate-600">
                {studentStats.faceUploaded} uploaded faces and {studentStats.facePending} pending records.
              </p>
            </Link>

            <Link
              href="/admin/teachers"
              className="group rounded-[1.4rem] border border-slate-200 bg-gradient-to-br from-white to-emerald-50 p-5 transition hover:border-emerald-300 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-900">Teachers</p>
                <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-950">{teacherStats.total}</p>
              <p className="mt-2 text-sm text-slate-600">
                {teacherStats.subjectsCovered} subjects and {teacherStats.classesAssigned} active class mappings.
              </p>
            </Link>

            <Link
              href="/admin/attendance"
              className="group rounded-[1.4rem] border border-slate-200 bg-gradient-to-br from-white to-amber-50 p-5 transition hover:border-amber-300 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-900">Attendance</p>
                <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-amber-600" />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-950">{attendanceStats.present}</p>
              <p className="mt-2 text-sm text-slate-600">
                Present today out of {attendanceStats.total} tracked students.
              </p>
            </Link>

            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-950 p-5 text-white">
              <p className="text-lg font-semibold">Quick Launch</p>
              <p className="mt-2 text-sm text-slate-300">
                Jump into the most-used modules without searching through the sidebar.
              </p>
              <div className="mt-5 grid gap-3">
                <Button asChild variant="secondary" className="justify-start rounded-xl bg-white text-slate-950 hover:bg-slate-100">
                  <Link href="/admin/attendance/face-recognition">
                    <Camera className="mr-2 size-4" />
                    Face Recognition
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="justify-start rounded-xl bg-white/10 text-white hover:bg-white/15">
                  <Link href="/admin/timetable">
                    <Calendar className="mr-2 size-4" />
                    Timetable
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="justify-start rounded-xl bg-white/10 text-white hover:bg-white/15">
                  <Link href="/admin/analytics">
                    <TrendingUp className="mr-2 size-4" />
                    Analytics
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.8rem] border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardActivities.map((activity, index) => (
              <Link
                key={activity.title}
                href={activity.href}
                className="group flex items-start gap-4 rounded-[1.2rem] border border-slate-200 bg-white p-4 transition hover:border-sky-200 hover:bg-sky-50/50"
              >
                <div className={`mt-1 size-3 rounded-full ${index % 3 === 0 ? 'bg-sky-500' : index % 3 === 1 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-sky-700">{activity.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{activity.description}</p>
                </div>
                <ArrowRight className="mt-0.5 size-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-600" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
