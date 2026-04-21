'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { apiClient } from '@/lib/api'
import { deleteCustomStudent, getStudentById } from '@/lib/admin-demo-data'
import { AlertTriangle, ArrowLeft, Loader2, Trash2 } from 'lucide-react'

export default function DeleteStudentPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const studentId = Array.isArray(params.id) ? params.id[0] : params.id
  const student = useMemo(() => getStudentById(Number(studentId)), [studentId])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!studentId) return

    setLoading(true)
    setError(null)
    setMessage(null)

    const response = await apiClient.delete<{ message?: string }>(`/students/${studentId}`)

    if (response.success) {
      setMessage(response.data?.message || 'Student deleted successfully.')
      setTimeout(() => router.push('/admin/students'), 900)
    } else if (student) {
      deleteCustomStudent(Number(studentId))
      setMessage('Student removed in demo mode. Refresh the backend list when API delete is connected.')
      setTimeout(() => router.push('/admin/students'), 900)
    } else {
      setError(response.error || 'Failed to delete student.')
    }

    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delete Student</h1>
          <p className="mt-2 text-muted-foreground">
            Review the student information and confirm deletion.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/students')}>
          <ArrowLeft className="mr-2 size-4" />
          Back to Students
        </Button>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-500" />
            Confirm Delete
          </CardTitle>
          <CardDescription>
            This action removes the selected student record from the current module flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-2xl border bg-slate-50 p-4">
            <p className="font-medium">{student?.name || `Student #${studentId}`}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {student?.rollNumber || 'Roll number unavailable'} • {student?.className || 'Class unavailable'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{student?.email || 'Email unavailable'}</p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.push('/admin/students')}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Trash2 className="mr-2 size-4" />}
              {loading ? 'Deleting...' : 'Delete Student'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
