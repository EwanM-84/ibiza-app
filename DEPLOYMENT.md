# Deployment Guide for SPTC Rural Platform

## Environment Variables Required

Before deploying to Netlify, you **must** set these environment variables in your Netlify site settings:

### Required Variables

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Example: `https://your-project-id.supabase.co`
   - Get from: [Supabase Dashboard](https://supabase.com/dashboard) � Your Project � Settings � API

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous key (public, safe to expose)
   - Get from: Supabase Dashboard � Your Project � Settings � API � Project API keys � `anon` `public`

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Your Supabase service role key (private, server-side only)
   - � **IMPORTANT**: This is a secret key, never expose it client-side
   - Get from: Supabase Dashboard � Your Project � Settings � API � Project API keys � `service_role` `secret`

4. **NEXT_PUBLIC_GOOGLE_MAPS_API_KEY**
   - Your Google Maps JavaScript API key
   - Get from: [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - **Security**: Restrict this key to your production domain

### How to Set Environment Variables in Netlify

1. Log in to [Netlify](https://app.netlify.com)
2. Go to your site
3. Navigate to: **Site settings** � **Environment variables**
4. Click **Add a variable** or **Add environment variables**
5. Add each variable with its name and value
6. **Important**: Set the scope to **All scopes** or **Production**
7. Click **Save**

### After Setting Variables

1. Trigger a new deployment:
   - Go to **Deploys** tab
   - Click **Trigger deploy** � **Deploy site**

2. Or push a new commit to trigger automatic deployment

## Google Maps API Key Security

To prevent unauthorized use and unexpected charges:

1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Select your project
3. Go to **Credentials**
4. Click on your API key
5. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add your domains:
     - `https://yourdomain.com/*`
     - `https://www.yourdomain.com/*`
     - `https://*.netlify.app/*` (for preview deployments)
6. Under **API restrictions**:
   - Select **Restrict key**
   - Enable only: **Maps JavaScript API**
7. Click **Save**

## Troubleshooting

### Build fails with "Secrets scanning detected secrets"

This means Netlify detected API keys in your build output or repository.

**Solution:**
1. Ensure `.env.local` is in `.gitignore` (already done ✅)
2. Never commit actual API keys to git
3. Make sure all secrets are stored in Netlify environment variables
4. **Note**: `NEXT_PUBLIC_*` variables are intentionally exposed in the browser bundle - this is normal Next.js behavior. The `netlify.toml` is configured to allow this with `SECRETS_SCAN_SMART_DETECTION_ENABLED = "false"`
5. If you accidentally committed secrets:
   ```bash
   # Remove from git history
   git rm --cached .env.local
   git commit -m "Remove .env.local from git"
   git push
   ```

### Map not showing in production

1. Check that `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in Netlify
2. Verify the API key is not restricted to localhost only
3. Check browser console for errors
4. Ensure billing is enabled for your Google Cloud project

### Database not connecting

1. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly
2. Check that your Supabase project is not paused
3. Verify RLS (Row Level Security) policies are configured

## Local Development

For local development, copy `.env.local.example` to `.env.local` and fill in your actual values:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your real API keys.

**Never commit `.env.local` to git!**
