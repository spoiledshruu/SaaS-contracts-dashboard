"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface UploadFile {
  id: string
  file: File
  status: "uploading" | "success" | "error"
  progress: number
  error?: string
}

interface UploadModalProps {
  children: React.ReactNode
}

export function UploadModal({ children }: UploadModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }, [])

  const handleFiles = useCallback((files: File[]) => {
    const newUploadFiles: UploadFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "uploading",
      progress: 0,
    }))

    setUploadFiles((prev) => [...prev, ...newUploadFiles])

    // Simulate upload for each file
    newUploadFiles.forEach((uploadFile) => {
      simulateUpload(uploadFile.id)
    })
  }, [])

  const simulateUpload = useCallback((fileId: string) => {
    const updateProgress = (progress: number) => {
      setUploadFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, progress } : file)))
    }

    const completeUpload = (status: "success" | "error", error?: string) => {
      setUploadFiles((prev) =>
        prev.map((file) => (file.id === fileId ? { ...file, status, progress: 100, error } : file)),
      )
    }

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        clearInterval(interval)
        // Randomly succeed or fail for demo purposes
        const shouldFail = Math.random() < 0.2 // 20% chance of failure
        if (shouldFail) {
          completeUpload("error", "Upload failed. Please try again.")
        } else {
          completeUpload("success")
        }
      } else {
        updateProgress(Math.min(progress, 95))
      }
    }, 200)
  }, [])

  const removeFile = useCallback((fileId: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId))
  }, [])

  const clearAll = useCallback(() => {
    setUploadFiles([])
  }, [])

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
    }
  }

  const getStatusBadge = (status: UploadFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Badge variant="secondary">Uploading</Badge>
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Success
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Upload Contracts</DialogTitle>
          <DialogDescription>
            Upload contract documents for analysis. Supported formats: PDF, DOC, DOCX
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Drop files here or click to browse</h3>
            <p className="text-sm text-muted-foreground mb-4">Support for PDF, DOC, and DOCX files up to 10MB each</p>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="bg-transparent">
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Uploaded Files List */}
          {uploadFiles.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Uploaded Files ({uploadFiles.length})</h4>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {uploadFiles.map((uploadFile) => (
                  <div key={uploadFile.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{uploadFile.file.name}</p>
                          <p className="text-sm text-muted-foreground">{formatFileSize(uploadFile.file.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getStatusIcon(uploadFile.status)}
                        {getStatusBadge(uploadFile.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(uploadFile.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {uploadFile.status === "uploading" && <Progress value={uploadFile.progress} className="h-2" />}
                    {uploadFile.status === "error" && uploadFile.error && (
                      <p className="text-sm text-destructive mt-2">{uploadFile.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              // In a real app, this would trigger final processing
              setIsOpen(false)
              setUploadFiles([])
            }}
            disabled={uploadFiles.some((file) => file.status === "uploading")}
          >
            Process Contracts
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
