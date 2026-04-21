'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save } from 'lucide-react'

export default function NewTeacherPage() {
  const router = useRouter()
  const [saved, setSaved] = useState(false)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Teacher</h1>
          <p className="mt-2 text-muted-foreground">
            Create a teacher profile draft with department, subject, and class ownership.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/teachers')}>
          <ArrowLeft className="mr-2 size-4" />
          Back to Teachers
        </Button>
      </div>

      {saved && (
        <Alert>
          <AlertDescription>
            Teacher draft captured in the UI flow. The next step can be wiring this form to the teacher create API.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Teacher Information</CardTitle>
          <CardDescription>These values match the data shown in teacher, timetable, and academics modules.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault()
              setSaved(true)
            }}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Teacher Name</Label>
                <Input id="name" placeholder="Prof. Example" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="faculty@snjb.edu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="9876500108" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departments</Label>
                <Input id="department" placeholder="CM, IT" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjects">Subjects</Label>
                <Input id="subjects" placeholder="Data Structures, DBMS" />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/teachers')}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 size-4" />
                Save Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
