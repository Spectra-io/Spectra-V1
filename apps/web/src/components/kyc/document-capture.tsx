'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DocumentCaptureProps {
  onComplete: (data: { documentImage: string }) => void;
}

export function DocumentCapture({ onComplete }: DocumentCaptureProps) {
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1920, height: 1080 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to file upload
      fileInputRef.current?.click();
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);

      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setDocumentImage(imageData);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCapturing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setDocumentImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetCapture = () => {
    setDocumentImage(null);
    stopCamera();
  };

  const confirmDocument = () => {
    if (documentImage) {
      onComplete({ documentImage });
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Upload Your ID Document</h3>
        <p className="text-gray-600">
          Take a photo of your passport, driver&apos;s license, or national ID
        </p>
      </div>

      {!documentImage && !isCapturing && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Choose how to add your document</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={startCamera} className="bg-primary-500 hover:bg-primary-600">
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {isCapturing && (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
            style={{ transform: 'scaleX(-1)' }}
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <Button
              onClick={capturePhoto}
              className="bg-primary-500 hover:bg-primary-600 rounded-full w-16 h-16"
            >
              <Camera className="w-6 h-6" />
            </Button>
            <Button
              onClick={stopCamera}
              variant="outline"
              className="bg-white rounded-full w-16 h-16"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}

      {documentImage && (
        <div className="space-y-4">
          <div className="relative">
            <img src={documentImage} alt="Document" className="w-full rounded-lg" />
            <Button
              onClick={resetCapture}
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 bg-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-3">
            <Button onClick={resetCapture} variant="outline" className="flex-1">
              Retake
            </Button>
            <Button
              onClick={confirmDocument}
              className="flex-1 bg-primary-500 hover:bg-primary-600"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Tips for best results:</strong>
        </p>
        <ul className="text-sm text-blue-600 mt-2 space-y-1">
          <li>• Ensure good lighting</li>
          <li>• Avoid glare and shadows</li>
          <li>• Include all four corners</li>
          <li>• Make sure text is readable</li>
        </ul>
      </div>
    </Card>
  );
}
