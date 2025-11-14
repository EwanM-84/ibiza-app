# Database Setup Guide

## Setting up Supabase Database

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `ywfhrqgjiudngpdarfzy`

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Schema**
   - Copy the entire contents of `supabase-schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" (or press Ctrl/Cmd + Enter)

4. **Verify the Setup**
   - Go to "Table Editor" in the left sidebar
   - You should see all the tables:
     - users
     - listings
     - listing_photos
     - pricing_rules
     - custom_prices
     - bookings
     - community_projects
     - project_contributions
     - host_verification
     - reviews

5. **Sample Data**
   - The schema includes 3 sample community projects
   - You can view them in the `community_projects` table

## Database Schema Overview

### Core Tables

**users**: User accounts (guests, hosts, admins)
**listings**: Property listings with location and pricing
**listing_photos**: Photos for each listing with geolocation
**pricing_rules**: Dynamic pricing rules for listings
**custom_prices**: Date-specific custom pricing
**bookings**: Guest reservations
**community_projects**: Community initiatives
**project_contributions**: Tracking of community funding
**host_verification**: ID and face verification for hosts
**reviews**: Guest reviews and ratings

### Security

- Row Level Security (RLS) is enabled on all tables
- Basic policies are in place:
  - Users can only see their own data
  - Public can view approved listings and projects
  - Hosts can manage their own listings
  - Guests can view their own bookings

### Customization

You can modify the RLS policies in the SQL Editor to match your specific security requirements. The current policies are a starting point.

## Environment Variables

Make sure these are set in Netlify:

```
NEXT_PUBLIC_SUPABASE_URL=https://ywfhrqgjiudngpdarfzy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

Get the keys from: Supabase Dashboard → Settings → API
