'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getAllStudents, getStudentStats, subscribeToStudentChanges, type DemoStudent } from '@/lib/admin-demo-data'
import { Camera, Eye, Filter, MoreHorizontal, Pencil, Plus, Search, SquareChartGantt, Trash2, Users } from 'lucide-react'

const statusClasses: Record<string, string> = {
  Active: 'bg-zinc-900 text-white hover:bg-zinc-900',
  Inactive: 'bg-amber-50 text-amber-700 hover:bg-amber-50',
  Suspended: 'bg-red-500 text-white hover:bg-red-500',
}

const faceClasses: Record<string, string> = {
  Uploaded: 'bg-emerald-600 text-white hover:bg-emerald-600',
  Pending: 'bg-amber-50 text-amber-700 hover:bg-amber-50',
  'Not Uploaded': 'bg-slate-100 text-slate-700 hover:bg-slate-100',
}

export default function StudentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [students, setStudents] = useState<DemoStudent[]>([])

  useEffect(() => {
    const syncStudents = () => setStudents(getAllStudents())
    syncStudents()
    return subscribeToStudentChanges(syncStudents)
  }, [])

  const studentStats = useMemo(() => getStudentStats(students), [students])

  const filteredStudents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return students

    return students.filter((student) =>
      [student.rollNumber, student.name, student.className, student.contact, student.email]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [searchQuery, students])

  const statCards = [
    { label: 'Total Students', value: studentStats.total, valueClass: '' },
    { label: 'Face Uploaded', value: studentStats.faceUploaded, valueClass: 'text-emerald-600' },
    { label: 'Face Pending', value: studentStats.facePending, valueClass: 'text-amber-500' },
    { label: 'Suspended', value: studentStats.suspended, valueClass: 'text-red-500' },
  ]

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight">
          <Users className="size-8" />
          Students Management
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage student records, face data status, and attendance-linked actions from one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className={`mt-2 text-4xl font-semibold ${card.valueClass}`}>{card.value}</p>
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
            placeholder="Search by name, roll number, class, phone, or email..."
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setSearchQuery('')}>
          <Filter className="mr-2 size-4" />
          Clear
        </Button>
        <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => router.push('/admin/attendance/face-recognition')}>
          <Camera className="mr-2 size-4" />
          Recognize Student
        </Button>
        <Button className="bg-zinc-900 text-white hover:bg-zinc-800" onClick={() => router.push('/admin/students/new')}>
          <Plus className="mr-2 size-4" />
          Add Student
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Students List</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Showing {filteredStudents.length} of {studentStats.total} students
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/attendance">
                <SquareChartGantt className="mr-2 size-4" />
                Open Attendance Module
              </Link>
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Face Data Uploaded</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.rollNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{student.className}</TableCell>
                  <TableCell>{student.contact}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={faceClasses[student.faceData]}>{student.faceData}</Badge>
                      {student.faceData !== 'Uploaded' && (
                        <Button asChild variant="outline" size="sm" className="h-7 px-3 text-xs">
                          <Link href={`/admin/students/${student.id}`}>
                            Add Face
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="link" className="h-auto p-0 font-medium">
                      <Link href={`/admin/attendance?student=${student.rollNumber}`}>
                        {student.attendance}%
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusClasses[student.status]}>{student.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="ml-auto">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/students/${student.id}`}>
                            <Eye className="size-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/students/${student.id}/edit`}>
                            <Pencil className="size-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild variant="destructive">
                          <Link href={`/admin/students/${student.id}/delete`}>
                            <Trash2 className="size-4" />
                            Delete
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
