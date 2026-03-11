"use client";

import { useState, useRef, useEffect } from "react";

export default function ImageUploader({ onImageSelected }: { onImageSelected: (file: File | null) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Bind the camera stream to the video element once it mounts
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(console.error);
    }
  }, [isCameraActive]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: false
      });
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Unable to access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw the current video frame to the canvas
        // flip horizontally to mirror the user like a normal selfie cam
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            handleFileChange(file);
            setIsCameraActive(false);
            stopCamera();
          }
        }, "image/jpeg", 0.9);
      }
    }
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onImageSelected(file);
    } else {
      setPreview(null);
      onImageSelected(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isCameraActive && !preview) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isCameraActive && !preview && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[2rem] transition-all duration-300 ease-in-out overflow-hidden group
          ${isDragOver ? "border-indigo-500 bg-indigo-50/80 dark:bg-indigo-900/30 scale-[1.02]" : "border-slate-300 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30"}
          ${(!preview && !isCameraActive) ? "cursor-pointer hover:border-indigo-400 hover:bg-white/80 dark:hover:bg-slate-800/80 shadow-sm hover:shadow-md" : ""}
          ${(preview || isCameraActive) ? "border-transparent bg-transparent hover:bg-transparent dark:hover:bg-transparent p-0 shadow-lg" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!preview && !isCameraActive) {
            fileInputRef.current?.click();
          }
        }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            handleFileChange(file);
          }}
        />
        
        {isCameraActive ? (
          <div className="relative w-full flex flex-col justify-center items-center h-[400px] rounded-[2rem] overflow-hidden bg-black animate-in fade-in zoom-in-95 duration-300">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100" 
            />
            <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 px-4 z-10">
              <button 
                type="button"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  stopCamera(); 
                  setIsCameraActive(false); 
                }}
                className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white px-5 py-3 rounded-full font-semibold text-sm transition-all"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  capturePhoto(); 
                }}
                className="bg-white text-slate-900 w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_0_4px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
                title="Capture Photo"
              >
                <div className="w-12 h-12 rounded-full border-2 border-slate-900"></div>
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        ) : preview ? (
          <div className="relative group w-full flex justify-center h-[400px] rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-900/50">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileChange(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="bg-white/95 text-slate-900 px-6 py-3 rounded-full font-semibold text-sm shadow-2xl hover:bg-white transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove Photo
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 py-6 w-full">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            
            <div className="space-y-1">
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                Upload a Photo
              </p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Drag & drop or click to browse
              </p>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">OR</span>
            </div>

            <div className="flex items-center justify-center mt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startCamera();
                }}
                className="relative z-10 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-full text-sm font-semibold transition-transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Use Camera
              </button>
            </div>
            
            {cameraError && (
              <div className="mt-4 animate-in slide-in-from-bottom-2 fade-in bg-red-50 text-red-600 text-xs font-medium p-3 rounded-xl border border-red-100">
                {cameraError}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
