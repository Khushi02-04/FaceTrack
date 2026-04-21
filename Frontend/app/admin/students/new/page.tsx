'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addCustomStudent } from '@/lib/admin-demo-data'
import { ArrowLeft, Camera, CheckCircle2, Loader2, Save, UploadCloud } from 'lucide-react'

type FormState = {
  name: string
  rollNumber: string
  className: string
  email: string
  mobile: string
  addressLine1: string
  city: string
  state: string
  pincode: string
  fatherName: string
  motherName: string
  parentPhone: string
}

const initialForm: FormState = {
  name: '',
  rollNumber: '',
  className: '',
  email: '',
  mobile: '',
  addressLine1: '',
  city: '',
  state: '',
  pincode: '',
  fatherName: '',
  motherName: '',
  parentPhone: '',
}

export default function NewStudentPage() {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState<FormState>(initialForm)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [faceMarked, setFaceMarked] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const setField = (field: keyof FormState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const getCameraErrorMessage = (error: unknown) => {
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError') return 'Camera permission was denied. Please allow access and try again.'
      if (error.name === 'NotFoundError') return 'No camera was found on this device.'
      if (error.name === 'NotReadableError') return 'The camera is currently being used by another app.'
    }

    return 'Unable to start the camera right now.'
  }

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setVideoReady(false)
    setIsCameraOpen(false)
  }, [cameraStream])

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraStream])

  useEffect(() => {
    if (!isCameraOpen || cameraStream || !videoRef.current) return

    let isCancelled = false

    const startCamera = async () => {
      try {
        setCameraError(null)
        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraError('Camera access is not supported in this browser.')
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
          setCameraError(getCameraErrorMessage(error))
        }
      }
    }

    startCamera()

    return () => {
      isCancelled = true
    }
  }, [cameraStream, isCameraOpen])

  useEffect(() => {
    if (!cameraStream || !videoRef.current) return

    videoRef.current.srcObject = cameraStream
    videoRef.current.onloadedmetadata = () => {
      setVideoReady(true)
      videoRef.current?.play().catch(() => {
        setCameraError('Video preview failed to start.')
      })
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = null
      }
    }
  }, [cameraStream])

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

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Student</h1>
          <p className="mt-2 text-muted-foreground">
            Add a complete student profile and capture face data in the same flow.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/students')}>
          <ArrowLeft className="mr-2 size-4" />
          Back to Students
        </Button>
      </div>

      {saved && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Student saved successfully. {faceMarked ? 'Face data has also been captured.' : 'You can still register face data from the student profile.'}
          </AlertDescription>
        </Alert>
      )}

      {cameraError && (
        <Alert variant="destructive">
          <AlertDescription>{cameraError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Fill the same personal, contact, academic, and parent details shown in the student profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-8"
              onSubmit={(event) => {
                event.preventDefault()
                const student = addCustomStudent({
                  name: formData.name,
                  rollNumber: formData.rollNumber,
                  className: formData.className,
                  email: formData.email,
                  mobile: formData.mobile,
                  faceData: faceMarked ? 'Uploaded' : 'Not Uploaded',
                  addressLine1: formData.addressLine1,
                  city: formData.city,
                  state: formData.state,
                  pincode: formData.pincode,
                  fatherName: formData.fatherName,
                  motherName: formData.motherName,
                  parentPhone: formData.parentPhone,
                })
                setSaved(true)
                setTimeout(() => router.push(`/admin/students/${student.id}`), 700)
              }}
            >
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={formData.name} onChange={(event) => setField('name', event.target.value)} placeholder="Enter full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input id="rollNumber" value={formData.rollNumber} onChange={(event) => setField('rollNumber', event.target.value)} placeholder="CMBE001" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="className">Class</Label>
                    <Input id="className" value={formData.className} onChange={(event) => setField('className', event.target.value)} placeholder="CM BE" required />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Contact Information</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(event) => setField('email', event.target.value)} placeholder="student@snjb.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input id="mobile" value={formData.mobile} onChange={(event) => setField('mobile', event.target.value)} placeholder="9876543210" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="addressLine1">Address</Label>
                    <Input id="addressLine1" value={formData.addressLine1} onChange={(event) => setField('addressLine1', event.target.value)} placeholder="CM BE Campus Block" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={formData.city} onChange={(event) => setField('city', event.target.value)} placeholder="Nashik" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" value={formData.state} onChange={(event) => setField('state', event.target.value)} placeholder="Maharashtra" />
                  </div>
                  <div className="space-y-2 md:w-1/2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" value={formData.pincode} onChange={(event) => setField('pincode', event.target.value)} placeholder="422001" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Parent Information</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father&apos;s Name</Label>
                    <Input id="fatherName" value={formData.fatherName} onChange={(event) => setField('fatherName', event.target.value)} placeholder="Enter father's name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother&apos;s Name</Label>
                    <Input id="motherName" value={formData.motherName} onChange={(event) => setField('motherName', event.target.value)} placeholder="Enter mother's name" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="parentPhone">Parent Phone</Label>
                    <Input id="parentPhone" value={formData.parentPhone} onChange={(event) => setField('parentPhone', event.target.value)} placeholder="9876000001" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/students')}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 size-4" />
                  Save
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Face Data Upload</CardTitle>
            <CardDescription>Capture face data while adding the student so the profile is ready for recognition.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-dashed p-4">
              <p className="font-medium">Current status</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {faceMarked ? 'Face data captured for this student.' : 'No face data captured yet.'}
              </p>
            </div>

            {!isCameraOpen ? (
              <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800" onClick={() => setIsCameraOpen(true)}>
                <Camera className="mr-2 size-4" />
                Open Camera for Face Upload
              </Button>
            ) : (
              <>
                <div className="relative flex min-h-[18rem] items-center justify-center rounded-lg bg-slate-950/10 p-2">
                  {!cameraError && !videoReady && (
                    <div className="absolute inset-0 flex items-center justify-center rounded bg-black/50 text-sm text-white">
                      Loading camera...
                    </div>
                  )}
                  <video
                    ref={videoRef}
                    className={`h-72 w-full rounded object-cover ${videoReady && !capturedImage ? '' : 'invisible'}`}
                    autoPlay
                    playsInline
                    muted
                  />
                  {capturedImage && (
                    <img src={capturedImage} alt="Captured face" className="absolute inset-0 h-72 w-full rounded object-cover" />
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleCapture} disabled={!videoReady || isCapturing}>
                    {isCapturing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Camera className="mr-2 size-4" />}
                    {isCapturing ? 'Capturing...' : 'Capture Face'}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!capturedImage}
                    onClick={() => {
                      setFaceMarked(true)
                      stopCamera()
                    }}
                  >
                    <UploadCloud className="mr-2 size-4" />
                    Use This Face
                  </Button>
                  <Button variant="ghost" onClick={stopCamera}>
                    Close Camera
                  </Button>
                </div>
              </>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
