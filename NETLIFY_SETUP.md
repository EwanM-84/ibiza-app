# URGENT: Netlify Setup Instructions

## Step 1: Disable Secret Scanning (MUST DO FIRST!)

Netlify's secret scanner incorrectly flags Next.js public variables as leaked secrets. You must disable it.

1. Go to your Netlify site dashboard
2. Navigate to: **Site settings** > **Environment variables**
3. Click **Add a variable**
4. Add this variable:
   - Name: `SECRETS_SCAN_SMART_DETECTION_ENABLED`
   - Value: `false`
   - Scopes: **All scopes**
5. Click **Save**

## Step 2: Remove SUPABASE_SERVICE_ROLE_KEY

This key is not currently used in the application and is causing issues.

1. In **Site settings** > **Environment variables**
2. Find `SUPABASE_SERVICE_ROLE_KEY` (if it exists)
3. Click the trash/delete icon to remove it
4. Click **Save**

## Step 3: Verify These 3 Variables Are Set

Make sure you have these environment variables (and ONLY these):

1. `NEXT_PUBLIC_SUPABASE_URL`
   - Your value: `https://ywfhrqgjiudngpdarfzy.supabase.co`

2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Your value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3ZmhycWdqaXVkbmdwZGFyZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzM1ODAsImV4cCI6MjA3ODcwOTU4MH0.uzFNJUB-X9DspC-vBLqFVr6LmqryzVTN1rYexh0tA10`

3. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Your value: `AIzaSyDG4cppsWwBUIxVqbRZMTdkQgHbygM1xUU`

## Step 4: Clear Build Cache and Deploy

1. Go to **Site settings** > **Build & deploy** > **Build settings**
2. Click **Clear cache and deploy site**

OR

1. Go to **Deploys** tab
2. Click **Trigger deploy** > **Clear cache and deploy site**

## Why This Works

- `NEXT_PUBLIC_*` variables are SUPPOSED to be in the client bundle - that's how Next.js works
- Netlify's scanner doesn't understand this and flags them as "leaked secrets"
- Disabling the scanner allows the normal Next.js build to complete
- These keys are safe to expose (they're public API keys meant for browser use)
- The service role key was never used and doesn't need to be set

## After Deployment

Once deployed successfully, secure your Google Maps API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Find your API key
3. Restrict it to your production domain (e.g., `https://yourdomain.com/*`)

This prevents unauthorized use while still allowing your site to work.
