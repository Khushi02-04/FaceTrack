'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllStudents, getStudentsMissingFace, subscribeToStudentChanges, type DemoStudent } from '@/lib/admin-demo-data'
import { apiClient } from '@/lib/api'
import { ArrowLeft, Camera, CheckCircle2, Loader2, ScanFace, UploadCloud } from 'lucide-react'

interface RecognizedStudent {
  id: number
  name?: string | null
  roll_no?: string | null
  department?: string | null
  year_of_study?: string | null
  is_face_registered: boolean
}

export default function FaceRecognitionPage() {
  const [students, setStudents] = useState<DemoStudent[]>([])
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [recognitionError, setRecognitionError] = useState<string | null>(null)
  const [recognizedStudent, setRecognizedStudent] = useState<RecognizedStudent | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const studentsMissingFace = getStudentsMissingFace(students)

  useEffect(() => {
    const syncStudents = () => setStudents(getAllStudents())
    syncStudents()
    return subscribeToStudentChanges(syncStudents)
  }, [])

  const speakRecognizedStudent = useCallback((studentName: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !studentName.trim()) {
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(`${studentName} recognized`)
    utterance.rate = 0.95
    utterance.pitch = 1

    const availableVoices = window.speechSynthesis.getVoices()
    const preferredVoice =
      availableVoices.find((voice) => /female|zira|aria|samantha|google us english/i.test(voice.name)) ||
      availableVoices.find((voice) => /english/i.test(voice.lang))

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    window.speechSynthesis.speak(utterance)
  }, [])

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
    setCapturedImage(null)
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
    if (!isCameraOpen || cameraStream) return

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
        if (!isCancelled) setCameraError(getCameraErrorMessage(error))
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
        videoRef.current.srcObject = null
        videoRef.current.onloadedmetadata = null
      }
    }
  }, [cameraStream])

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !videoReady) return

    setIsCapturing(true)
    setRecognitionError(null)
    setRecognizedStudent(null)

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

  const handleRecognize = async () => {
    if (!capturedImage) {
      setRecognitionError('Capture an image first.')
      return
    }

    setIsRecognizing(true)
    setRecognitionError(null)
    setRecognizedStudent(null)

    try {
      const blob = await (await fetch(capturedImage)).blob()
      const formData = new FormData()
      formData.append('file', blob, 'recognize.jpg')

      const response = await apiClient.post<RecognizedStudent>('/students/recognize', formData)

      if (response.success && response.data) {
        setRecognizedStudent(response.data)
        if (response.data.name) {
          speakRecognizedStudent(response.data.name)
        }
      } else {
        setRecognitionError(response.error || 'Failed to recognize the student.')
      }
    } catch (error) {
      setRecognitionError('Failed to recognize the student.')
    } finally {
      setIsRecognizing(false)
    }
  }

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight">
            <ScanFace className="size-8" />
            Face Recognition
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Open the camera only when you want to start recognition, then jump to the linked student and attendance flows.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/attendance">
            <ArrowLeft className="mr-2 size-4" />
            Back to Attendance
          </Link>
        </Button>
      </div>

      {cameraError && (
        <Alert variant="destructive">
          <AlertDescription>{cameraError}</AlertDescription>
        </Alert>
      )}

      {recognitionError && (
        <Alert variant="destructive">
          <AlertDescription>{recognitionError}</AlertDescription>
        </Alert>
      )}

      {recognizedStudent && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            {recognizedStudent.name} recognized successfully. Attendance can now be reviewed in the attendance module.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Camera Capture</CardTitle>
            <CardDescription>Start the camera only when you want to run face recognition.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isCameraOpen ? (
              <div className="rounded-2xl border border-dashed p-6 text-center">
                <p className="font-medium">Camera is currently off</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Click the button below to open the face-recognition camera.
                </p>
                <Button className="mt-4 bg-zinc-900 text-white hover:bg-zinc-800" onClick={() => setIsCameraOpen(true)}>
                  <Camera className="mr-2 size-4" />
                  Open Face Recognition Camera
                </Button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
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
                      <img src={capturedImage} alt="Captured frame" className="absolute inset-0 h-72 w-full rounded object-cover" />
                    )}
                  </div>

                  <div className="flex min-h-[18rem] items-center justify-center rounded-lg bg-slate-950/10 p-2">
                    {capturedImage ? (
                      <img src={capturedImage} alt="Captured preview" className="h-72 w-full rounded object-cover" />
                    ) : (
                      <p className="text-sm text-muted-foreground">No frame captured yet.</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleCapture} disabled={!videoReady || isCapturing || isRecognizing}>
                    <Camera className="mr-2 size-4" />
                    {isCapturing ? 'Capturing...' : 'Capture'}
                  </Button>
                  <Button className="bg-zinc-900 text-white hover:bg-zinc-800" onClick={handleRecognize} disabled={!capturedImage || isRecognizing}>
                    {isRecognizing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <ScanFace className="mr-2 size-4" />}
                    {isRecognizing ? 'Recognizing...' : 'Recognize Student'}
                  </Button>
                  <Button variant="ghost" onClick={stopCamera}>
                    Close Camera
                  </Button>
                </div>
              </>
            )}

            {recognizedStudent && (
              <div className="rounded-2xl border bg-emerald-50 p-4">
                <p className="font-semibold text-emerald-800">{recognizedStudent.name}</p>
                <p className="mt-1 text-sm text-emerald-700">
                  {recognizedStudent.roll_no || 'Roll number unavailable'} • {recognizedStudent.department || 'Department unavailable'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/students/${recognizedStudent.id}`}>Open Student</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/admin/attendance?student=${recognizedStudent.roll_no || ''}`}>Open Attendance</Link>
                  </Button>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students Needing Face Upload</CardTitle>
            <CardDescription>Open the student profile to register or update face data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentsMissingFace.slice(0, 8).map((student) => (
              <div key={student.id} className="rounded-2xl border p-4">
                <p className="font-medium">{student.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{student.rollNumber} • {student.className}</p>
                <p className="mt-2 text-xs text-muted-foreground">Face data: {student.faceData}</p>
                <div className="mt-3 flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/students/${student.id}`}>Add Face</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/attendance?student=${student.rollNumber}`}>Attendance</Link>
                  </Button>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-dashed p-4">
                <p className="font-medium">Registered students in roster</p>
                <p className="mt-1 text-sm text-muted-foreground">
                {students.filter((student) => student.faceData === 'Uploaded').length} students already have uploaded face data.
              </p>
              <Button asChild className="mt-4 w-full" variant="outline">
                <Link href="/admin/students">
                  <UploadCloud className="mr-2 size-4" />
                  Open Student Module
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
