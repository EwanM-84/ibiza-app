"use client";

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Camera, CheckCircle, MapPin, AlertCircle, Upload } from 'lucide-react';

export default function MobilePhotoUpload() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [photos, setPhotos] = useState<number>(0);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [permissionsRequested, setPermissionsRequested] = useState(false);
  const [useNativeCamera, setUseNativeCamera] = useState(true); // Use native camera by default
  const [useFakeLocation, setUseFakeLocation] = useState(false); // For development
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detect if we're on local IP (development mode)
  const isDevelopment = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname.startsWith('192.168.')
  );

  // Scroll to top on mount and request location automatically
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Automatically request location on mount
    requestPermissions();
  }, []);

  // Request permissions function
  const requestPermissions = async () => {
    setPermissionsRequested(true);

    // Request location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          console.log('✓ Location obtained:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          if (error.code === 1) {
            setLocationError('Location permission denied. Please enable location in your browser settings.');
          } else if (error.code === 2) {
            setLocationError('Location unavailable. Please check your device settings.');
          } else {
            setLocationError('Location request timed out. Please try again.');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your device');
    }
  };

  const startCamera = async () => {
    try {
      console.log('📷 Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      console.log('✓ Camera access granted');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setCameraError(null);
      }
    } catch (err: any) {
      console.error('❌ Camera error:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission denied. Please allow camera access in your browser settings and refresh the page.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on your device.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Camera is already in use by another app. Please close other apps and try again.');
      } else {
        setCameraError(`Could not access camera: ${err.message}`);
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);

      // Get image data as base64
      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      setCurrentPhoto(photoData);

      // Stop camera
      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const useFakeLocationForDev = () => {
    // Use fake coordinates for development (Bogotá, Colombia)
    // Cast to any to avoid TypeScript strict interface checks for mock data
    const fakePosition = {
      coords: {
        latitude: 4.6097,
        longitude: -74.0817,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    } as GeolocationPosition;
    setLocation(fakePosition);
    setLocationError(null);
    setUseFakeLocation(true);
    console.log('✓ Using fake location for development:', fakePosition.coords.latitude, fakePosition.coords.longitude);
  };

  const uploadPhoto = async () => {
    if (!currentPhoto || !location) {
      alert('Photo and location are required');
      return;
    }

    setUploading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const response = await fetch('/api/photo-session/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          photo: currentPhoto,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPhotos(data.photoCount);
        setCurrentPhoto(null);
        setUploadSuccess(true);

        // Reset success message after 2 seconds
        setTimeout(() => setUploadSuccess(false), 2000);

        console.log('✓ Photo uploaded:', data.filename);
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const retakePhoto = () => {
    setCurrentPhoto(null);
    if (useNativeCamera && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      startCamera();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read the file as base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const photoData = event.target?.result as string;
      setCurrentPhoto(photoData);
    };
    reader.readAsDataURL(file);
  };

  const openNativeCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Show only completion screen when done
  if (photos >= 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-10">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">All Photos Uploaded!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your {photos} photos have been successfully uploaded with GPS verification.
            </p>
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
              <p className="text-green-800 font-semibold">
                ✓ You can now close this page and return to the computer to continue.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sptc-red-50 to-orange-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Photos</h1>
          <p className="text-gray-600">Take 2 photos of your property with GPS location</p>

          {/* Permission Status */}
          {permissionsRequested && !location && !locationError && (
            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <p className="text-blue-900 text-sm font-semibold">
                📍 Requesting location access...
              </p>
              <p className="text-blue-700 text-xs mt-1">
                Please allow location access when prompted by your browser
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-green-600" />
              {location ? (
                <span className="text-green-600 font-semibold">Location enabled</span>
              ) : locationError ? (
                <span className="text-red-600">{locationError}</span>
              ) : (
                <span className="text-gray-500">Getting location...</span>
              )}
            </div>

            <div className="flex items-center gap-2 bg-sptc-red-100 text-sptc-red-700 px-4 py-2 rounded-full font-bold">
              <CheckCircle className="w-5 h-5" />
              <span>{photos} / 2 photos</span>
            </div>
          </div>
        </div>

        {/* Location Error */}
        {locationError && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-1">Location Required</h3>
                <p className="text-red-700 text-sm mb-3">
                  Please enable location services in your browser settings to continue.
                  We need GPS coordinates to verify the property photos.
                </p>
                {isDevelopment && !useFakeLocation && (
                  <button
                    onClick={useFakeLocationForDev}
                    className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-xl hover:bg-yellow-700 transition-all text-sm"
                  >
                    Use Fake Location (Dev Only)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Fake Location Warning */}
        {useFakeLocation && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 mb-6">
            <p className="text-yellow-900 text-sm font-semibold">
              ⚠️ Development Mode: Using fake GPS coordinates (Bogotá, Colombia)
            </p>
          </div>
        )}

        {/* Camera View */}
        {!currentPhoto && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
            {useNativeCamera ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Camera className="w-20 h-20 text-sptc-red-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Take a Photo</h3>
                <p className="text-gray-600 text-center mb-6">
                  Take clear photos of your property from different angles
                </p>
                <button
                  onClick={openNativeCamera}
                  disabled={!location}
                  className="px-8 py-4 bg-sptc-red-600 text-white font-bold rounded-2xl hover:bg-sptc-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  <Camera className="w-6 h-6" />
                  Take Photo
                </button>

                {/* Hidden file input for native camera */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Option to use web camera instead */}
                <button
                  onClick={() => {
                    setUseNativeCamera(false);
                    startCamera();
                  }}
                  className="mt-4 text-sm text-gray-600 underline hover:text-gray-900"
                >
                  Use web camera instead
                </button>
              </div>
            ) : !cameraActive ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Camera className="w-20 h-20 text-sptc-red-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Take a Photo</h3>
                <p className="text-gray-600 text-center mb-6">
                  Take clear photos of your property from different angles
                </p>
                <button
                  onClick={startCamera}
                  disabled={!location}
                  className="px-8 py-4 bg-sptc-red-600 text-white font-bold rounded-2xl hover:bg-sptc-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Open Camera
                </button>
                {cameraError && (
                  <p className="text-red-600 text-sm mt-4">{cameraError}</p>
                )}

                {/* Option to use native camera instead */}
                <button
                  onClick={() => setUseNativeCamera(true)}
                  className="mt-4 text-sm text-gray-600 underline hover:text-gray-900"
                >
                  Use native camera instead
                </button>
              </div>
            ) : (
              <div>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-2xl mb-4"
                />
                <button
                  onClick={capturePhoto}
                  className="w-full py-4 bg-sptc-red-600 text-white font-bold rounded-2xl hover:bg-sptc-red-700 transition-all flex items-center justify-center gap-3"
                >
                  <Camera className="w-6 h-6" />
                  Capture Photo
                </button>
              </div>
            )}
          </div>
        )}

        {/* Photo Preview */}
        {currentPhoto && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Photo Preview</h3>
            <img
              src={currentPhoto}
              alt="Captured photo"
              className="w-full rounded-2xl mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={retakePhoto}
                className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all"
              >
                Retake
              </button>
              <button
                onClick={uploadPhoto}
                disabled={uploading || !location}
                className="flex-1 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Photo
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {uploadSuccess && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <p className="text-green-900 font-bold">Photo uploaded successfully!</p>
            </div>
          </div>
        )}

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
