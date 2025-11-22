'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, Check, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SelfieCaptureProps {
  onComplete: (data: { selfieImage: string }) => void;
}

export function SelfieCapture({ onComplete }: SelfieCaptureProps) {
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1920, height: 1080 },
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
      setSelfieImage(imageData);
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
        setSelfieImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetCapture = () => {
    setSelfieImage(null);
    stopCamera();
  };

  const confirmSelfie = () => {
    if (selfieImage) {
      onComplete({ selfieImage });
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Take a Selfie</h3>
        <p className="text-gray-600">
          We need to verify that you match the document you provided
        </p>
      </div>

      {!selfieImage && !isCapturing && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-primary-500" />
            </div>
            <p className="text-gray-600 mb-4">Take a clear photo of your face</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={startCamera} className="bg-primary-500 hover:bg-primary-600">
                <Camera className="w-4 h-4 mr-2" />
                Take Selfie
              </Button>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="user"
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
          {/* Face guide overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-80 border-4 border-primary-500 rounded-full opacity-50"></div>
          </div>
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

      {selfieImage && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={selfieImage}
              alt="Selfie"
              className="w-full rounded-lg"
              style={{ transform: 'scaleX(-1)' }}
            />
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
            <Button onClick={confirmSelfie} className="flex-1 bg-primary-500 hover:bg-primary-600">
              <Check className="w-4 h-4 mr-2" />
              Confirm
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-700">
          <strong>Selfie requirements:</strong>
        </p>
        <ul className="text-sm text-purple-600 mt-2 space-y-1">
          <li>• Face the camera directly</li>
          <li>• Remove glasses and hats</li>
          <li>• Ensure your face is well-lit</li>
          <li>• Keep a neutral expression</li>
        </ul>
      </div>
    </Card>
  );
}
