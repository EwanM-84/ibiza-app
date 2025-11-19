import { NextRequest, NextResponse } from 'next/server';

// Initialize global photo sessions store if not exists
if (!(global as any).photoSessions) {
  (global as any).photoSessions = new Map<string, any>();
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, photo, location } = await request.json();

    if (!sessionId || !photo || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get session from global store
    const session = (global as any).photoSessions?.get(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 404 }
      );
    }

    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      return NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 410 }
      );
    }

    // Add photo to session
    const photoData = {
      filename: `photo-${session.photos.length + 1}-${Date.now()}.jpg`,
      data: photo,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || 0,
      },
      timestamp: new Date().toISOString(),
    };

    session.photos.push(photoData);
    (global as any).photoSessions.set(sessionId, session);

    console.log(`✓ Photo uploaded to session ${sessionId}: ${photoData.filename}`);
    console.log(`  Location: ${location.latitude}, ${location.longitude}`);
    console.log(`  Total photos: ${session.photos.length}`);

    return NextResponse.json({
      success: true,
      photoCount: session.photos.length,
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
