'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, Camera, Edit, Loader2, Mail, Phone, MapPin, User, BookOpen } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { getStudentById, updateCustomStudentFaceData } from '@/lib/admin-demo-data'

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
  department?: string | null
  year_of_study?: string | null
  address_line?: string | null
  address_line1?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  father_mobile?: string | null
}

interface FaceRegistrationResponse {
  message: string
  student_id: number
  is_face_registered: boolean
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
  const [isDemoStudent, setIsDemoStudent] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [faceError, setFaceError] = useState<string | null>(null)
  const [faceSuccess, setFaceSuccess] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isRegisteringFace, setIsRegisteringFace] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const getCameraErrorMessage = (cameraError: unknown) => {
    if (cameraError instanceof DOMException) {
      if (cameraError.name === 'NotAllowedError') {
        return 'Camera permission was denied. Please allow camera access in your browser settings and try again.'
      }

      if (cameraError.name === 'NotFoundError') {
        return 'No camera was found on this device.'
      }

      if (cameraError.name === 'NotReadableError') {
        return 'The camera is already in use by another application.'
      }
    }

    return 'Unable to open camera. Please allow camera access.'
  }

  const fetchStudent = useCallback(async () => {
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
      setIsDemoStudent(false)
    } else {
      const demoStudent = getStudentById(Number(studentId))

      if (demoStudent) {
        setStudent({
          id: demoStudent.id,
          name: demoStudent.name,
          email: demoStudent.email,
          mobile: demoStudent.contact,
          father_name: demoStudent.fatherName || 'Demo Parent',
          mother_name: demoStudent.motherName || 'Demo Parent',
          roll_no: demoStudent.rollNumber,
          class_id: demoStudent.id,
          tenant_id: 1,
          is_face_registered: demoStudent.faceData === 'Uploaded',
          department: demoStudent.department,
          year_of_study: demoStudent.year,
          address_line: demoStudent.addressLine1 || `${demoStudent.className} Campus Block`,
          address_line1: demoStudent.addressLine1 || `${demoStudent.className} Campus Block`,
          city: demoStudent.city || 'Nashik',
          state: demoStudent.state || 'Maharashtra',
          pincode: demoStudent.pincode || '422001',
          father_mobile: demoStudent.parentPhone || '9876000001',
        })
        setIsDemoStudent(true)
      } else {
        setError(response.error || 'Failed to load student details.')
      }
    }

    setIsLoading(false)
  }, [studentId])

  useEffect(() => {
    fetchStudent()
  }, [fetchStudent])

  useEffect(() => {
    if (!isCameraOpen) {
      if (videoRef.current) {
        videoRef.current.srcObject = null
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
        } catch (cameraError) {
          if (isCancelled) return
          setStreamError(getCameraErrorMessage(cameraError))
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

      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
        setCameraStream(null)
      }

      setVideoReady(false)
      setStreamError(null)
    }
  }, [cameraStream, isCameraOpen])

  const openCamera = () => {
    setCapturedImage(null)
    setFaceError(null)
    setFaceSuccess(null)
    setStreamError(null)
    setIsCameraOpen(true)
  }

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }

    setIsCameraOpen(false)
    setCapturedImage(null)
    setVideoReady(false)
  }

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !videoReady) return

    setIsCapturing(true)
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) {
      setIsCapturing(false)
      return
    }

    const width = video.videoWidth || 640
    const height = video.videoHeight || 480
    canvas.width = width
    canvas.height = height
    context.drawImage(video, 0, 0, width, height)
    setCapturedImage(canvas.toDataURL('image/jpeg'))
    setIsCapturing(false)
  }, [videoReady])

  const handleRegisterFace = async () => {
    if (!capturedImage || !studentId) {
      setFaceError('Capture an image first.')
      return
    }

    setIsRegisteringFace(true)
    setFaceError(null)
    setFaceSuccess(null)

    try {
      const blob = await (await fetch(capturedImage)).blob()
      const formData = new FormData()
      formData.append('file', blob, 'face.jpg')

      const response = await apiClient.post<FaceRegistrationResponse>(
        `/students/${studentId}/face`,
        formData
      )

      if (response.success && response.data) {
        setFaceSuccess(response.data.message || 'Face registered successfully.')
        await fetchStudent()
        closeCamera()
      } else if (isDemoStudent) {
        updateCustomStudentFaceData(Number(studentId), 'Uploaded')
        setStudent((current) => (current ? { ...current, is_face_registered: true } : current))
        setFaceSuccess('Face marked as uploaded in demo mode.')
        closeCamera()
      } else {
        setFaceError(response.error || 'Failed to register face.')
      }
    } catch (registerError) {
      console.error('Face registration error', registerError)
      if (isDemoStudent) {
        updateCustomStudentFaceData(Number(studentId), 'Uploaded')
        setStudent((current) => (current ? { ...current, is_face_registered: true } : current))
        setFaceSuccess('Face marked as uploaded in demo mode.')
        closeCamera()
      } else {
        setFaceError('Failed to register face.')
      }
    } finally {
      setIsRegisteringFace(false)
    }
  }

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
          {student && (
            <Button variant="outline" onClick={openCamera}>
              <Camera className="mr-2 size-4" />
              {student.is_face_registered ? 'Update Face' : 'Register Face'}
            </Button>
          )}
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

      {faceSuccess && (
        <Alert>
          <AlertDescription>{faceSuccess}</AlertDescription>
        </Alert>
      )}

      {faceError && (
        <Alert variant="destructive">
          <AlertDescription>{faceError}</AlertDescription>
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
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium">{student.department || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Year of Study</p>
                  <p className="font-medium">{student.year_of_study || 'N/A'}</p>
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

      <Dialog
        open={isCameraOpen}
        onOpenChange={(open) => {
          if (!open) {
            if (!isRegisteringFace) {
              closeCamera()
            }
            return
          }

          setIsCameraOpen(true)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Student Face</DialogTitle>
            <DialogDescription>
              Capture the student&apos;s face and save it to this profile for recognition.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative flex min-h-[18rem] items-center justify-center rounded-lg bg-slate-950/10 p-2">
                {!streamError && !videoReady && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded bg-black/50">
                    <p className="text-sm text-white">Loading camera...</p>
                  </div>
                )}
                {streamError && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded bg-red-900/80">
                    <p className="px-4 text-center text-sm text-white">{streamError}</p>
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
                    alt="Captured frame"
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
                  <div className="flex h-72 items-center justify-center text-muted-foreground">
                    No capture yet
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={handleCapture} disabled={isCapturing || isRegisteringFace || !videoReady}>
                {isCapturing ? 'Capturing...' : 'Capture'}
              </Button>
              <Button onClick={handleRegisterFace} disabled={isRegisteringFace || !capturedImage}>
                {isRegisteringFace ? 'Saving Face...' : 'Register Face'}
              </Button>
              <Button variant="outline" onClick={closeCamera} disabled={isRegisteringFace}>
                Close
              </Button>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </div>
  )
}
