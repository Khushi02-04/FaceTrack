'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Camera, Loader2, Plus } from 'lucide-react'
import type { Student } from '@/types/common'
import { apiClient } from '@/lib/api'

interface AddStudentDialogProps {
  onAdd?: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Student | void> | Student | void
}

export function AddStudentDialog({ onAdd }: AddStudentDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    rollNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    department: '',
    yearOfStudy: '1st Year',
    semester: '1',
    admissionDate: '',
    fatherName: '',
    motherName: '',
    parentPhone: '',
    bloodGroup: '',
    nationality: '',
    status: 'Active',
  })

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const resetForm = () => {
    setFormData({
      rollNumber: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'Male',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      department: '',
      yearOfStudy: '1st Year',
      semester: '1',
      admissionDate: '',
      fatherName: '',
      motherName: '',
      parentPhone: '',
      bloodGroup: '',
      nationality: '',
      status: 'Active',
    })
    setCapturedImage(null)
    setSubmitError(null)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getCameraErrorMessage = (error: unknown) => {
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError') {
        return 'Camera permission was denied. Please allow camera access in your browser settings and try again.'
      }

      if (error.name === 'NotFoundError') {
        return 'No camera was found on this device.'
      }

      if (error.name === 'NotReadableError') {
        return 'The camera is already in use by another application.'
      }
    }

    return 'Unable to open camera. Please allow camera access.'
  }

  useEffect(() => {
    if (!open) {
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
        setCameraStream(null)
      }
      setVideoReady(false)
      setStreamError(null)
      return
    }

    setVideoReady(false)
    setStreamError(null)

    if (!cameraStream) {
      let isCancelled = false

      const startCamera = async () => {
        try {
          if (!navigator.mediaDevices?.getUserMedia) {
            if (!isCancelled) {
              setStreamError('Camera access is not supported in this browser.')
            }
            return
          }

          const stream = await navigator.mediaDevices.getUserMedia({ video: true })

          if (isCancelled) {
            stream.getTracks().forEach((track) => track.stop())
            return
          }

          setCameraStream(stream)
        } catch (error) {
          if (!isCancelled) {
            setStreamError(getCameraErrorMessage(error))
          }
        }
      }

      startCamera()

      return () => {
        isCancelled = true
      }
    }

    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream
      videoRef.current.onloadedmetadata = () => {
        setVideoReady(true)
        videoRef.current?.play().catch(() => {
          setStreamError('Video play failed')
        })
      }
      videoRef.current.onloadeddata = () => {
        setVideoReady(true)
      }
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null
        videoRef.current.onloadedmetadata = null
        videoRef.current.onloadeddata = null
      }
    }
  }, [cameraStream, open])

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !videoReady) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    const width = video.videoWidth || 640
    const height = video.videoHeight || 480
    canvas.width = width
    canvas.height = height
    context.drawImage(video, 0, 0, width, height)
    setCapturedImage(canvas.toDataURL('image/jpeg'))
  }, [videoReady])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSubmitError(null)

    try {
      if (!capturedImage) {
        throw new Error('Please capture the student face before saving the student record.')
      }

      const createdStudent = await onAdd?.({
        ...formData,
        semester: parseInt(formData.semester),
      } as Student)

      if (capturedImage && createdStudent?.id) {
        const blob = await (await fetch(capturedImage)).blob()
        const faceFormData = new FormData()
        faceFormData.append('file', blob, 'face.jpg')

        const faceResponse = await apiClient.post<{ message: string }>(
          `/students/${createdStudent.id}/face`,
          faceFormData
        )

        if (!faceResponse.success) {
          throw new Error(faceResponse.error || 'Student was created, but face registration failed.')
        }
      }

      resetForm()
      setOpen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add student.'
      setSubmitError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4 mr-2" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Fill in the student information and capture a face image in one step.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Face Capture</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative flex min-h-[18rem] items-center justify-center rounded-lg bg-slate-950/10 p-2">
                {!streamError && !videoReady && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded bg-black/50">
                    <p className="text-sm text-white">Loading camera...</p>
                  </div>
                )}
                {streamError && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded bg-red-900/80 p-4">
                    <p className="text-center text-sm text-white">{streamError}</p>
                  </div>
                )}
                <video
                  ref={videoRef}
                  className={`h-72 w-full rounded object-cover ${videoReady && !capturedImage ? '' : 'invisible'}`}
                  autoPlay
                  playsInline
                  muted
                  style={{ background: '#222' }}
                />
                {capturedImage && (
                  <img
                    src={capturedImage}
                    alt="Captured student face"
                    className="absolute inset-0 z-20 h-72 w-full rounded object-cover"
                  />
                )}
              </div>
              <div className="flex min-h-[18rem] items-center justify-center rounded-lg bg-slate-950/10 p-2">
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Captured preview"
                    className="h-72 w-full rounded object-cover"
                  />
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    Capture the student&apos;s face now. This image will be stored with the student record.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={handleCapture} disabled={!videoReady}>
                <Camera className="mr-2 size-4" />
                {capturedImage ? 'Retake Face' : 'Capture Face'}
              </Button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={(e) => handleChange('rollNumber', e.target.value)}
                required
              />
              <Input
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
              />
              <Input
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
              <Input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
              <Input
                type="date"
                placeholder="Date of Birth"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              />
              <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Blood Group"
                value={formData.bloodGroup}
                onChange={(e) => handleChange('bloodGroup', e.target.value)}
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Academic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Department"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                required
              />
              <Select value={formData.yearOfStudy} onValueChange={(value) => handleChange('yearOfStudy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Year of Study" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st Year">1st Year</SelectItem>
                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                  <SelectItem value="4th Year">4th Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formData.semester} onValueChange={(value) => handleChange('semester', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                placeholder="Admission Date"
                value={formData.admissionDate}
                onChange={(e) => handleChange('admissionDate', e.target.value)}
              />
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="col-span-2"
              />
              <Input
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
              <Input
                placeholder="State"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
              />
              <Input
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
              />
              <Input
                placeholder="Nationality"
                value={formData.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
              />
            </div>
          </div>

          {/* Parent Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Parent Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Father's Name"
                value={formData.fatherName}
                onChange={(e) => handleChange('fatherName', e.target.value)}
              />
              <Input
                placeholder="Mother's Name"
                value={formData.motherName}
                onChange={(e) => handleChange('motherName', e.target.value)}
              />
              <Input
                type="tel"
                placeholder="Parent Phone"
                value={formData.parentPhone}
                onChange={(e) => handleChange('parentPhone', e.target.value)}
                className="col-span-2"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
              {loading ? 'Saving Student...' : 'Add Student'}
            </Button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </form>
      </DialogContent>
    </Dialog>
  )
}
