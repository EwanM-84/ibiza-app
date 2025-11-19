import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      country,
      city,
      dateOfBirth
    } = body;

    // Create Supabase client with service role
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const { createClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 1. Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        role: 'host',
        phone: phone,
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // 2. Create host profile (bypassing RLS with service role)
    const { error: profileError } = await supabaseAdmin
      .from('host_profiles')
      .insert({
        user_id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        country: country,
        city: city,
        date_of_birth: dateOfBirth,
        verification_status: 'pending',
        agreed_to_terms: true,
        agreed_to_background_check: true,
        agreed_to_data_processing: true,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // If profile creation fails, delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    // 3. Sign in the user on the client side
    const supabase = createRouteHandlerClient({ cookies });
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Sign in error:', signInError);
      return NextResponse.json(
        { error: 'Account created but sign in failed. Please try logging in manually.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: authData.user.id
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
