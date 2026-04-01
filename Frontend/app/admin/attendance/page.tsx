'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { apiClient } from '@/lib/api'
import { CheckSquare2, RefreshCw, Search, Smile } from 'lucide-react'

interface AttendanceRecord {
  attendance_id: number
  student_id: number
  status: 'present' | 'absent'
  marked_at: string | null
  student: {
    id: number
    name: string
    roll_no?: string | null
    department?: string | null
    year_of_study?: string | null
  }
}

interface TodayAttendanceResponse {
  date: string
  present_count: number
  absent_count: number
  total_count: number
  records: AttendanceRecord[]
}

const statusVariants: Record<'present' | 'absent', 'default' | 'destructive'> = {
  present: 'default',
  absent: 'destructive',
}

export default function AttendancePage() {
  const router = useRouter()
  const [data, setData] = useState<TodayAttendanceResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent'>('all')

  const fetchAttendance = async () => {
    setIsLoading(true)
    setError(null)

    const response = await apiClient.get<TodayAttendanceResponse>('/attendance/today')

    if (response.success && response.data) {
      setData(response.data)
    } else {
      setError(response.error || 'Failed to load attendance data.')
      setData(null)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchAttendance()
  }, [])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'attendance:lastRecognition') {
        fetchAttendance()
      }
    }

    const handleFocus = () => {
      fetchAttendance()
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      fetchAttendance()
    }, 15000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const filteredRecords =
    data?.records.filter((record) => {
      if (statusFilter !== 'all' && record.status !== statusFilter) {
        return false
      }

      if (!searchQuery.trim()) {
        return true
      }

      const query = searchQuery.toLowerCase()
      return (
        record.student.name.toLowerCase().includes(query) ||
        (record.student.roll_no || '').toLowerCase().includes(query)
      )
    }) || []

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight">
            <CheckSquare2 className="size-8" />
            Attendance Management
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Track today&apos;s present and absent records from face recognition.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchAttendance} disabled={isLoading}>
            <RefreshCw className={`mr-2 size-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => router.push('/admin/students')}>
            <Smile className="mr-2 size-4" />
            Open Face Recognition
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Date</CardDescription>
            <CardTitle>{data?.date || '-'}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Present</CardDescription>
            <CardTitle className="text-green-600">{data?.present_count ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Absent</CardDescription>
            <CardTitle className="text-red-600">{data?.absent_count ?? 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name or roll number..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full md:w-56">
          <Select
            value={statusFilter}
            onValueChange={(value: 'all' | 'present' | 'absent') => setStatusFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="present">Present Only</SelectItem>
              <SelectItem value="absent">Absent Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Attendance</CardTitle>
          <CardDescription>
            {data
              ? `Showing ${filteredRecords.length} of ${data.total_count} attendance records for today.`
              : 'Attendance records will appear here.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="py-6 text-sm text-red-600">{error}</div>
          ) : isLoading ? (
            <div className="py-6 text-sm text-muted-foreground">Loading attendance...</div>
          ) : !data || filteredRecords.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No attendance records matched your current filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year of Study</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Marked At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.attendance_id}>
                    <TableCell className="font-medium">{record.student.name}</TableCell>
                    <TableCell>{record.student.roll_no || 'N/A'}</TableCell>
                    <TableCell>{record.student.department || 'N/A'}</TableCell>
                    <TableCell>{record.student.year_of_study || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[record.status]}>
                        {record.status === 'present' ? 'Present' : 'Absent'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.marked_at ? new Date(record.marked_at).toLocaleString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
