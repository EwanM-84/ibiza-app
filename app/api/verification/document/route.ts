import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// NOTE: This is a template for document verification API
// You will need to integrate with a real verification service like:
// - Jumio (https://www.jumio.com/)
// - Onfido (https://onfido.com/)
// - Stripe Identity (https://stripe.com/identity)
// - Persona (https://withpersona.com/)

interface DocumentVerificationRequest {
  documentType: 'passport' | 'national_id' | 'driver_license';
  documentFrontImage: string; // base64
  documentBackImage?: string; // base64 (for IDs that have back)
  selfieImage: string; // base64 for liveness check
}

interface DocumentVerificationResponse {
  success: boolean;
  verificationId: string;
  documentVerified: boolean;
  faceMatch: boolean;
  livenessCheck: boolean;
  extractedData?: {
    fullName?: string;
    dateOfBirth?: string;
    documentNumber?: string;
    expiryDate?: string;
    nationality?: string;
  };
  confidenceScores: {
    document: number; // 0-100
    faceMatch: number; // 0-100
    liveness: number; // 0-100
  };
  warnings?: string[];
  error?: string;
}

/**
 * POST /api/verification/document
 * Verify identity documents with facial recognition
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: DocumentVerificationRequest = await request.json();

    // Validate request
    if (!body.documentFrontImage || !body.selfieImage || !body.documentType) {
      return NextResponse.json(
        { error: 'Missing required fields: documentType, documentFrontImage, selfieImage' },
        { status: 400 }
      );
    }

    // Get host profile
    const { data: hostProfile, error: profileError } = await supabase
      .from('host_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (profileError || !hostProfile) {
      return NextResponse.json(
        { error: 'Host profile not found' },
        { status: 404 }
      );
    }

    // Log verification attempt
    const attemptId = crypto.randomUUID();
    await supabase.from('verification_attempts').insert({
      id: attemptId,
      host_profile_id: hostProfile.id,
      verification_type: 'id_document',
      status: 'pending',
      provider_name: 'internal', // Change to actual provider when integrated
    });

    // ============================================================
    // INTEGRATE WITH REAL VERIFICATION SERVICE HERE
    // ============================================================
    // Example integration with Jumio:
    /*
    const jumioResponse = await fetch('https://api.jumio.com/api/v1/initiate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.JUMIO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerInternalReference: hostProfile.id,
        workflowDefinition: {
          key: 1, // ID verification workflow
          credentials: [{
            category: 'ID',
            type: {
              values: [body.documentType.toUpperCase()]
            },
            country: {
              values: ['COL', 'USA', 'MEX'] // Allowed countries
            }
          }]
        },
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/verification/callback`,
        userReference: session.user.id,
      })
    });

    const jumioData = await jumioResponse.json();
    */

    // ============================================================
    // MOCK RESPONSE FOR DEVELOPMENT
    // ============================================================
    // This simulates a successful verification
    // REMOVE THIS IN PRODUCTION and use real service above
    const mockResponse: DocumentVerificationResponse = {
      success: true,
      verificationId: attemptId,
      documentVerified: true,
      faceMatch: true,
      livenessCheck: true,
      extractedData: {
        fullName: session.user.user_metadata.first_name + ' ' + session.user.user_metadata.last_name,
        dateOfBirth: '1990-01-01',
        documentNumber: 'MOCK123456',
        expiryDate: '2030-12-31',
        nationality: 'Colombian',
      },
      confidenceScores: {
        document: 95.5,
        faceMatch: 98.2,
        liveness: 96.8,
      },
      warnings: [],
    };

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update verification attempt with results
    await supabase
      .from('verification_attempts')
      .update({
        status: mockResponse.success ? 'success' : 'failed',
        confidence_score: (mockResponse.confidenceScores.document +
                          mockResponse.confidenceScores.faceMatch +
                          mockResponse.confidenceScores.liveness) / 3,
        provider_response: mockResponse,
      })
      .eq('id', attemptId);

    // If successful, update host profile
    if (mockResponse.success && mockResponse.documentVerified && mockResponse.faceMatch) {
      await supabase
        .from('host_profiles')
        .update({
          id_verified: true,
          id_verification_score: mockResponse.confidenceScores.document,
          face_verified: true,
          face_verification_score: mockResponse.confidenceScores.faceMatch,
          liveness_check_passed: mockResponse.livenessCheck,
          id_document_type: body.documentType,
          id_document_number: mockResponse.extractedData?.documentNumber,
          id_document_expiry: mockResponse.extractedData?.expiryDate,
          verification_status: 'documents_submitted',
        })
        .eq('id', hostProfile.id);
    }

    return NextResponse.json(mockResponse);

  } catch (error: any) {
    console.error('Document verification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Verification service error',
        details: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/verification/document/status/:verificationId
 * Check status of a verification attempt
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const verificationId = searchParams.get('id');

    if (!verificationId) {
      return NextResponse.json(
        { error: 'Verification ID required' },
        { status: 400 }
      );
    }

    // Get verification attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('verification_attempts')
      .select('*, host_profiles!inner(user_id)')
      .eq('id', verificationId)
      .single();

    if (attemptError || !attempt) {
      return NextResponse.json(
        { error: 'Verification not found' },
        { status: 404 }
      );
    }

    // Check if user owns this verification
    if (attempt.host_profiles.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: attempt.id,
      status: attempt.status,
      verificationType: attempt.verification_type,
      confidenceScore: attempt.confidence_score,
      createdAt: attempt.created_at,
      providerResponse: attempt.provider_response,
    });

  } catch (error: any) {
    console.error('Get verification status error:', error);
    return NextResponse.json(
      { error: 'Failed to get verification status' },
      { status: 500 }
    );
  }
}
