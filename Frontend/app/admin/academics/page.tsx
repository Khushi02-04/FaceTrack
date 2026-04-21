import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { subjectClassMap } from '@/lib/admin-demo-data'
import { GraduationCap, LayoutList } from 'lucide-react'

export default function AcademicsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <GraduationCap className="size-8" />
          Academics
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Subject list by class, kept in sync with the teacher and timetable modules.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Subjects by Class</CardTitle>
            <CardDescription>
              Only the class-wise subject mapping is shown here, as requested.
            </CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/timetable">
              <LayoutList className="mr-2 size-4" />
              Open Timetable
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {subjectClassMap.map((item) => (
            <div key={item.className} className="rounded-2xl border p-5">
              <p className="text-sm text-muted-foreground">{item.department} Department</p>
              <h2 className="mt-1 text-xl font-semibold">{item.className}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.subjects.map((subject) => (
                  <span key={subject} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
