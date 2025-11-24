import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, photo, location } = await request.json();

    if (!sessionId || !photo || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get session from Supabase
    const { data: session, error: fetchError } = await supabase
      .from('photo_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (fetchError || !session) {
      console.error('Session not found:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 404 }
      );
    }

    // Check if session is expired
    if (new Date() > new Date(session.expires_at)) {
      return NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 410 }
      );
    }

    // Add photo to session
    const currentPhotos = session.photos || [];
    const photoData = {
      filename: `photo-${currentPhotos.length + 1}-${Date.now()}.jpg`,
      data: photo,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || 0,
      },
      timestamp: new Date().toISOString(),
    };

    const updatedPhotos = [...currentPhotos, photoData];

    // Update session in Supabase
    const { error: updateError } = await supabase
      .from('photo_sessions')
      .update({ photos: updatedPhotos })
      .eq('session_id', sessionId);

    if (updateError) {
      console.error('Error updating session:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to save photo' },
        { status: 500 }
      );
    }

    console.log(`✓ Photo uploaded to session ${sessionId}: ${photoData.filename}`);
    console.log(`  Location: ${location.latitude}, ${location.longitude}`);
    console.log(`  Total photos: ${updatedPhotos.length}`);

    return NextResponse.json({
      success: true,
      photoCount: updatedPhotos.length,
      filename: photoData.filename,
    });
  } catch (error: any) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
