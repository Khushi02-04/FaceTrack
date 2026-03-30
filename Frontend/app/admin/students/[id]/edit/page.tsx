'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
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
}

interface StudentUpdateResponse {
  id: number
  message: string
}

interface EditStudentForm {
  name: string
  email: string
  mobile: string
  father_name: string
  mother_name: string
  roll_no: string
  class_id: string
}

const emptyForm: EditStudentForm = {
  name: '',
  email: '',
  mobile: '',
  father_name: '',
  mother_name: '',
  roll_no: '',
  class_id: '',
}

export default function EditStudentPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const studentId = Array.isArray(params.id) ? params.id[0] : params.id

  const [formData, setFormData] = useState<EditStudentForm>(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          mobile: response.data.mobile || '',
          father_name: response.data.father_name || '',
          mother_name: response.data.mother_name || '',
          roll_no: response.data.roll_no || '',
          class_id: response.data.class_id ? String(response.data.class_id) : '',
        })
      } else {
        setError(response.error || 'Failed to load student details.')
      }

      setIsLoading(false)
    }

    fetchStudent()
  }, [studentId])

  const handleChange = (field: keyof EditStudentForm, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!studentId) {
      setError('Student ID is missing.')
      return
    }

    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    const payload = {
      name: formData.name.trim() || undefined,
      email: formData.email.trim() || undefined,
      mobile: formData.mobile.trim() || undefined,
      father_name: formData.father_name.trim() || undefined,
      mother_name: formData.mother_name.trim() || undefined,
      roll_no: formData.roll_no.trim() || undefined,
      class_id: formData.class_id.trim() ? Number(formData.class_id) : undefined,
    }

    const response = await apiClient.put<StudentUpdateResponse>(`/students/${studentId}`, payload)

    if (response.success && response.data) {
      setSuccessMessage(response.data.message || 'Student updated successfully.')
    } else {
      setError(response.error || 'Failed to update student.')
    }

    setIsSaving(false)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Student</h1>
          <p className="mt-2 text-muted-foreground">
            Update the student details that are supported by the backend.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/students')}>
          <ArrowLeft className="mr-2 size-4" />
          Back to Students
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>
            Name, contact details, roll number, and class can be edited here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 py-8 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading student details...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => handleChange('email', event.target.value)}
                    placeholder="Enter email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(event) => handleChange('mobile', event.target.value)}
                    placeholder="Enter mobile number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roll_no">Roll Number</Label>
                  <Input
                    id="roll_no"
                    value={formData.roll_no}
                    onChange={(event) => handleChange('roll_no', event.target.value)}
                    placeholder="Enter roll number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class_id">Class ID</Label>
                  <Input
                    id="class_id"
                    type="number"
                    value={formData.class_id}
                    onChange={(event) => handleChange('class_id', event.target.value)}
                    placeholder="Enter class ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="father_name">Father&apos;s Name</Label>
                  <Input
                    id="father_name"
                    value={formData.father_name}
                    onChange={(event) => handleChange('father_name', event.target.value)}
                    placeholder="Enter father's name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mother_name">Mother&apos;s Name</Label>
                  <Input
                    id="mother_name"
                    value={formData.mother_name}
                    onChange={(event) => handleChange('mother_name', event.target.value)}
                    placeholder="Enter mother's name"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/students')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
