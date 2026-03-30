'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Edit, Loader2, Mail, Phone, MapPin, User, BookOpen } from 'lucide-react'
import { apiClient } from '@/lib/api'

interface StudentResponse {
  id: number
  name?: string | null
  email?: string | null
  mobile?: string | null
  father_name?: string | null
  mother_name?: string | null
  roll_no?: string | null
  class_id?: number | null
  tenant_id?: number | null
  is_face_registered?: boolean
  address_line?: string | null
  address_line1?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  father_mobile?: string | null
}

const statusColors: Record<string, 'default' | 'secondary'> = {
  Active: 'default',
  Inactive: 'secondary',
}

export default function StudentDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const studentId = Array.isArray(params.id) ? params.id[0] : params.id

  const [student, setStudent] = useState<StudentResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) {
        setError('Student ID is missing.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      const response = await apiClient.get<StudentResponse>(`/students/${studentId}`)

      if (response.success && response.data) {
        setStudent(response.data)
      } else {
        setError(response.error || 'Failed to load student details.')
      }

      setIsLoading(false)
    }

    fetchStudent()
  }, [studentId])

  const fullName = student?.name || 'Student'
  const studentStatus = student?.is_face_registered ? 'Active' : 'Inactive'
  const address = [student?.address_line1 || student?.address_line, student?.city, student?.state, student?.pincode]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Details</h1>
          <p className="mt-2 text-muted-foreground">
            View the student profile and system information.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/admin/students')}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
          {studentId && (
            <Button onClick={() => router.push(`/admin/students/${studentId}/edit`)}>
              <Edit className="mr-2 size-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-8 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading student details...
          </CardContent>
        </Card>
      ) : student ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{fullName}</CardTitle>
                  <CardDescription>Roll Number: {student.roll_no || 'N/A'}</CardDescription>
                </div>
                <Badge variant={statusColors[studentStatus]}>{studentStatus}</Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="size-4" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Full Name</p>
                  <p className="font-medium">{fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Class ID</p>
                  <p className="font-medium">{student.class_id ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tenant ID</p>
                  <p className="font-medium">{student.tenant_id ?? 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="size-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <span>{student.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{student.mobile || 'N/A'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 text-muted-foreground" />
                  <span>{address || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="size-4" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Roll Number</p>
                  <p className="font-medium">{student.roll_no || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Face Registered</p>
                  <p className="font-medium">{student.is_face_registered ? 'Yes' : 'No'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="size-4" />
                  Parent Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Father&apos;s Name</p>
                  <p className="font-medium">{student.father_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Mother&apos;s Name</p>
                  <p className="font-medium">{student.mother_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Parent Phone</p>
                  <p className="font-medium">{student.father_mobile || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  )
}
