# Deployment Guide - Netlify

## Prerequisites

- GitHub account
- Netlify account (free tier works great)
- Your Supabase credentials (already configured in `.env.local`)

## Step-by-Step Deployment

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - sptc.rural platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sptc-rural.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" > "Import an existing project"
   - Choose "GitHub" and authorize Netlify
   - Select your `sptc-rural` repository

3. **Configure Build Settings**
   - Build command: `npm run build` (auto-detected)
   - Publish directory: `.next` (auto-detected)
   - Click "Show advanced" > "New variable" to add environment variables

4. **Add Environment Variables**
   Add these in Netlify dashboard under Site settings > Environment variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://mbipxghsdvksmelxutzo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iaXB4Z2hzZHZrc21lbHh1dHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMzIwMTcsImV4cCI6MjA3NzkwODAxN30.F2ay2t_qA3qgd54KnBgjkR8UzBpbW8jo03xbmNH0uNE
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iaXB4Z2hzZHZrc21lbHh1dHpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjMzMjAxNywiZXhwIjoyMDc3OTA4MDE3fQ.2f6IbrL6kxvI0HYeuT2gtwOXEeb2jcU4pXjJYRWGKhU
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete (usually 2-3 minutes)
   - Your site will be live at a random URL like `random-name-123456.netlify.app`

6. **Custom Domain (Optional)**
   - Go to Site settings > Domain management
   - Click "Add custom domain"
   - Add `sptc.rural` or your preferred domain
   - Follow DNS configuration instructions

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify site
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: sptc-rural (or your preference)

# Deploy to production
netlify deploy --prod

# Set environment variables via CLI
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://mbipxghsdvksmelxutzo.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your-anon-key"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "your-service-role-key"
```

### Option 3: Drag and Drop Deploy

```bash
# Build locally
npm run build

# The build output is in .next folder
# Go to https://app.netlify.com/drop
# Drag and drop the entire project folder
```

## Post-Deployment Checklist

- [ ] Site is live and accessible
- [ ] Navigation works correctly
- [ ] Hero search form displays properly
- [ ] Admin dashboard is accessible at `/admin`
- [ ] Host onboarding is accessible at `/host/onboarding`
- [ ] All styling looks correct (iOS-style design)
- [ ] Supabase connection is working (check browser console)
- [ ] Mobile responsive design works on different devices

## Netlify Configuration

The `netlify.toml` file includes:

- Build command: `npm run build`
- Publish directory: `.next`
- Next.js plugin for proper SSR support
- Node.js version: 18
- Redirects for SPA routing
- Environment variable references

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch triggers automatic deployment
- Pull requests create deploy previews
- Rollback to previous deployments anytime from Netlify dashboard

## Custom Domain Setup

1. **Purchase Domain** (if needed)
   - Namecheap, GoDaddy, or Google Domains
   - Recommended: `sptc.rural` or `sptcrural.com`

2. **Add to Netlify**
   - Site settings > Domain management > Add custom domain
   - Enter your domain name

3. **Configure DNS**
   - Add Netlify nameservers to your domain registrar:
     ```
     dns1.p08.nsone.net
     dns2.p08.nsone.net
     dns3.p08.nsone.net
     dns4.p08.nsone.net
     ```
   - Or add an A record pointing to Netlify's load balancer

4. **Enable HTTPS**
   - Netlify automatically provisions SSL certificate
   - Usually takes 1-2 minutes after DNS propagation

## Monitoring and Analytics

Enable in Netlify dashboard:
- Analytics: Track page views and performance
- Forms: If you add contact forms later
- Functions: For serverless API routes
- Build hooks: For automated deployments

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure all environment variables are set
- Verify Node.js version compatibility

### Site Not Loading
- Check if build completed successfully
- Verify environment variables are correct
- Check browser console for errors

### Supabase Connection Issues
- Verify environment variables in Netlify
- Check Supabase project is active
- Ensure anon key has correct permissions

## Performance Optimization

Netlify automatically provides:
- Global CDN distribution
- Automatic image optimization
- Brotli compression
- HTTP/2 support
- Edge handlers for faster response times

## Cost Estimate

**Netlify Free Tier includes:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Automatic HTTPS
- Continuous deployment
- Perfect for MVP and early growth

**When to upgrade:**
- More than 100 GB bandwidth needed
- Advanced analytics required
- Priority support needed
- Enterprise features required

## Support

- Netlify Docs: https://docs.netlify.com
- Next.js on Netlify: https://docs.netlify.com/frameworks/next-js/
- Community Forum: https://answers.netlify.com
