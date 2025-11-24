import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { metamapData } = body;

    console.log('📝 Updating host profile with MetaMap data:', {
      userId: user.id,
      metamapData
    });

    // Update host_profiles with MetaMap verification data
    const updateData: any = {
      metamap_verification_id: metamapData.verificationId || metamapData.flowId,
      metamap_identity_status: metamapData.identityStatus || 'verified',
      metamap_selfie_status: metamapData.selfieStatus || 'verified',
      metamap_liveness_status: metamapData.livenessStatus || 'passed',
      metamap_verified_at: new Date().toISOString(),
      id_verified: true,
      face_verified: true,
      liveness_check_passed: true,
      verification_status: 'pending', // Still pending until admin reviews
    };

    // Add document data if available
    if (metamapData.documentData) {
      updateData.id_document_type = metamapData.documentData.type;
      updateData.id_document_number = metamapData.documentData.number;
      updateData.id_document_expiry = metamapData.documentData.expiry;
      updateData.id_verification_score = metamapData.documentData.score || 100;
    }

    // Add metadata if available
    if (metamapData.metadata) {
      updateData.metamap_metadata = metamapData.metadata;
    }

    // Add document data as JSON if available
    if (metamapData.documentData) {
      updateData.metamap_document_data = metamapData.documentData;
    }

    const { data, error } = await supabase
      .from('host_profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating host profile:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.log('✅ Host profile updated successfully:', data);

    return NextResponse.json({
      success: true,
      profile: data
    });

  } catch (error: any) {
    console.error('❌ Onboarding completion error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}
