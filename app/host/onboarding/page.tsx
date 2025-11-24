"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/lib/text";
import {
  Upload, Camera, CheckCircle, AlertCircle, MapPin,
  Shield, FileCheck, Home as HomeIcon, ArrowRight, ArrowLeft, Smartphone
} from "lucide-react";
import { useRouter } from "next/navigation";
import MetaMapVerification from "@/components/MetaMapVerification";
import { QRCodeSVG } from 'qrcode.react';

export default function HostOnboarding() {
  const { language } = useLanguage();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [facePhoto, setFacePhoto] = useState<string | null>(null);
  const [propertyPhotos, setPropertyPhotos] = useState<Array<{file: File, location: GeolocationCoordinates | null}>>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // MetaMap verification state
  const [metamapVerified, setMetamapVerified] = useState(false);
  const [metamapData, setMetamapData] = useState<any>(null);

  // Photo session state
  const [photoSessionId, setPhotoSessionId] = useState<string | null>(null);
  const [photoSessionUrl, setPhotoSessionUrl] = useState<string | null>(null);
  const [sessionPhotos, setSessionPhotos] = useState<any[]>([]);

  const handleIDUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdDocument(e.target.files[0]);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please enable camera permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setFacePhoto(canvas.toDataURL("image/jpeg"));
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setCameraActive(false);
      }
    }
  };

  const handlePropertyPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Get geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newPhotos = [...propertyPhotos];
            newPhotos[index] = { file, location: position.coords };
            setPropertyPhotos(newPhotos);
          },
          (error) => {
            console.error("Error getting location:", error);
            alert(getText("hostOnboarding.locationRequired", language));
          }
        );
      } else {
        alert(getText("hostOnboarding.locationRequired", language));
      }
    }
  };

  const handleMetaMapComplete = (verificationData: any) => {
    console.log('MetaMap verification complete:', verificationData);
    setMetamapVerified(true);
    setMetamapData(verificationData);
    // Automatically set as verified
    setIdDocument({ name: 'MetaMap Verified ID' } as any);
    setFacePhoto('metamap-verified');
  };

  const handleMetaMapError = (error: any) => {
    console.error('MetaMap verification error:', error);
    alert('Verification failed. Please try again or contact support.');
  };

  // Create photo session when entering Step 2
  useEffect(() => {
    if (currentStep === 2 && !photoSessionId) {
      createPhotoSession();
    }
  }, [currentStep]);

  // Poll for photos every 2 seconds when on Step 2
  useEffect(() => {
    if (currentStep === 2 && photoSessionId) {
      const interval = setInterval(() => {
        fetchSessionPhotos();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [currentStep, photoSessionId]);

  const createPhotoSession = async () => {
    try {
      const response = await fetch('/api/photo-session/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostProfileId: null, // We'll add this later when we have auth
        }),
      });

      const data = await response.json();

      if (data.success) {
        const sessionId = data.sessionId;
        setPhotoSessionId(sessionId);

        // Create URL for mobile upload
        // Use local network IP if on localhost for mobile access
        let baseUrl = window.location.origin;
        if (baseUrl.includes('localhost')) {
          // Replace localhost with local IP for mobile access
          // This allows QR code to work on phones in the same network
          baseUrl = baseUrl.replace('localhost', '192.168.1.133');
        }
        const url = `${baseUrl}/mobile-upload/${sessionId}`;
        setPhotoSessionUrl(url);

        console.log('✓ Photo session created:', sessionId);
        console.log('📱 Mobile URL:', url);
      }
    } catch (error) {
      console.error('Error creating photo session:', error);
    }
  };

  const fetchSessionPhotos = async () => {
    if (!photoSessionId) return;

    try {
      const response = await fetch(`/api/photo-session/${photoSessionId}`);
      const data = await response.json();

      if (data.success) {
        setSessionPhotos(data.photos);

        // Update propertyPhotos state for compatibility
        const updatedPhotos = data.photos.map((photo: any) => ({
          file: { name: photo.filename } as File,
          location: {
            latitude: photo.location.latitude,
            longitude: photo.location.longitude,
            accuracy: photo.location.accuracy,
          } as GeolocationCoordinates,
          data: photo.data,
        }));

        setPropertyPhotos(updatedPhotos);
      }
    } catch (error) {
      console.error('Error fetching session photos:', error);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Save MetaMap verification data to database
      if (metamapData) {
        console.log('💾 Saving MetaMap verification data...');
        const response = await fetch('/api/host/onboarding/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metamapData
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to save verification data');
        }

        console.log('✅ MetaMap verification data saved successfully');
      }

      setIsSubmitting(false);
      setSubmitted(true);
    } catch (error: any) {
      console.error('❌ Error submitting onboarding:', error);
      alert('Failed to complete onboarding: ' + error.message);
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Identity Verification", subtitle: "Verify with MetaMap", icon: Shield },
    { number: 2, title: getText("hostOnboarding.step3Title", language), subtitle: getText("hostOnboarding.step3Subtitle", language), icon: HomeIcon },
    { number: 3, title: getText("hostOnboarding.step4Title", language), subtitle: getText("hostOnboarding.step4Subtitle", language), icon: CheckCircle },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
            <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {getText("hostOnboarding.successTitle", language)}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto">
            {getText("hostOnboarding.successMessage", language)}
          </p>
          <button
            onClick={() => router.push("/host/dashboard")}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold text-lg px-12 py-5 rounded-2xl hover:from-sptc-red-700 hover:to-sptc-red-800 transition-all shadow-2xl transform hover:scale-105"
          >
            {getText("hostOnboarding.goToDashboard", language)}
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {getText("hostOnboarding.welcome", language)}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            {getText("hostOnboarding.welcomeSubtitle", language)}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-16">
          <div className="flex items-center justify-between max-w-4xl mx-auto relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex-1 relative z-10">
                  <div className="flex flex-col items-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                      isCompleted ? "bg-gradient-to-br from-green-500 to-green-600 shadow-2xl" : isActive ? "bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 shadow-2xl scale-110" : "bg-gray-200"
                    }`}>
                      <Icon className="w-10 h-10 text-white" strokeWidth={isActive ? 3 : 2} />
                    </div>
                    <div className="text-center hidden md:block max-w-[140px]">
                      <div className={`text-sm font-bold mb-1 ${isActive || isCompleted ? "text-gray-900" : "text-gray-500"}`}>
                        {step.title}
                      </div>
                      <div className={`text-xs ${isActive ? "text-gray-600" : "text-gray-400"}`}>
                        {step.subtitle}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute top-10 left-[60%] w-[80%] h-2 -z-10">
                      <div className={`h-full rounded-full ${isCompleted ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gray-200"} transition-all duration-500`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          {/* Step 1: MetaMap Identity Verification */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: '"DM Serif Display", serif' }}>
                  Identity Verification
                </h2>
                <p className="text-lg text-gray-600">
                  Verify your identity with MetaMap - fast, secure, and designed for Colombia
                </p>
              </div>

              {metamapVerified ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex flex-col items-center gap-4 py-12">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-xl">
                      <CheckCircle className="w-14 h-14 text-white" strokeWidth={3} />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Verification Complete!</h3>
                    <p className="text-lg text-gray-600 max-w-md text-center">
                      Your identity has been successfully verified. You can now proceed to the next step.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                    <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Verification Details
                    </h4>
                    <div className="space-y-2 text-sm text-green-800">
                      <div className="flex items-center justify-between">
                        <span>Verification ID:</span>
                        <span className="font-mono font-semibold">{metamapData?.verificationId?.substring(0, 12)}...</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <span className="font-semibold capitalize">{metamapData?.status || 'Verified'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Identity Status:</span>
                        <span className="font-semibold capitalize">{metamapData?.identityStatus || 'Verified'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Selfie Status:</span>
                        <span className="font-semibold capitalize">{metamapData?.selfieStatus || 'Verified'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <MetaMapVerification
                  onComplete={handleMetaMapComplete}
                  onError={handleMetaMapError}
                />
              )}
            </div>
          )}

          {/* Step 2: Property Photos with QR Code */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: '"DM Serif Display", serif' }}>
                  {getText("hostOnboarding.propertyPhotos", language)}
                </h2>
                <p className="text-lg text-gray-600">Scan the QR code with your mobile phone to take photos with GPS location</p>
              </div>

              {/* QR Code Section */}
              {photoSessionUrl && (
                <div className="bg-gradient-to-br from-sptc-red-50 to-orange-50 border-2 border-sptc-red-200 rounded-3xl p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* QR Code */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl">
                      <QRCodeSVG
                        value={photoSessionUrl}
                        size={256}
                        level="H"
                        includeMargin={true}
                      />
                    </div>

                    {/* Instructions */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-sptc-red-600 rounded-full flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Scan with your phone</h3>
                      </div>

                      <ol className="space-y-3 text-gray-700">
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-sptc-red-600 text-white font-bold rounded-full flex items-center justify-center text-sm">1</span>
                          <span>Open your phone's camera app</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-sptc-red-600 text-white font-bold rounded-full flex items-center justify-center text-sm">2</span>
                          <span>Point it at the QR code above</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-sptc-red-600 text-white font-bold rounded-full flex items-center justify-center text-sm">3</span>
                          <span>Tap the link that appears</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-sptc-red-600 text-white font-bold rounded-full flex items-center justify-center text-sm">4</span>
                          <span>Take 2 photos of your property</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-sptc-red-600 text-white font-bold rounded-full flex items-center justify-center text-sm">5</span>
                          <span>Photos will appear here automatically</span>
                        </li>
                      </ol>

                      <div className="mt-6 flex items-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-xl">
                        <span className="text-sm text-gray-600 font-semibold">Photos uploaded:</span>
                        <span className="text-2xl font-bold text-sptc-red-600">{sessionPhotos.length} / 2</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Photo Grid - Shows photos as they're uploaded */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[0, 1, 2, 3, 4].map((index) => {
                  const photo = sessionPhotos[index];

                  return (
                    <div key={index} className="border-3 border-dashed border-gray-300 rounded-2xl p-6 bg-white">
                      {photo ? (
                        <div className="space-y-4 animate-in fade-in duration-500">
                          <div className="relative rounded-xl overflow-hidden shadow-lg">
                            <img src={photo.data} alt={`Property ${index + 1}`} className="w-full h-48 object-cover" />
                            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-2 shadow-lg">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg text-sm font-medium">
                            <MapPin className="w-4 h-4" />
                            <span>GPS: {photo.location.latitude.toFixed(5)}, {photo.location.longitude.toFixed(5)}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4 py-12 opacity-40">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Camera className="w-9 h-9 text-gray-400" />
                          </div>
                          <div className="text-center">
                            <p className="text-base font-bold text-gray-700 mb-1">Photo {index + 1}</p>
                            <p className="text-xs text-gray-500">Waiting for upload...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex gap-4">
                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Automatic GPS verification</h4>
                  <p className="text-sm text-blue-800">Photos taken on your mobile phone automatically include GPS coordinates, proving the property location is authentic.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: '"DM Serif Display", serif' }}>
                  {getText("hostOnboarding.reviewInfo", language)}
                </h2>
                <p className="text-lg text-gray-600">{getText("hostOnboarding.step4Subtitle", language)}</p>
              </div>

              <div className="space-y-6">
                {/* Personal Details */}
                <div className="border-2 border-gray-200 rounded-3xl p-8 hover:border-sptc-red-300 transition-all">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    {getText("hostOnboarding.personalDetails", language)}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600 font-medium">ID Document:</span>
                      <span className="font-bold text-gray-900 flex items-center gap-2">
                        {idDocument?.name}
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600 font-medium">{getText("hostOnboarding.faceVerification", language)}:</span>
                      <span className="font-bold text-green-600 flex items-center gap-2">
                        {getText("hostOnboarding.verified", language)}
                        <CheckCircle className="w-6 h-6" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="border-2 border-gray-200 rounded-3xl p-8 hover:border-sptc-red-300 transition-all">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <HomeIcon className="w-7 h-7 text-white" />
                    </div>
                    {getText("hostOnboarding.propertyDetails", language)}
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600 font-medium">Photos:</span>
                      <span className="font-bold text-gray-900">
                        {sessionPhotos.length} {getText("hostOnboarding.photosUploaded", language)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600 font-medium">Location:</span>
                      <span className="font-bold text-green-600 flex items-center gap-2">
                        {getText("hostOnboarding.locationVerified", language)}
                        <MapPin className="w-6 h-6" />
                      </span>
                    </div>
                  </div>
                  {sessionPhotos.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {sessionPhotos.map((photo, index) => (
                        <div key={photo.id} className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                          <img src={photo.photo_url} alt={`Property ${index + 1}`} className="w-full h-32 object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            GPS Verified
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t-2 border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold text-lg rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
            >
              <ArrowLeft className="w-6 h-6" />
              {getText("hostOnboarding.back", language)}
            </button>

            {currentStep < 3 ? (
              <button
                onClick={() => {
                  if (currentStep === 1 && !metamapVerified) {
                    alert("Please complete your identity verification with MetaMap");
                    return;
                  }
                  if (currentStep === 2 && sessionPhotos.length < 2) {
                    alert("Please upload 2 photos of your property");
                    return;
                  }
                  setCurrentStep(currentStep + 1);
                }}
                disabled={currentStep === 1 && !metamapVerified}
                className={`flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold text-lg rounded-2xl hover:from-sptc-red-700 hover:to-sptc-red-800 transition-all shadow-2xl transform hover:scale-105 ${
                  currentStep === 1 && !metamapVerified ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
                }`}
              >
                {getText("hostOnboarding.continue", language)}
                <ArrowRight className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg rounded-2xl hover:from-green-700 hover:to-green-800 transition-all shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-green-600 disabled:hover:to-green-700"
              >
                {isSubmitting ? getText("hostOnboarding.submitting", language) : getText("hostOnboarding.submit", language)}
                {!isSubmitting && <CheckCircle className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>Bank-level security</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Verified hosts only</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>Location verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
