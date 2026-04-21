'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { allStudents, departments, years } from '@/lib/admin-demo-data'
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts'

type YearFilter = 'All Years' | 'FE' | 'SE' | 'TE' | 'BE'
type DepartmentFilter = 'All Departments' | 'CM' | 'IT' | 'MECH' | 'CIVIL'

const chartConfig = {
  attendance: {
    label: 'Attendance',
    color: '#14746f',
  },
  CM: {
    label: 'CM',
    color: '#2f5ee5',
  },
  IT: {
    label: 'IT',
    color: '#127b72',
  },
  MECH: {
    label: 'MECH',
    color: '#f45d01',
  },
  CIVIL: {
    label: 'CIVIL',
    color: '#6f3fe8',
  },
}

export default function AnalyticsPage() {
  const [selectedYear, setSelectedYear] = useState<YearFilter>('All Years')
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentFilter>('All Departments')

  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      const matchesYear = selectedYear === 'All Years' || student.year === selectedYear
      const matchesDepartment = selectedDepartment === 'All Departments' || student.department === selectedDepartment
      return matchesYear && matchesDepartment
    })
  }, [selectedDepartment, selectedYear])

  const analyticsSummary = useMemo(() => {
    const totalStudents = filteredStudents.length
    const activeStudents = filteredStudents.filter((student) => student.status === 'Active').length
    const facePending = filteredStudents.filter((student) => student.faceData !== 'Uploaded').length
    const averageAttendance = totalStudents
      ? Math.round(filteredStudents.reduce((total, student) => total + student.attendance, 0) / totalStudents)
      : 0

    const uniqueTeachers = new Set(
      filteredStudents.map((student) => `${student.department}-${student.year}`)
    ).size

    return [
      {
        title: 'Average Attendance',
        value: `${averageAttendance}%`,
        description: `${totalStudents} students inside the current filter`,
        color: 'bg-emerald-50 border-emerald-100',
        accent: 'text-emerald-600',
      },
      {
        title: 'Student Health',
        value: `${totalStudents ? Math.round((activeStudents / totalStudents) * 100) : 0}%`,
        description: 'Active profile ratio in current roster',
        color: 'bg-sky-50 border-sky-100',
        accent: 'text-sky-600',
      },
      {
        title: 'Teaching Coverage',
        value: String(uniqueTeachers),
        description: 'Filtered class groups currently represented',
        color: 'bg-amber-50 border-amber-100',
        accent: 'text-amber-600',
      },
      {
        title: 'Face Upload Gap',
        value: String(facePending),
        description: 'Students still missing final face data',
        color: 'bg-violet-50 border-violet-100',
        accent: 'text-violet-600',
      },
    ]
  }, [filteredStudents])

  const analyticsBars = useMemo(() => {
    return years.map((year) => {
      const studentsForYear = filteredStudents.filter((student) => student.year === year)
      const averageAttendance = studentsForYear.length
        ? studentsForYear.reduce((total, student) => total + student.attendance, 0) / studentsForYear.length
        : 0

      return {
        year,
        attendance: Math.round(averageAttendance),
      }
    })
  }, [filteredStudents])

  const departmentMix = useMemo(() => {
    return departments.map((department, index) => ({
      department,
      students: filteredStudents.filter((student) => student.department === department).length,
      fill: ['#2f5ee5', '#127b72', '#f45d01', '#6f3fe8'][index],
    }))
  }, [filteredStudents])

  const scopeLabel = useMemo(() => {
    if (selectedYear === 'All Years' && selectedDepartment === 'All Departments') {
      return 'all students'
    }

    if (selectedYear !== 'All Years' && selectedDepartment !== 'All Departments') {
      return `${selectedDepartment} ${selectedYear}`
    }

    if (selectedYear !== 'All Years') {
      return `${selectedYear} students`
    }

    return `${selectedDepartment} department`
  }, [selectedDepartment, selectedYear])

  return (
    <div className="max-w-7xl space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 lg:flex-row">
            <Select value={selectedYear} onValueChange={(value: YearFilter) => setSelectedYear(value)}>
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue placeholder="Select year" />
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

            <Select value={selectedDepartment} onValueChange={(value: DepartmentFilter) => setSelectedDepartment(value)}>
              <SelectTrigger className="w-full lg:w-52">
                <SelectValue placeholder="Select department" />
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
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Analytics are currently showing data for {scopeLabel}.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        {analyticsSummary.map((card) => (
          <Card key={card.title} className={card.color}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <p className={`mt-2 text-4xl font-semibold ${card.accent}`}>{card.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold">Attendance Trend by Year</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Average attendance for {scopeLabel}.
            </p>

            <ChartContainer className="mt-6 h-[280px]" config={chartConfig}>
              <BarChart data={analyticsBars}>
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="attendance" fill="var(--color-attendance)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold">Student Mix by Department</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Distribution of students inside the current analytics filter.
            </p>

            <ChartContainer className="mt-6 h-[280px]" config={chartConfig}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="department" />} />
                <Pie
                  data={departmentMix}
                  dataKey="students"
                  nameKey="department"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {departmentMix.map((entry) => (
                    <Cell key={entry.department} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
                <ChartLegend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Operational Snapshot</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              High-signal indicators from the connected ERP modules.
            </p>
            <p className="mt-4 text-sm">Recognition flow is aligned with attendance summaries and roster health.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Attention Areas</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Students and operations that may need follow-up.
            </p>
            <p className="mt-4 text-sm">Pending face uploads and low-attendance students are surfaced first in the admin workflow.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Planning Notes</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Short insights generated from the current dataset.
            </p>
            <p className="mt-4 text-sm">Balanced distribution across CM, IT, MECH, and CIVIL keeps coverage stable for this snapshot.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
