'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
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
import { DepartmentCode, departments, subjectBuckets, YearCode, years } from '@/lib/admin-demo-data'
import { BookMarked, Plus } from 'lucide-react'

export default function SubjectsPage() {
  const [year, setYear] = useState<YearCode>('FE')
  const [department, setDepartment] = useState<DepartmentCode>('CM')
  const [newSubject, setNewSubject] = useState('')
  const [addedSubjects, setAddedSubjects] = useState<Record<string, string[]>>({})

  const key = `${year}-${department}` as const
  const subjects = useMemo(() => {
    const baseSubjects = subjectBuckets[key] || []
    const manualSubjects = addedSubjects[key] || []
    return [...baseSubjects, ...manualSubjects]
  }, [addedSubjects, key])

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight">
          <BookMarked className="size-8" />
          Subjects
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage subjects batch-wise and keep them aligned with academics and timetable planning.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold">Subject Controls</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use the dropdowns below to manage subjects for the selected class and department.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-[120px_120px_1fr_140px]">
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
            <Input
              value={newSubject}
              onChange={(event) => setNewSubject(event.target.value)}
              placeholder="Add a new subject for the selected class"
            />
            <Button
              variant="outline"
              onClick={() => {
                const trimmed = newSubject.trim()
                if (!trimmed) return
                setAddedSubjects((current) => ({
                  ...current,
                  [key]: [...(current[key] || []), trimmed],
                }))
                setNewSubject('')
              }}
            >
              <Plus className="mr-2 size-4" />
              Add Subject
            </Button>
          </div>

          <div className="mt-4">
            <Button asChild className="bg-zinc-900 text-white hover:bg-zinc-800">
              <Link href="/admin/academics">Show in Academics</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold">{department} {year} Subject List</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            These subjects are shared with the timetable and teacher assignment modules.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {subjects.map((subject) => (
              <span key={subject} className="rounded-full border bg-slate-50 px-4 py-2 text-sm">
                {subject}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
