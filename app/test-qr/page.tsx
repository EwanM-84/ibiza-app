"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, MapPin, Camera, CheckCircle } from 'lucide-react';

export default function TestQRPage() {
  const [photoSessionId, setPhotoSessionId] = useState<string | null>(null);
  const [photoSessionUrl, setPhotoSessionUrl] = useState<string | null>(null);
  const [sessionPhotos, setSessionPhotos] = useState<any[]>([]);

  // Create photo session on mount
  useEffect(() => {
    createPhotoSession();
  }, []);

  // Poll for photos every 2 seconds
  useEffect(() => {
    if (photoSessionId) {
      const interval = setInterval(() => {
        fetchSessionPhotos();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [photoSessionId]);

  const createPhotoSession = async () => {
    try {
      const response = await fetch('/api/photo-session/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostProfileId: null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const sessionId = data.sessionId;
        setPhotoSessionId(sessionId);

        const baseUrl = window.location.origin;
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
      }
    } catch (error) {
      console.error('Error fetching session photos:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sptc-red-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">QR Code Photo Upload Test</h1>
          <p className="text-xl text-gray-600">Scan the QR code with your phone to test the photo upload system</p>
        </div>

        {photoSessionUrl && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* QR Code */}
              <div className="bg-gradient-to-br from-sptc-red-50 to-orange-50 p-8 rounded-2xl shadow-xl">
                <QRCodeSVG
                  value={photoSessionUrl}
                  size={300}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Instructions */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-sptc-red-600 rounded-full flex items-center justify-center">
                    <Smartphone className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Scan with your phone</h2>
                </div>

                <ol className="space-y-4 text-lg text-gray-700 mb-8">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-sptc-red-600 text-white font-bold rounded-full flex items-center justify-center">1</span>
                    <span>Open your phone's camera app</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-sptc-red-600 text-white font-bold rounded-full flex items-center justify-center">2</span>
                    <span>Point it at the QR code</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-sptc-red-600 text-white font-bold rounded-full flex items-center justify-center">3</span>
                    <span>Tap the link that appears</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-sptc-red-600 text-white font-bold rounded-full flex items-center justify-center">4</span>
                    <span>Take 5 photos (camera will open automatically)</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-sptc-red-600 text-white font-bold rounded-full flex items-center justify-center">5</span>
                    <span>Watch photos appear below in real-time!</span>
                  </li>
                </ol>

                <div className="bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white px-6 py-4 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Photos uploaded:</span>
                    <span className="text-4xl font-bold">{sessionPhotos.length} / 5</span>
                  </div>
                </div>

                {/* Direct Link (for easy access on phone) */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Or copy this link to your phone:</p>
                  <input
                    type="text"
                    value={photoSessionUrl}
                    readOnly
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Photo Grid */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Uploaded Photos</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4].map((index) => {
              const photo = sessionPhotos[index];

              return (
                <div key={index} className="border-3 border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50">
                  {photo ? (
                    <div className="space-y-4 animate-in fade-in duration-500">
                      <div className="relative rounded-xl overflow-hidden shadow-lg">
                        <img src={photo.data} alt={`Photo ${index + 1}`} className="w-full h-64 object-cover" />
                        <div className="absolute top-3 right-3 bg-green-500 rounded-full p-2 shadow-lg">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                          Photo {index + 1}
                        </div>
                      </div>
                      <div className="bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
                        <div className="flex items-start gap-2 text-green-700">
                          <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-bold mb-1">GPS Location:</p>
                            <p className="font-mono">
                              Lat: {photo.location.latitude.toFixed(6)}<br />
                              Lng: {photo.location.longitude.toFixed(6)}
                            </p>
                            <p className="text-green-600 mt-1">
                              Accuracy: ±{photo.location.accuracy.toFixed(1)}m
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        {new Date(photo.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 py-16">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        <Camera className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-700 mb-1">Photo {index + 1}</p>
                        <p className="text-sm text-gray-500">Waiting for upload...</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {sessionPhotos.length >= 5 && (
            <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-900 mb-2">All Photos Uploaded!</h3>
              <p className="text-green-700">The photo upload test is complete. All 5 photos have been received with GPS coordinates.</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex gap-4">
            <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-blue-900 mb-2">How GPS Verification Works</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Photos must be taken on a mobile device with GPS enabled</li>
                <li>✓ GPS coordinates are automatically captured from the device</li>
                <li>✓ Location accuracy shows how precise the GPS reading is</li>
                <li>✓ Photos sync to this page in real-time (updates every 2 seconds)</li>
                <li>✓ This ensures property photos are authentic and taken at the actual location</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
