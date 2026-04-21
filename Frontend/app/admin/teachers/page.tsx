'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { demoTeachers, teacherStats } from '@/lib/admin-demo-data'
import { BookOpen, Calendar, Plus, Search } from 'lucide-react'

export default function TeachersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTeachers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return demoTeachers

    return demoTeachers.filter((teacher) =>
      [
        teacher.name,
        teacher.email,
        teacher.phone,
        teacher.departments,
        teacher.subjects,
        teacher.classes,
        teacher.room,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [searchQuery])

  const statCards = [
    { label: 'Total Teachers', value: teacherStats.total, classes: 'bg-emerald-50 border-emerald-100' },
    { label: 'Subjects Covered', value: teacherStats.subjectsCovered, classes: 'bg-sky-50 border-sky-100' },
    { label: 'Classes Assigned', value: teacherStats.classesAssigned, classes: 'bg-amber-50 border-amber-100' },
  ]

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight">
          <BookOpen className="size-8" />
          Teachers Management
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Teacher records, subject ownership, and classes are synced with the timetable and academic subject mapping.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.label} className={card.classes}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-2 text-4xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search teachers by name, email, subject, department, class, or room..."
            className="pl-10"
          />
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/timetable">
            <Calendar className="mr-2 size-4" />
            Open Timetable
          </Link>
        </Button>
        <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => router.push('/admin/teachers/new')}>
          <Plus className="mr-2 size-4" />
          Add Teacher
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">Teachers List</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {filteredTeachers.length} of {teacherStats.total} teachers
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[220px]">Teacher</TableHead>
                  <TableHead className="min-w-[140px]">Departments</TableHead>
                  <TableHead className="min-w-[320px]">Subjects</TableHead>
                  <TableHead className="min-w-[320px]">Classes</TableHead>
                  <TableHead className="min-w-[110px]">Workload</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="align-top font-medium">
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground break-all">{teacher.email}</p>
                        <p className="text-xs text-muted-foreground">{teacher.phone} • Room {teacher.room}</p>
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-wrap gap-2">
                        {teacher.departmentList.map((department, index) => (
                          <span key={`${teacher.id}-department-${index}-${department}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                            {department}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-wrap gap-2">
                        {teacher.subjectList.map((subject, index) => (
                          <span key={`${teacher.id}-subject-${index}-${subject}`} className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-700">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-wrap gap-2">
                        {teacher.classList.map((className, index) => (
                          <span key={`${teacher.id}-class-${index}-${className}`} className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
                            {className}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <Button asChild variant="link" className="h-auto p-0">
                        <Link href="/admin/timetable">{teacher.workload}</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
