import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

// Initialize global photo sessions store
if (!(global as any).photoSessions) {
  (global as any).photoSessions = new Map<string, {
    sessionId: string;
    hostProfileId: string | null;
    photos: Array<{
      filename: string;
      data: string;
      location: {
        latitude: number;
        longitude: number;
        accuracy: number;
      };
      timestamp: string;
    }>;
    createdAt: Date;
    expiresAt: Date;
  }>();
}

export async function POST(request: NextRequest) {
  try {
    const { hostProfileId } = await request.json();

    // Generate unique session ID
    const sessionId = randomBytes(16).toString('hex');

    // Create session (expires in 1 hour)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    (global as any).photoSessions.set(sessionId, {
      sessionId,
      hostProfileId: hostProfileId || null,
      photos: [],
      createdAt: new Date(),
      expiresAt,
    });

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
