'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Student } from '@/types/common'

interface StudentTableProps {
  students: Student[]
  isLoading?: boolean
  onEdit?: (student: Student) => void
  onDelete?: (id: string) => void
  onView?: (student: Student) => void
}

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Active: 'default',
  Inactive: 'secondary',
  Suspended: 'destructive',
}

export function StudentTable({
  students,
  isLoading,
  onEdit,
  onDelete,
  onView,
}: StudentTableProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading students...</p>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No students found. Add a new student to get started.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Roll Number</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Semester</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell className="font-medium">{student.rollNumber}</TableCell>
            <TableCell>{student.firstName} {student.lastName}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>{student.phone}</TableCell>
            <TableCell>{student.department}</TableCell>
            <TableCell>{student.semester}</TableCell>
            <TableCell>
              <Badge variant={statusColors[student.status]}>
                {student.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView?.(student)}>
                    <Eye className="size-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit?.(student)}>
                    <Edit className="size-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete?.(student.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="size-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
