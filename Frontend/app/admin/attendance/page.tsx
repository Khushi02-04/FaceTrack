'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  attendanceDates,
  departments,
  getAllStudents,
  getAttendanceRecordsByDate,
  subscribeToStudentChanges,
  type DemoStudent,
  years,
} from '@/lib/admin-demo-data'
import { CheckSquare2, RefreshCw, Search, UserSquare2 } from 'lucide-react'

export default function AttendancePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedStudent = searchParams.get('student') ?? ''
  const [searchQuery, setSearchQuery] = useState(preselectedStudent)
  const [statusFilter, setStatusFilter] = useState<'All Statuses' | 'Present' | 'Absent'>('All Statuses')
  const [yearFilter, setYearFilter] = useState<'All Years' | 'FE' | 'SE' | 'TE' | 'BE'>('All Years')
  const [departmentFilter, setDepartmentFilter] = useState<'All Departments' | 'CM' | 'IT' | 'MECH' | 'CIVIL'>('All Departments')
  const [selectedDate, setSelectedDate] = useState(attendanceDates[0])
  const [students, setStudents] = useState<DemoStudent[]>([])

  useEffect(() => {
    const syncStudents = () => setStudents(getAllStudents())
    syncStudents()
    return subscribeToStudentChanges(syncStudents)
  }, [])

  const attendanceRecords = useMemo(() => getAttendanceRecordsByDate(selectedDate, students), [selectedDate, students])

  const batchAttendance = useMemo(() => {
    return attendanceRecords.filter((record) => {
      const [department, year] = record.className.split(' ')
      const matchesYear = yearFilter === 'All Years' || year === yearFilter
      const matchesDepartment = departmentFilter === 'All Departments' || department === departmentFilter

      return matchesYear && matchesDepartment
    })
  }, [attendanceRecords, departmentFilter, yearFilter])

  const filteredAttendance = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return batchAttendance.filter((record) => {
      const matchesQuery =
        !query ||
        [record.name, record.rollNumber, record.className]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesStatus = statusFilter === 'All Statuses' || record.status === statusFilter

      return matchesQuery && matchesStatus
    })
  }, [batchAttendance, searchQuery, statusFilter])

  const attendanceStats = useMemo(() => {
    const present = batchAttendance.filter((record) => record.status === 'Present').length
    const absent = batchAttendance.length - present

    return {
      date: selectedDate,
      present,
      absent,
      total: batchAttendance.length,
    }
  }, [batchAttendance, selectedDate])

  const attendanceScopeLabel = useMemo(() => {
    if (departmentFilter === 'All Departments' && yearFilter === 'All Years') {
      return 'all students'
    }

    if (departmentFilter !== 'All Departments' && yearFilter !== 'All Years') {
      return `${departmentFilter} ${yearFilter}`
    }

    if (departmentFilter !== 'All Departments') {
      return `${departmentFilter} department`
    }

    return `${yearFilter} year`
  }, [departmentFilter, yearFilter])

  const summaryCards = [
    { label: 'Date', value: attendanceStats.date, valueClass: '' },
    { label: 'Present', value: attendanceStats.present, valueClass: 'text-emerald-600' },
    { label: 'Absent', value: attendanceStats.absent, valueClass: 'text-red-500' },
    { label: 'Total Students', value: attendanceStats.total, valueClass: '' },
  ]

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight">
            <CheckSquare2 className="size-8" />
            Attendance Management
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Daily attendance aligned with the student roster and face-upload status.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setSearchQuery(preselectedStudent)}>
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/attendance/reports')}>
            View Reports
          </Button>
          <Button className="bg-zinc-900 text-white hover:bg-zinc-800" onClick={() => router.push('/admin/students')}>
            <UserSquare2 className="mr-2 size-4" />
            Open Students
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className={`mt-2 text-3xl font-semibold ${card.valueClass}`}>{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1 lg:max-w-[46rem]">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by student name or roll number..."
            className="pl-10"
          />
        </div>
        <Select value={departmentFilter} onValueChange={(value: 'All Departments' | 'CM' | 'IT' | 'MECH' | 'CIVIL') => setDepartmentFilter(value)}>
          <SelectTrigger className="w-full lg:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Departments">All Departments</SelectItem>
            {departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={yearFilter} onValueChange={(value: 'All Years' | 'FE' | 'SE' | 'TE' | 'BE') => setYearFilter(value)}>
          <SelectTrigger className="w-full lg:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Years">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value: 'All Statuses' | 'Present' | 'Absent') => setStatusFilter(value)}>
          <SelectTrigger className="w-full lg:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Statuses">All Statuses</SelectItem>
            <SelectItem value="Present">Present</SelectItem>
            <SelectItem value="Absent">Absent</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-full lg:ml-auto lg:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {attendanceDates.map((date) => (
              <SelectItem key={date} value={date}>
                {date}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              {selectedDate === attendanceDates[0] ? "Today's Attendance" : `Attendance Report - ${selectedDate}`}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {filteredAttendance.length} of {attendanceStats.total} attendance records for {attendanceScopeLabel}.
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Face Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attendance %</TableHead>
                <TableHead>Marked At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((record) => (
                <TableRow key={`${record.rollNumber}-${record.markedAt}`}>
                  <TableCell className="font-medium">
                    <Button asChild variant="link" className="h-auto p-0 font-medium">
                      <Link href={`/admin/students/${record.studentId}`}>{record.name}</Link>
                    </Button>
                  </TableCell>
                  <TableCell>{record.rollNumber}</TableCell>
                  <TableCell>{record.className}</TableCell>
                  <TableCell>{record.faceData}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        record.status === 'Present'
                          ? 'bg-zinc-900 text-white hover:bg-zinc-900'
                          : 'bg-red-500 text-white hover:bg-red-500'
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.attendance}%</TableCell>
                  <TableCell>{record.markedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
