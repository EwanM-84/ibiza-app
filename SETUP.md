# Quick Setup Guide

## 1. Verify Installation

Your project is already set up with:
- ✅ Supabase credentials configured in `.env.local`
- ✅ Netlify configuration in `netlify.toml`
- ✅ All dependencies installed
- ✅ TypeScript and Tailwind configured

## 2. Run Development Server

```bash
cd sptc-rural
npm run dev
```

Open http://localhost:3000 to see your app.

## 3. Test the Application

Visit these pages to verify everything works:
- Homepage: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin
- Host Onboarding: http://localhost:3000/host/onboarding

## 4. Set Up Supabase Database

Go to your Supabase dashboard and run these SQL commands in the SQL Editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  phone text,
  role text not null check (role in ('guest', 'host', 'admin')) default 'guest',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Listings table
create table listings (
  id uuid primary key default uuid_generate_v4(),
  host_id uuid references users(id) on delete cascade,
  title text not null,
  description text,
  price decimal not null,
  location text,
  city text,
  latitude decimal,
  longitude decimal,
  status text check (status in ('draft', 'pending', 'active', 'inactive')) default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Bookings table
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references listings(id) on delete cascade,
  guest_id uuid references users(id) on delete cascade,
  check_in date not null,
  check_out date not null,
  guests integer not null default 1,
  total_price decimal not null,
  platform_fee decimal not null,
  host_payout decimal not null,
  status text not null check (status in ('pending', 'confirmed', 'cancelled', 'completed')) default 'pending',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Community projects table
create table community_projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  goal_amount decimal not null,
  current_amount decimal default 0,
  status text check (status in ('active', 'completed', 'paused')) default 'active',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Host verification table
create table host_verifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  id_document_url text,
  selfie_video_url text,
  location_verified boolean default false,
  latitude decimal,
  longitude decimal,
  status text check (status in ('pending', 'reviewing', 'approved', 'rejected')) default 'pending',
  reviewed_at timestamp with time zone,
  reviewed_by uuid references users(id),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Listing photos table
create table listing_photos (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references listings(id) on delete cascade,
  photo_url text not null,
  caption text,
  display_order integer default 0,
  created_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index idx_listings_host_id on listings(host_id);
create index idx_listings_status on listings(status);
create index idx_bookings_listing_id on bookings(listing_id);
create index idx_bookings_guest_id on bookings(guest_id);
create index idx_bookings_status on bookings(status);
create index idx_host_verifications_user_id on host_verifications(user_id);
create index idx_host_verifications_status on host_verifications(status);
create index idx_listing_photos_listing_id on listing_photos(listing_id);

-- Enable Row Level Security
alter table users enable row level security;
alter table listings enable row level security;
alter table bookings enable row level security;
alter table community_projects enable row level security;
alter table host_verifications enable row level security;
alter table listing_photos enable row level security;

-- RLS Policies (basic examples - customize based on your needs)

-- Users can read their own data
create policy "Users can view own data"
  on users for select
  using (auth.uid() = id);

-- Anyone can view active listings
create policy "Anyone can view active listings"
  on listings for select
  using (status = 'active');

-- Hosts can manage their own listings
create policy "Hosts can manage own listings"
  on listings for all
  using (auth.uid() = host_id);

-- Users can view their own bookings
create policy "Users can view own bookings"
  on bookings for select
  using (auth.uid() = guest_id or auth.uid() in (
    select host_id from listings where id = listing_id
  ));

-- Anyone can view active community projects
create policy "Anyone can view active projects"
  on community_projects for select
  using (status = 'active');
```

## 5. Set Up Supabase Storage

In your Supabase dashboard, create these storage buckets:

1. **listing-photos**
   - Public bucket
   - Allowed file types: image/jpeg, image/png, image/webp
   - Max file size: 5MB

2. **verification-documents**
   - Private bucket
   - Allowed file types: image/jpeg, image/png, application/pdf
   - Max file size: 10MB

3. **verification-videos**
   - Private bucket
   - Allowed file types: video/mp4, video/webm
   - Max file size: 50MB

## 6. Deploy to Netlify

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

Quick version:
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial sptc.rural platform"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main

# Then connect via Netlify dashboard
# Add the same environment variables from .env.local
```

## 7. Next Steps

After deployment:
- [ ] Test all pages on production
- [ ] Add actual images to replace placeholders
- [ ] Set up Stripe for payments
- [ ] Integrate map library (Mapbox or Leaflet)
- [ ] Add ID verification service
- [ ] Configure custom domain
- [ ] Add Spanish translations
- [ ] Set up email notifications

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000
npm run dev
```

### Build errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### Supabase connection issues
- Verify `.env.local` has correct credentials
- Check Supabase project is active
- Ensure you're using the correct URL (with https://)

## Support

For issues or questions:
1. Check the [README.md](./README.md) for detailed documentation
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for Netlify-specific help
3. Check browser console for errors
4. Review Supabase logs in dashboard
