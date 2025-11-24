import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    // Get session from Supabase
    const { data: session, error } = await supabase
      .from('photo_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error || !session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: session.session_id,
      photos: session.photos || [],
      photoCount: (session.photos || []).length,
      createdAt: session.created_at,
      expiresAt: session.expires_at,
    });
  } catch (error: any) {
    console.error('Error fetching photo session:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
