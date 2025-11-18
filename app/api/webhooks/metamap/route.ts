import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

/**
 * POST /api/webhooks/metamap
 * Handle MetaMap verification webhooks
 *
 * MetaMap sends webhooks when verification status changes.
 * This endpoint processes those webhooks and updates the database.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();

    // Verify webhook signature (only in production with API key)
    const signature = request.headers.get('x-webhook-signature');
    if (process.env.METAMAP_WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.METAMAP_WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('Invalid MetaMap webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    console.log('⚠️  Running in FREE TIER mode - webhook signature verification disabled');
    console.log('   Add METAMAP_WEBHOOK_SECRET to enable signature verification');

    console.log('MetaMap webhook received:', {
      eventName: body.eventName,
      status: body.resource?.status,
      verificationId: body.resource?.id,
    });

    // Extract verification data from webhook
    const {
      eventName,
      resource: verification
    } = body;

    if (!verification || !verification.id) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    const verificationId = verification.id;
    const status = verification.status; // started, pending, completed, reviewNeeded, rejected
    const identityStatus = verification.identityStatus; // verified, unverified
    const documentVerification = verification.documentVerification;
    const selfie = verification.selfie;

    // Find host profile by metadata (we should include host_profile_id in metadata)
    const hostProfileId = verification.metadata?.host_profile_id;

    if (!hostProfileId) {
      console.error('No host_profile_id in MetaMap metadata');
      return NextResponse.json(
        { error: 'Missing host_profile_id in metadata' },
        { status: 400 }
      );
    }

    // Log verification attempt
    await supabase.from('verification_attempts').insert({
      host_profile_id: hostProfileId,
      verification_type: 'metamap_identity',
      status: status === 'completed' ? 'success' : status === 'rejected' ? 'failed' : 'pending',
      confidence_score: identityStatus === 'verified' ? 95.0 : 0,
      provider_name: 'metamap',
      provider_transaction_id: verificationId,
      provider_response: body,
    });

    // Update host profile if verification is complete
    if (status === 'completed' && identityStatus === 'verified') {
      // Extract document data
      const documentData = documentVerification?.fields || {};

      await supabase
        .from('host_profiles')
        .update({
          // Identity verification
          id_verified: true,
          id_verification_score: 95.0,
          id_document_type: documentData.documentType || 'unknown',
          id_document_number: documentData.documentNumber,
          id_document_expiry: documentData.expiryDate,

          // Face verification
          face_verified: selfie?.liveness === 'live',
          face_verification_score: selfie?.liveness === 'live' ? 98.0 : 0,
          liveness_check_passed: selfie?.liveness === 'live',

          // Update verification status
          verification_status: 'documents_submitted',

          updated_at: new Date().toISOString(),
        })
        .eq('id', hostProfileId);

      console.log(`Host profile ${hostProfileId} updated with MetaMap verification`);

      // TODO: Send notification email to host
      // TODO: Notify admin for manual review if needed

    } else if (status === 'rejected') {
      // Handle rejection
      await supabase
        .from('host_profiles')
        .update({
          verification_status: 'rejected',
          verification_notes: `MetaMap verification rejected: ${verification.rejectReasons?.join(', ')}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', hostProfileId);

      console.log(`Host profile ${hostProfileId} verification rejected`);

      // TODO: Send rejection notification email
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      verificationId: verificationId,
      status: status,
    });

  } catch (error: any) {
    console.error('MetaMap webhook error:', error);
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/metamap
 * Webhook verification endpoint (for MetaMap to verify the webhook URL)
 */
export async function GET(request: NextRequest) {
  // Return success for webhook URL verification
  return NextResponse.json({
    status: 'ok',
    message: 'MetaMap webhook endpoint active'
  });
}
