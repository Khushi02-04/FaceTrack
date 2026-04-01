'use client'

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Search, Filter, AlertCircle, Camera } from "lucide-react"
import { AddStudentDialog } from "@/components/students/add-student-dialog"
import { StudentTable } from "@/components/students/student-table"
import { useStudents } from "@/hooks/useStudents"
import { apiClient } from "@/lib/api"

export default function StudentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [recognizeResult, setRecognizeResult] = useState<string | null>(null)
  const [recognizeError, setRecognizeError] = useState<string | null>(null)
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [streamError, setStreamError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const getCameraErrorMessage = (error: unknown) => {
    if (error instanceof DOMException) {
      if (error.name === "NotAllowedError") {
        return "Camera permission was denied. Please allow camera access in your browser settings and try again."
      }

      if (error.name === "NotFoundError") {
        return "No camera was found on this device."
      }

      if (error.name === "NotReadableError") {
        return "The camera is already in use by another application."
      }
    }

    return "Unable to open camera. Please allow camera access."
  }

  const {
    students,
    filteredStudents,
    totalCount,
    isLoading,
    error,
    addStudent,
    deleteStudent,
  } = useStudents()

  const handleAddStudent = async (studentData: any) => {
    return await addStudent(studentData)
  }

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await deleteStudent(id)
    }
  }

  useEffect(() => {
    if (!isCameraOpen) {
      if (videoRef.current) videoRef.current.srcObject = null
      if (canvasRef.current) {
        canvasRef.current.width = 0
        canvasRef.current.height = 0
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
            const message = "Camera access is not supported in this browser."
            if (!isCancelled) {
              setStreamError(message)
              setRecognizeError(message)
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
          if (isCancelled) return

          console.error("Camera open failed", error)
          const message = getCameraErrorMessage(error)
          setStreamError(message)
          setRecognizeError(message)
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
          setStreamError("Video play failed")
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

  const openCamera = async () => {
    setRecognizeResult(null)
    setRecognizeError(null)
    setCapturedImage(null)
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
  }

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !videoReady) return
    setIsCapturing(true)
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) {
      setIsCapturing(false)
      return
    }
    const width = video.videoWidth || 640
    const height = video.videoHeight || 480
    canvas.width = width
    canvas.height = height
    context.drawImage(video, 0, 0, width, height)
    const dataUrl = canvas.toDataURL("image/jpeg")
    setCapturedImage(dataUrl)
    setIsCapturing(false)
  }, [videoReady])

  const handleRecognize = async () => {
    if (!capturedImage) {
      setRecognizeError("Capture an image first")
      return
    }

    setIsRecognizing(true)
    setRecognizeResult(null)
    setRecognizeError(null)

    try {
      const blob = await (await fetch(capturedImage)).blob()
      const formData = new FormData()
      formData.append("file", blob, "face.jpg")

      const response = await apiClient.post<{
        id?: string
        name?: string
        email?: string
        roll_no?: string
        department?: string
        year_of_study?: string
      }>(
        "/students/recognize",
        formData
      )

      if (response.data) {
        const recognizedStudent = response.data
        const studentName = recognizedStudent.name || recognizedStudent.email || "Student"
        const detailParts = [
          `Name: ${studentName}`,
          recognizedStudent.roll_no ? `Roll No: ${recognizedStudent.roll_no}` : null,
          recognizedStudent.department ? `Department: ${recognizedStudent.department}` : null,
          recognizedStudent.year_of_study ? `Year: ${recognizedStudent.year_of_study}` : null,
        ].filter(Boolean)

        setRecognizeResult(`Successfully recognized\n${detailParts.join("\n")}`)

        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          const speech = new SpeechSynthesisUtterance(
            `${studentName}. Roll number ${recognizedStudent.roll_no || "not available"}.`
          )
          window.speechSynthesis.cancel()
          window.speechSynthesis.speak(speech)
        }

        if (typeof window !== "undefined") {
          window.localStorage.setItem("attendance:lastRecognition", String(Date.now()))
        }

        if (recognizedStudent.id) {
          setTimeout(() => {
            router.push(`/admin/students/${recognizedStudent.id}`)
          }, 2000)
        }
      } else {
        setRecognizeError(response.error || "No recognition result returned")
      }
    } catch (error) {
      console.error("Recognize API error", error)
      setRecognizeError("Recognition failed. Please try again.")
    } finally {
      setIsRecognizing(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const activeStudents = filteredStudents.filter(s => s.status === "Active").length
  const inactiveStudents = filteredStudents.filter(s => s.status === "Inactive").length
  const suspendedStudents = filteredStudents.filter(s => s.status === "Suspended").length

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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
        <Button onClick={openCamera} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Camera className="size-4 mr-2" />
          Recognize Student
        </Button>
        <AddStudentDialog onAdd={handleAddStudent} />
      </div>

      <Dialog
        open={isCameraOpen}
        onOpenChange={(open) => {
          if (!open) {
            if (!isRecognizing) {
              closeCamera()
            }
            return
          }

          setIsCameraOpen(true)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recognize Student</DialogTitle>
            <DialogDescription>Use your webcam to capture a face and identify the student.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/10 rounded-lg p-2 relative min-h-[18rem] flex items-center justify-center">
                {!streamError && !videoReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded z-10">
                    <p className="text-white text-sm">Loading camera...</p>
                  </div>
                )}
                {streamError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 rounded z-10">
                    <p className="text-white text-sm">{streamError}</p>
                  </div>
                )}
                <video
                  ref={videoRef}
                  className={`w-full h-72 object-cover rounded ${videoReady && !capturedImage ? '' : 'invisible'}`}
                  autoPlay
                  playsInline
                  muted
                  style={{ background: "#222" }}
                />
                {capturedImage && (
                  <img src={capturedImage} alt="Captured frame" className="absolute inset-0 w-full h-72 object-cover rounded z-20" />
                )}
              </div>
              <div className="bg-slate-950/10 rounded-lg p-2 min-h-[18rem] flex items-center justify-center">
                {capturedImage ? (
                  <img src={capturedImage} alt="Captured preview" className="w-full h-72 object-cover rounded" />
                ) : (
                  <div className="flex h-72 items-center justify-center text-muted-foreground">No capture yet</div>
                )}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button onClick={handleCapture} disabled={isCapturing || isRecognizing || !videoReady}>
                {isCapturing ? "Capturing..." : "Capture"}
              </Button>
              <Button onClick={handleRecognize} disabled={isRecognizing || !capturedImage}>
                {isRecognizing ? "Identifying..." : "Identify"}
              </Button>
              <Button variant="outline" onClick={closeCamera} disabled={isRecognizing}>
                {isRecognizing ? "Processing..." : "Close"}
              </Button>
            </div>

            {recognizeResult && (
              <div className="whitespace-pre-line rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">{recognizeResult}</div>
            )}
            {recognizeError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">{recognizeError}</div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" style={{ display: capturedImage ? "block" : "none", maxWidth: "100%", border: "1px solid #ccc" }} />
        </DialogContent>
      </Dialog>

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
            isLoading={isLoading}
            onEdit={(student) => {
              router.push(`/admin/students/${student.id}/edit`)
            }}
            onView={(student) => {
              router.push(`/admin/students/${student.id}`)
            }}
            onDelete={handleDeleteStudent}
          />
        </CardContent>
      </Card>
    </div>
  )
}
