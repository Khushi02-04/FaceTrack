'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Search, Filter } from 'lucide-react'
import { AddStudentDialog } from '@/components/students/add-student-dialog'
import { StudentTable } from '@/components/students/student-table'
import { StudentDetailModal } from '@/components/students/student-detail-modal'
import { useStudents } from '@/hooks/useStudents'
import type { Student } from '@/types/common'

export default function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const {
    students,
    filteredStudents,
    totalCount,
    addStudent,
    deleteStudent,
  } = useStudents()

  const handleAddStudent = async (studentData: any) => {
    await addStudent(studentData)
  }

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await deleteStudent(id)
      if (selectedStudent?.id === id) {
        setShowDetailModal(false)
        setSelectedStudent(null)
      }
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const activeStudents = filteredStudents.filter(s => s.status === 'Active').length
  const inactiveStudents = filteredStudents.filter(s => s.status === 'Inactive').length
  const suspendedStudents = filteredStudents.filter(s => s.status === 'Suspended').length

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Users className="size-8" />
          Students Management
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage all student records and information
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold">{totalCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-3xl font-bold text-green-600">{activeStudents}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Inactive</p>
              <p className="text-3xl font-bold text-yellow-600">{inactiveStudents}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Suspended</p>
              <p className="text-3xl font-bold text-red-600">{suspendedStudents}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-end">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, roll number, or email..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="size-4" />
        </Button>
        <AddStudentDialog onAdd={handleAddStudent} />
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
          <CardDescription>
            Showing {students.length} of {totalCount} students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudentTable
            students={students}
            onView={(student) => {
              setSelectedStudent(student)
              setShowDetailModal(true)
            }}
            onDelete={handleDeleteStudent}
          />
        </CardContent>
      </Card>

      {/* Student Detail Modal */}
      <StudentDetailModal
        open={showDetailModal}
        student={selectedStudent}
        onOpenChange={setShowDetailModal}
        onDelete={() => {
          if (selectedStudent) {
            handleDeleteStudent(selectedStudent.id)
          }
        }}
        onEdit={() => {
          // TODO: Implement edit modal
        }}
      />
    </div>
  )
}
