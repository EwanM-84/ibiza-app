import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    console.log('🔐 Auth check result:', {
      hasUser: !!user,
      userId: user?.id,
      authError: authError?.message
    });

    if (authError || !user) {
      console.error('❌ Not authenticated:', authError);
      return NextResponse.json(
        { error: 'Not authenticated. Please log in again.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { metamapData } = body;

    console.log('📝 Updating host profile with MetaMap data:', {
      userId: user.id,
      metamapData
    });

    // First, verify the host_profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('host_profiles')
      .select('id, user_id')
      .eq('user_id', user.id)
      .single();

    console.log('📋 Existing profile check:', {
      found: !!existingProfile,
      profileId: existingProfile?.id,
      fetchError: fetchError?.message
    });

    if (fetchError || !existingProfile) {
      console.error('❌ Host profile not found for user:', user.id);
      return NextResponse.json(
        { error: 'Host profile not found. Please complete registration first.' },
        { status: 404 }
      );
    }

    // Update host_profiles with MetaMap verification data
    // AUTO-APPROVE when MetaMap verification is complete (no manual review needed)
    const updateData: any = {
      metamap_verification_id: metamapData.verificationId || metamapData.flowId || 'unknown',
      metamap_identity_status: metamapData.identityStatus || 'verified',
      metamap_selfie_status: metamapData.selfieStatus || 'verified',
      metamap_liveness_status: metamapData.livenessStatus || 'passed',
      metamap_verified_at: new Date().toISOString(),
      id_verified: true,
      face_verified: true,
      liveness_check_passed: true,
      verification_status: 'approved', // AUTO-APPROVE when MetaMap verification completes
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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

    console.log('📤 Update data to be sent:', JSON.stringify(updateData, null, 2));

    const { data, error } = await supabase
      .from('host_profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating host profile:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: 400 }
      );
    }

    console.log('✅ Host profile updated successfully:', {
      profileId: data?.id,
      id_verified: data?.id_verified,
      face_verified: data?.face_verified,
      metamap_verification_id: data?.metamap_verification_id
    });

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
