'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, Mail, Phone, Calendar, MapPin, BookOpen } from 'lucide-react'
import type { Student } from '@/types/common'

interface StudentDetailModalProps {
  open?: boolean
  student: Student | null
  onOpenChange?: (open: boolean) => void
  onEdit?: () => void
  onDelete?: () => void
}

export function StudentDetailModal({
  open,
  student,
  onOpenChange,
  onEdit,
  onDelete,
}: StudentDetailModalProps) {
  if (!student) return null

  const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    Active: 'default',
    Inactive: 'secondary',
    Suspended: 'destructive',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{student.firstName} {student.lastName}</span>
            <Badge variant={statusColors[student.status]}>
              {student.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Roll Number: {student.rollNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="size-4" />
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Gender</p>
                <p className="font-medium">{student.gender}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Blood Group</p>
                <p className="font-medium">{student.bloodGroup || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Nationality</p>
                <p className="font-medium">{student.nationality || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Mail className="size-4" />
              Contact Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                <span>{student.address}, {student.city}, {student.state} {student.postalCode}</span>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <BookOpen className="size-4" />
              Academic Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-medium">{student.department}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Semester</p>
                <p className="font-medium">{student.semester}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Admission Date</p>
                <p className="font-medium">{new Date(student.admissionDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="size-4" />
              Parent Information
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Father's Name</p>
                <p className="font-medium">{student.fatherName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Mother's Name</p>
                <p className="font-medium">{student.motherName || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                <span>{student.parentPhone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2 text-xs text-muted-foreground pt-4 border-t">
            <div>Created: {new Date(student.createdAt).toLocaleString()}</div>
            <div>Last Updated: {new Date(student.updatedAt).toLocaleString()}</div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Close
          </Button>
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
