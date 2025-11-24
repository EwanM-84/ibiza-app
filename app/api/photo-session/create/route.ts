import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { hostProfileId } = await request.json();

    // Generate unique session ID
    const sessionId = randomBytes(16).toString('hex');

    // Create session (expires in 1 hour)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Store session in Supabase for persistence across serverless invocations
    const { error } = await supabase
      .from('photo_sessions')
      .insert({
        session_id: sessionId,
        host_profile_id: hostProfileId || null,
        photos: [],
        expires_at: expiresAt.toISOString(),
      });

    if (error) {
      console.error('Error storing session in Supabase:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create session' },
        { status: 500 }
      );
    }

    console.log(`✓ Created photo session: ${sessionId}`);

    return NextResponse.json({
      success: true,
      sessionId,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Error creating photo session:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
