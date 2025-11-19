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
    MatiButton?: any; // Legacy name
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

  // Load script manually using useEffect instead of Next.js Script component
  useEffect(() => {
    // Check if already loaded (prevents React strict mode double-loading)
    if ((window as any)._metamapLoaded) {
      console.log('✓ MetaMap SDK already loaded');
      setScriptLoaded(true);
      setIsLoading(false);
      return;
    }

    if ((window as any)._metamapLoading) {
      console.log('⏳ MetaMap SDK already loading...');
      // Wait for the other instance to finish loading
      const checkInterval = setInterval(() => {
        if ((window as any)._metamapLoaded) {
          clearInterval(checkInterval);
          setScriptLoaded(true);
          setIsLoading(false);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="metamap"]');
    if (existingScript) {
      console.log('✓ MetaMap script already in DOM');
      (window as any)._metamapLoaded = true;
      setScriptLoaded(true);
      setIsLoading(false);
      return;
    }

    // Mark as loading to prevent duplicate loads
    (window as any)._metamapLoading = true;

    console.log('Loading MetaMap SDK manually...');
    const script = document.createElement('script');
    script.src = 'https://web-button.metamap.com/button.js';
    script.async = true;

    script.onload = () => {
      console.log('✓ MetaMap SDK script loaded from CDN');

      // The custom elements need time to register, so we wait a bit
      setTimeout(() => {
        console.log('✓ MetaMap ready - custom elements registered');

        (window as any)._metamapLoaded = true;
        (window as any)._metamapLoading = false;
        setScriptLoaded(true);
        setIsLoading(false);
      }, 500); // Wait 500ms for custom elements to register
    };

    script.onerror = (e) => {
      console.error('✗ Failed to load MetaMap SDK script from CDN');
      console.error('Error:', e);
      (window as any)._metamapLoading = false;
      setError('Failed to load MetaMap SDK - please check your internet connection');
      setIsLoading(false);
      onError?.({ message: 'Failed to load MetaMap SDK' });
    };

    document.body.appendChild(script);

    // Don't cleanup on unmount - keep the script loaded
    return () => {
      (window as any)._metamapLoading = false;
    };
  }, [onError]);

  // Add timeout to prevent infinite loading, with manual check
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && !scriptLoaded) {
        // Manual check: maybe script loaded but callback didn't fire
        if (window.MetamapButton || (window as any).MatiButton) {
          console.log('⚠️ Script loaded but callback did not fire - manually setting loaded state');
          setScriptLoaded(true);
          setIsLoading(false);
        } else {
          console.error('⏱️ MetaMap SDK loading timeout - taking too long');
          console.error('window.MetamapButton:', window.MetamapButton);
          console.error('window.MatiButton:', (window as any).MatiButton);
          setError('MetaMap verification service is currently unavailable. This might be due to:\n• Network connectivity issues\n• MetaMap service downtime\n• Browser blocking the script\n\nPlease check your internet connection and try again.');
          setIsLoading(false);
        }
      }
    }, 15000); // 15 second timeout (increased from 10)

    return () => clearTimeout(timeout);
  }, [isLoading, scriptLoaded]);

  useEffect(() => {
    if (!scriptLoaded) {
      return;
    }

    // Check if custom element is registered
    const hasCustomElement = customElements.get('metamap-button');
    if (!hasCustomElement) {
      console.log('⏳ Waiting for custom element registration...');

      // Poll for custom element registration
      const pollInterval = setInterval(() => {
        if (customElements.get('metamap-button')) {
          console.log('✓ Custom element now registered, triggering initialization');
          clearInterval(pollInterval);

          // Force a re-render by updating state
          setScriptLoaded(false);
          setTimeout(() => setScriptLoaded(true), 10);
        }
      }, 100);

      // Cleanup interval after 5 seconds
      setTimeout(() => clearInterval(pollInterval), 5000);

      return () => clearInterval(pollInterval);
    }

    try {
      // Get the container
      const container = document.getElementById('metamap-button-container');
      if (!container) {
        console.error('Container #metamap-button-container not found');
        return;
      }

      // Check if already initialized to prevent duplicates
      if (container.querySelector('metamap-button')) {
        console.log('✓ MetaMap button already initialized');
        return;
      }

      console.log('✓ Initializing MetaMap verification');
      console.log('  Client ID:', clientId);
      console.log('  Flow ID:', flowId || 'default');

      // Clear any existing content
      container.innerHTML = '';

      // Create the metamap-button custom element
      const metamapButton = document.createElement('metamap-button');

      // Set attributes
      metamapButton.setAttribute('clientid', clientId);
      if (flowId) {
        metamapButton.setAttribute('flowid', flowId);
      }

      // Set metadata as JSON string
      const metadata = {
        platform: 'sptc_rural',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      };
      metamapButton.setAttribute('metadata', JSON.stringify(metadata));

      // Add event listeners for MetaMap events
      // CATCH ALL EVENTS - log everything
      const originalAddEventListener = metamapButton.addEventListener.bind(metamapButton);

      // Listen to ALL possible completion events
      const allEvents = [
        'finish',
        'complete',
        'verification-complete',
        'userFinishedSdk',
        'user-finished-sdk',
        'verification_completed',
        'mati:userFinishedSdk',
        'metamap:userFinishedSdk'
      ];

      allEvents.forEach(eventName => {
        metamapButton.addEventListener(eventName, (event: any) => {
          console.log(`🎯 MetaMap event fired: "${eventName}"`, event);
          console.log(`🎯 Event detail:`, event.detail);

          // Call onComplete for any completion event
          console.log('📞 Calling onComplete handler...');
          onComplete({
            verificationId: event.detail?.verificationId || event.detail?.identityId || 'completed',
            status: event.detail?.status || 'completed',
            identityStatus: event.detail?.identityStatus || 'verified',
            documentData: event.detail?.documentData,
            selfieStatus: event.detail?.selfieStatus || 'verified',
            livenessStatus: event.detail?.livenessStatus || 'verified',
            metadata: event.detail?.metadata,
            timestamp: new Date().toISOString(),
          });
          console.log('✅ onComplete handler called successfully');
        });
      });

      // NUCLEAR OPTION: Listen to literally ALL events on this element
      const eventTypes = [
        'abort', 'afterprint', 'animationend', 'animationiteration', 'animationstart',
        'beforeprint', 'beforeunload', 'blur', 'canplay', 'canplaythrough', 'change',
        'click', 'close', 'complete', 'contextmenu', 'cuechange', 'dblclick', 'drag',
        'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop',
        'durationchange', 'ended', 'error', 'finish', 'focus', 'focusin', 'focusout',
        'fullscreenchange', 'fullscreenerror', 'hashchange', 'input', 'invalid',
        'keydown', 'keypress', 'keyup', 'load', 'loadeddata', 'loadedmetadata',
        'loadstart', 'message', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove',
        'mouseout', 'mouseover', 'mouseup', 'offline', 'online', 'open', 'pagehide',
        'pageshow', 'pause', 'play', 'playing', 'popstate', 'progress', 'ratechange',
        'reset', 'resize', 'scroll', 'search', 'seeked', 'seeking', 'select', 'show',
        'stalled', 'storage', 'submit', 'success', 'suspend', 'timeupdate', 'toggle',
        'touchcancel', 'touchend', 'touchmove', 'touchstart', 'transitionend',
        'unload', 'volumechange', 'waiting', 'wheel'
      ];

      eventTypes.forEach(eventType => {
        metamapButton.addEventListener(eventType, (event: any) => {
          if (eventType.includes('mouse') || eventType.includes('focus') || eventType.includes('blur')) {
            return; // Skip noisy events
          }
          console.log(`📡 Caught event: ${eventType}`, event);
        });
      });

      metamapButton.addEventListener('error', (event: any) => {
        console.error('✗ MetaMap verification error:');
        console.error('Error event:', event);
        console.error('Error detail:', event.detail);
        console.error('Error type:', event.type);

        const errorMessage = event.detail?.message || event.detail?.error || 'Verification failed';
        console.error('Error message:', errorMessage);

        setError(`MetaMap Error: ${errorMessage}\n\nThis may be due to:\n• Invalid or test client ID\n• MetaMap service issues\n• Network connectivity\n• Account not properly configured`);
        onError?.(event.detail);
      });

      metamapButton.addEventListener('close', () => {
        console.log('🚪 MetaMap verification closed by user');
      });

      // Listen for all events to debug
      metamapButton.addEventListener('loaded', () => {
        console.log('✓ MetaMap iframe loaded successfully');
      });

      metamapButton.addEventListener('userStartedSdk', () => {
        console.log('✓ User started MetaMap SDK');
      });

      // Append to container
      container.appendChild(metamapButton);
      console.log('✓ MetaMap button element added to DOM');

    } catch (err: any) {
      console.error('✗ MetaMap initialization error:', err);
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
    <>
      {/* MetaMap SDK is loaded via useEffect above */}
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
    </>
  );
}
