import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set (hidden)' : '✗ Missing',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set (hidden)' : '✗ Missing',
    NEXT_PUBLIC_METAMAP_CLIENT_ID: process.env.NEXT_PUBLIC_METAMAP_CLIENT_ID ? '✓ Set (hidden)' : '✗ Missing',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ? '✓ Set (hidden)' : '✗ Missing',
    NODE_ENV: process.env.NODE_ENV,
  });
}
