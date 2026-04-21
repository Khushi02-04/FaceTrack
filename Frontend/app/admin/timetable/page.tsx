'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
  DepartmentCode,
  departments,
  getTeacherOptionsForSelection,
  getTimetableRows,
  subjectBuckets,
  YearCode,
  years,
} from '@/lib/admin-demo-data'
import { Calendar, GraduationCap, Users } from 'lucide-react'

export default function TimetablePage() {
  const [year, setYear] = useState<YearCode>('FE')
  const [department, setDepartment] = useState<DepartmentCode>('CM')
  const [teacher, setTeacher] = useState('All Teachers')

  const teacherOptions = useMemo(() => getTeacherOptionsForSelection(year, department), [year, department])
  const timetableRows = useMemo(() => getTimetableRows(year, department, teacher), [year, department, teacher])
  const subjectList = subjectBuckets[`${year}-${department}`]

  useEffect(() => {
    if (!teacherOptions.includes(teacher)) {
      setTeacher('All Teachers')
    }
  }, [teacher, teacherOptions])

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight">
          <Calendar className="size-8" />
          Timetable Management
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Subjects come from the teacher-linked academic mapping, so timetable planning stays consistent with faculty assignment.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold">Filters</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            View timetable by academic year, department, or teacher schedule.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <Select value={year} onValueChange={(value) => setYear(value as YearCode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((yearOption) => (
                  <SelectItem key={yearOption} value={yearOption}>
                    {yearOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={department} onValueChange={(value) => setDepartment(value as DepartmentCode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((departmentOption) => (
                  <SelectItem key={departmentOption} value={departmentOption}>
                    {departmentOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={teacher} onValueChange={setTeacher}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {teacherOptions.map((teacherOption) => (
                  <SelectItem key={teacherOption} value={teacherOption}>
                    {teacherOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center rounded-md border border-dashed px-4 text-sm text-muted-foreground">
              {subjectList.length} subjects mapped for {department} {year}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/teachers">
                <Users className="mr-2 size-4" />
                Open Teachers
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/academics">
                <GraduationCap className="mr-2 size-4" />
                Open Academics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">{year} - {department} Timetable</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Days are shown as rows and periods as columns for quick class planning.
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Period 1</TableHead>
                <TableHead>Period 2</TableHead>
                <TableHead>Period 3</TableHead>
                <TableHead>Period 4</TableHead>
                <TableHead>Period 5</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timetableRows.map((row) => (
                <TableRow key={row.day}>
                  <TableCell className="align-top font-semibold">{row.day}</TableCell>
                  {row.periods.map((period, index) => (
                    <TableCell key={`${row.day}-${index}`} className="align-top">
                      <div className="rounded-xl bg-sky-50 p-4">
                        <p className="font-semibold text-slate-800">{period.subject}</p>
                        <p className="mt-2 text-xs text-muted-foreground">{period.time}</p>
                        <p className="mt-2 text-xs text-muted-foreground">Teacher: {period.teacher}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Room: {period.room}</p>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
