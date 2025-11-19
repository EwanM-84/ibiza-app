import { NextRequest, NextResponse } from 'next/server';

// Initialize global photo sessions store if not exists
if (!(global as any).photoSessions) {
  (global as any).photoSessions = new Map<string, any>();
}

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    // Get session from global store
    const session = (global as any).photoSessions?.get(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId,
      photos: session.photos,
      photoCount: session.photos.length,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    });
  } catch (error: any) {
    console.error('Error fetching photo session:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
