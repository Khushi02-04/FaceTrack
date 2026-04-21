'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Download, Eye, FileText, RefreshCw } from 'lucide-react'

type AttendanceStatus = 'present' | 'absent'
type StatusFilter = 'all' | AttendanceStatus

interface AttendanceApiRecord {
  attendance_id: number
  student_id: number
  status: AttendanceStatus
  marked_at: string | null
  student: {
    id: number
    name: string | null
    roll_no: string | null
    department: string | null
    year_of_study: string | null
  }
}

interface AttendanceApiResponse {
  date: string
  present_count: number
  absent_count: number
  total_count: number
  records: AttendanceApiRecord[]
}

interface AttendanceReportRow {
  attendanceId: number
  studentId: number
  name: string
  rollNumber: string
  department: string
  year: string
  status: AttendanceStatus
  markedAt: string
}

interface AttendancePreview {
  previewUrl: string
  fileName: string
}

const today = new Date().toISOString().slice(0, 10)

const escapePdfText = (value: string) => value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

const formatDateTime = (value: string | null) => {
  if (!value) return 'Not marked'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString()
}

const formatStatus = (status: AttendanceStatus) => status.charAt(0).toUpperCase() + status.slice(1)

const buildPdfBlob = (rows: AttendanceReportRow[], selectedDate: string, generatedAt: string) => {
  const summary = {
    total: rows.length,
    present: rows.filter((row) => row.status === 'present').length,
    absent: rows.filter((row) => row.status === 'absent').length,
  }

  const baseLines = [
    'Attendance Report',
    '',
    `Report Date: ${selectedDate}`,
    `Generated At: ${generatedAt}`,
    `Present: ${summary.present}`,
    `Absent: ${summary.absent}`,
    `Total Records: ${summary.total}`,
    '',
    'Student Records',
    ...rows.slice(0, 24).map(
      (row, index) =>
        `${index + 1}. ${row.name} | ${row.rollNumber} | ${row.department} ${row.year} | ${formatStatus(row.status)} | ${row.markedAt}`
    ),
  ]

  let y = 770
  const textCommands = baseLines
    .map((line) => {
      const command = `BT /F1 10 Tf 40 ${y} Td (${escapePdfText(line)}) Tj ET`
      y -= line === '' ? 12 : 18
      return command
    })
    .join('\n')

  const stream = `${textCommands}\n`
  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
    '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
    `5 0 obj << /Length ${stream.length} >> stream\n${stream}endstream endobj`,
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = [0]

  for (const object of objects) {
    offsets.push(pdf.length)
    pdf += `${object}\n`
  }

  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`
  }

  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`

  return new Blob([pdf], { type: 'application/pdf' })
}

export default function AttendanceReportsPage() {
  const [selectedDate, setSelectedDate] = useState(today)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [records, setRecords] = useState<AttendanceReportRow[]>([])
  const [summary, setSummary] = useState({ present: 0, absent: 0, total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [preview, setPreview] = useState<AttendancePreview | null>(null)
  const [refreshNonce, setRefreshNonce] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadAttendanceReport = async () => {
      if (isMounted) {
        setIsLoading(true)
        setError(null)
      }

      const response = await apiClient.get<AttendanceApiResponse>(`/attendance/today?date=${selectedDate}`)

      if (!isMounted) return

      if (!response.success || !response.data) {
        setRecords([])
        setSummary({ present: 0, absent: 0, total: 0 })
        setError(response.error || 'Unable to load the attendance report.')
        setIsLoading(false)
        return
      }

      const normalizedRows = response.data.records.map((record) => ({
        attendanceId: record.attendance_id,
        studentId: record.student_id,
        name: record.student.name || 'Unknown Student',
        rollNumber: record.student.roll_no || 'N/A',
        department: record.student.department || 'N/A',
        year: record.student.year_of_study || 'N/A',
        status: record.status,
        markedAt: formatDateTime(record.marked_at),
      }))

      setRecords(normalizedRows)
      setSummary({
        present: response.data.present_count,
        absent: response.data.absent_count,
        total: response.data.total_count,
      })
      setLastUpdated(new Date().toLocaleTimeString())
      setIsLoading(false)
    }

    loadAttendanceReport()
    const intervalId = window.setInterval(loadAttendanceReport, 30000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [refreshNonce, selectedDate])

  useEffect(() => {
    return () => {
      if (preview?.previewUrl) {
        URL.revokeObjectURL(preview.previewUrl)
      }
    }
  }, [preview])

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return records.filter((record) => {
      const matchesQuery =
        !query ||
        [record.name, record.rollNumber, record.department, record.year]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesStatus = statusFilter === 'all' || record.status === statusFilter

      return matchesQuery && matchesStatus
    })
  }, [records, searchQuery, statusFilter])

  const filteredSummary = useMemo(() => {
    const present = filteredRecords.filter((record) => record.status === 'present').length
    const absent = filteredRecords.filter((record) => record.status === 'absent').length

    return {
      present,
      absent,
      total: filteredRecords.length,
    }
  }, [filteredRecords])

  const openPreview = () => {
    if (preview?.previewUrl) {
      URL.revokeObjectURL(preview.previewUrl)
    }

    const generatedAt = new Date().toLocaleString()
    const fileName = `attendance-report-${selectedDate}.pdf`
    const previewUrl = URL.createObjectURL(buildPdfBlob(filteredRecords, selectedDate, generatedAt))
    setPreview({ previewUrl, fileName })
  }

  const closePreview = (open: boolean) => {
    if (!open && preview?.previewUrl) {
      URL.revokeObjectURL(preview.previewUrl)
      setPreview(null)
    }
  }

  const downloadReport = () => {
    const fileName = `attendance-report-${selectedDate}.pdf`
    const href = preview?.previewUrl || URL.createObjectURL(buildPdfBlob(filteredRecords, selectedDate, new Date().toLocaleString()))
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = preview?.fileName || fileName
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()

    if (!preview?.previewUrl) {
      URL.revokeObjectURL(href)
    }
  }

  const statCards = [
    { label: 'Present', value: filteredSummary.present, tone: 'text-emerald-600' },
    { label: 'Absent', value: filteredSummary.absent, tone: 'text-red-500' },
    { label: 'Visible Records', value: filteredSummary.total, tone: '' },
    { label: 'Live Total', value: summary.total, tone: '' },
  ]

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight">
            <FileText className="size-8" />
            Attendance Reports
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Real-time attendance reports generated from the backend and refreshed automatically every 30 seconds.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/attendance">Open Attendance</Link>
          </Button>
          <Button variant="outline" onClick={() => setRefreshNonce((value) => value + 1)}>
            <RefreshCw className="mr-2 size-4" />
            Refresh Now
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className={`mt-2 text-4xl font-semibold ${card.tone}`}>{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 lg:flex-row">
            <Input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="w-full lg:w-52"
            />
            <div className="relative flex-1">
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by student, roll number, department, or year..."
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={openPreview} disabled={filteredRecords.length === 0}>
              <Eye className="mr-2 size-4" />
              Preview PDF
            </Button>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800" onClick={downloadReport} disabled={filteredRecords.length === 0}>
              <Download className="mr-2 size-4" />
              Download
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Report date: {selectedDate}</span>
            <span>Auto refresh: 30s</span>
            {lastUpdated && <span>Last updated: {lastUpdated}</span>}
            {isLoading && <span>Refreshing live data...</span>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Live Attendance Records</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Showing {filteredRecords.length} of {summary.total} records from the live attendance feed.
              </p>
            </div>
            <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">Realtime</Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Marked At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.attendanceId}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/students/${record.studentId}`} className="hover:underline">
                      {record.name}
                    </Link>
                  </TableCell>
                  <TableCell>{record.rollNumber}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{record.year}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        record.status === 'present'
                          ? 'bg-emerald-600 text-white hover:bg-emerald-600'
                          : 'bg-red-500 text-white hover:bg-red-500'
                      }
                    >
                      {formatStatus(record.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.markedAt}</TableCell>
                </TableRow>
              ))}
              {!isLoading && filteredRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No attendance records are available for the selected date and filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={Boolean(preview)} onOpenChange={closePreview}>
        <DialogContent className="max-w-5xl p-0 sm:max-w-5xl">
          {preview && (
            <>
              <DialogHeader className="border-b px-6 pt-6">
                <DialogTitle>Attendance Report Preview</DialogTitle>
                <DialogDescription>
                  The preview is generated from the current live attendance dataset and respects the active filters.
                </DialogDescription>
              </DialogHeader>

              <div className="px-6 py-4">
                <div className="mb-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span>Date: {selectedDate}</span>
                  <span>Visible records: {filteredSummary.total}</span>
                  <span>Present: {filteredSummary.present}</span>
                  <span>Absent: {filteredSummary.absent}</span>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-muted/20">
                  <iframe
                    title="Attendance report preview"
                    src={preview.previewUrl}
                    className="h-[65vh] w-full"
                  />
                </div>
              </div>

              <DialogFooter className="border-t px-6 py-4">
                <Button variant="outline" onClick={() => closePreview(false)}>
                  Close
                </Button>
                <Button className="bg-zinc-900 text-white hover:bg-zinc-800" onClick={downloadReport}>
                  <Download className="mr-2 size-4" />
                  Download PDF
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
