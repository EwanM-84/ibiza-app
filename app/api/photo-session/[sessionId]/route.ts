import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    console.log('📷 GET /api/photo-session/' + sessionId);

    // Get session from Supabase
    const { data: session, error } = await supabase
      .from('photo_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      console.error('📷 Supabase error:', error.message, error.code);
      return NextResponse.json(
        { success: false, error: 'Session not found: ' + error.message },
        { status: 404 }
      );
    }

    if (!session) {
      console.error('📷 No session found for:', sessionId);
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    const photoCount = (session.photos || []).length;
    console.log('📷 Found session with', photoCount, 'photos');

    return NextResponse.json({
      success: true,
      sessionId: session.session_id,
      photos: session.photos || [],
      photoCount: photoCount,
      createdAt: session.created_at,
      expiresAt: session.expires_at,
    });
  } catch (error: any) {
    console.error('📷 Error fetching photo session:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
