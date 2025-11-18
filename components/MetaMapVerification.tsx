"use client";

import { useEffect, useState } from 'react';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface MetaMapVerificationProps {
  onComplete: (verificationData: any) => void;
  onError?: (error: any) => void;
  flowId?: string; // Optional custom flow ID
}

// Extend Window interface to include MetaMap
declare global {
  interface Window {
    MetamapButton?: any;
  }
}

export default function MetaMapVerification({
  onComplete,
  onError,
  flowId
}: MetaMapVerificationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_METAMAP_CLIENT_ID || '691cb738ee8edbd7fd224757';

  useEffect(() => {
    // Client ID is hardcoded for free tier testing
    // if (!clientId) {
    //   setError('MetaMap Client ID not configured');
    //   setIsLoading(false);
    //   return;
    // }

    // Load MetaMap SDK script
    const script = document.createElement('script');
    script.src = 'https://cdn.metamap.com/sdk/v2.0/metamap.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
      setIsLoading(false);
    };
    script.onerror = () => {
      setError('Failed to load MetaMap SDK');
      setIsLoading(false);
      onError?.({ message: 'Failed to load MetaMap SDK' });
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [clientId, onError]);

  useEffect(() => {
    if (!scriptLoaded || !window.MetamapButton) return;

    try {
      // Initialize MetaMap button
      const metamapButton = new window.MetamapButton({
        clientId: clientId,
        flowId: flowId, // Optional: specific verification flow

        // Metadata to associate with this verification
        metadata: {
          platform: 'sptc_rural',
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
        },

        // Configuration
        config: {
          // Language preference
          language: 'es', // Spanish for Colombia

          // Supported document types for Colombia
          documentTypes: [
            'national-id', // Cédula de Ciudadanía
            'passport',
            'driver-license'
          ],

          // Enable face recognition
          selfie: true,

          // Enable liveness detection
          liveness: true,

          // Theme customization
          theme: {
            primaryColor: '#DC2626', // sptc-red-600
            secondaryColor: '#B91C1C',
            backgroundColor: '#FFFFFF',
            textColor: '#111827',
          }
        },

        // Callback when verification is complete
        onFinish: (data: any) => {
          console.log('MetaMap verification complete:', data);
          onComplete({
            verificationId: data.verificationId,
            status: data.status,
            identityStatus: data.identityStatus,
            documentData: data.documentData,
            selfieStatus: data.selfieStatus,
            livenessStatus: data.livenessStatus,
            metadata: data.metadata,
            timestamp: new Date().toISOString(),
          });
        },

        // Callback on error
        onError: (errorData: any) => {
          console.error('MetaMap verification error:', errorData);
          setError(errorData.message || 'Verification failed');
          onError?.(errorData);
        },

        // Callback when user exits
        onClose: () => {
          console.log('MetaMap verification closed by user');
        },

        // Callback for step changes
        onStepChange: (step: any) => {
          console.log('MetaMap step changed:', step);
        },
      });

      // Mount the button in container
      const container = document.getElementById('metamap-button-container');
      if (container) {
        metamapButton.mount('#metamap-button-container');
      }

    } catch (err: any) {
      console.error('MetaMap initialization error:', err);
      setError(err.message || 'Failed to initialize verification');
      onError?.(err);
    }
  }, [scriptLoaded, clientId, flowId, onComplete, onError]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 border-4 border-sptc-red-600 border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-lg font-semibold text-gray-700">Loading verification...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your identity verification</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Verification Error</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!clientId) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-yellow-900 mb-2">Configuration Required</h3>
            <p className="text-yellow-700">
              MetaMap Client ID is not configured. Please add NEXT_PUBLIC_METAMAP_CLIENT_ID to your environment variables.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex gap-4">
          <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Secure Identity Verification</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Upload your government-issued ID (Cédula, Passport, or Driver's License)</li>
              <li>✓ Take a selfie for face verification</li>
              <li>✓ Liveness detection to prevent fraud</li>
              <li>✓ Bank-level encryption for your data</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MetaMap Button Container */}
      <div
        id="metamap-button-container"
        className="flex justify-center"
        style={{ minHeight: '60px' }}
      />

      {/* Trust Indicators */}
      <div className="flex items-center justify-center gap-6 text-sm text-gray-500 pt-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>256-bit encryption</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>GDPR compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Colombia approved</span>
        </div>
      </div>

      {/* What happens next */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <h4 className="font-bold text-gray-900 mb-3">What happens next?</h4>
        <ol className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-3">
            <span className="font-bold text-sptc-red-600">1.</span>
            <span>Click "Start Verification" and follow the prompts</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-sptc-red-600">2.</span>
            <span>Upload a clear photo of your ID document</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-sptc-red-600">3.</span>
            <span>Take a selfie (liveness check will be performed)</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-sptc-red-600">4.</span>
            <span>Verification typically completes in 2-3 minutes</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-sptc-red-600">5.</span>
            <span>You'll be notified once your identity is verified</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
