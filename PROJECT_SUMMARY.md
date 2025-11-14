# sptc.rural - Project Summary

## Project Overview

**sptc.rural** is a community-driven accommodation booking platform focused on Fusagasugá, Colombia, and nearby rural areas. It's designed as an Airbnb-style marketplace where a percentage of every booking supports local community development projects.

## Key Differentiators

1. **Community-Focused**: 15% platform fee with 60% going to local projects
2. **Verified Local Hosts**: Bank-grade verification (ID + selfie + geolocation)
3. **Rural Tourism**: Focus on authentic Colombian rural experiences
4. **Colombian Identity**: Design inspired by Colombian flag colors

## Technical Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS with iOS-style design system
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Netlify with automatic CI/CD
- **Icons**: Lucide React
- **Future**: Stripe payments, ID verification APIs, map integration

## Project Status: ✅ MVP Ready

### Completed Features

#### 1. Public Homepage (`/`)
- Hero section with search functionality
- Date picker for check-in/check-out
- Guest selector
- Map placeholder for properties and community projects
- Three feature cards explaining the platform
- Responsive mobile design

#### 2. Admin Dashboard (`/admin`)
- Tab-based navigation (Listings, Bookings, Users, Funds)
- Statistics cards with real-time metrics
- Sample data visualization
- Platform fee breakdown display
- Host verification queue management
- Stripe integration structure

#### 3. Host Onboarding (`/host/onboarding`)
- 3-step verification process with visual progress
- **Step 1**: Account details form
- **Step 2**: ID verification placeholders (document, selfie video, geolocation)
- **Step 3**: Property details and photo upload
- Clear documentation of future implementation

#### 4. Shared Components
- iOS-style navigation with sticky header
- Responsive design for all screen sizes
- Multi-language text system (ready for i18n)
- Colombian flag color scheme throughout

## Design System

### Colors
- **Primary Red**: #DC143C (Colombian flag red)
- **Secondary Yellow**: #FFC72C (Colombian flag yellow)
- **Background**: White with subtle gray tones
- **Shadows**: Soft iOS-style shadows

### Typography
- System UI fonts for native feel
- Clear hierarchy: headings, body, labels
- No emojis anywhere in the UI

### Components
- Rounded corners (xl, 2xl radius)
- Soft shadows (ios, ios-lg)
- Comfortable padding and spacing
- Clear focus states on inputs
- Hover states on interactive elements

## File Structure

```
sptc-rural/
├── app/
│   ├── layout.tsx              # Root layout with nav
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard
│   └── host/
│       └── onboarding/
│           └── page.tsx        # Host verification
├── components/
│   └── Navigation.tsx          # Main navigation
├── lib/
│   ├── supabaseClient.ts       # Supabase config
│   └── text.ts                 # Multi-language text
├── netlify.toml                # Netlify config
├── tailwind.config.ts          # Custom theme
├── .env.local                  # Environment vars (configured)
├── SETUP.md                    # Setup instructions
├── DEPLOYMENT.md               # Netlify deployment guide
└── README.md                   # Main documentation
```

## Database Schema

### Tables Created
1. **users** - User accounts with roles (guest, host, admin)
2. **listings** - Property listings with details and pricing
3. **bookings** - Booking records with dates and pricing
4. **community_projects** - Local projects funded by platform
5. **host_verifications** - Verification status and documents
6. **listing_photos** - Property images with ordering

### Storage Buckets
1. **listing-photos** (public)
2. **verification-documents** (private)
3. **verification-videos** (private)

## Environment Variables

Configured in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://mbipxghsdvksmelxutzo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[configured]
SUPABASE_SERVICE_ROLE_KEY=[configured]
```

## Build Status

✅ Build successful
✅ All pages render correctly
✅ TypeScript compilation clean
✅ No critical errors
✅ Ready for deployment

## Next Implementation Phases

### Phase 1: Core Functionality (2-3 weeks)
- [ ] User authentication (Supabase Auth)
- [ ] Listing creation and management
- [ ] Search and filtering
- [ ] Booking flow
- [ ] Basic admin functions

### Phase 2: Payments (1-2 weeks)
- [ ] Stripe integration
- [ ] Payment processing
- [ ] Automatic fee splitting (15% platform, 85% host)
- [ ] Payout system for hosts
- [ ] Community fund tracking

### Phase 3: Verification (2 weeks)
- [ ] ID verification service (Onfido/Jumio)
- [ ] Selfie video capture and matching
- [ ] Geolocation verification
- [ ] Document storage in Supabase
- [ ] Admin review interface

### Phase 4: Enhanced Features (2-3 weeks)
- [ ] Map integration (Mapbox/Leaflet)
- [ ] Property location pinning
- [ ] Community project display on map
- [ ] Image upload and optimization
- [ ] Review and rating system
- [ ] Messaging between hosts and guests

### Phase 5: Localization (1 week)
- [ ] Spanish translation (primary)
- [ ] French translation
- [ ] German translation
- [ ] Language switcher implementation
- [ ] Date/currency localization

### Phase 6: Community Features (2 weeks)
- [ ] Community project voting
- [ ] Project progress tracking
- [ ] Impact metrics dashboard
- [ ] Host community forum
- [ ] Local experiences booking

## Deployment Instructions

### Development
```bash
cd sptc-rural
npm install
npm run dev
# Visit http://localhost:3000
```

### Production (Netlify)
```bash
# Via Git
git init
git add .
git commit -m "Initial commit"
git push

# Or via CLI
netlify deploy --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Performance Metrics

- **First Load JS**: ~84-89 KB (excellent)
- **Static Generation**: All pages pre-rendered
- **Build Time**: ~30 seconds
- **Lighthouse Score Target**: 95+ (all metrics)

## Security Considerations

1. **Row Level Security**: Enabled on all tables
2. **Environment Variables**: Never committed to git
3. **Service Role Key**: Only for backend operations
4. **Public Anon Key**: Rate-limited by Supabase
5. **HTTPS**: Enforced by Netlify
6. **Input Validation**: Client and server-side

## Business Model

### Revenue Streams
1. **Platform Fee**: 15% of each booking
   - 9% to community projects
   - 6% to operations

### Cost Structure
- Netlify: Free tier (scales to ~$20/mo)
- Supabase: Free tier (scales to ~$25/mo)
- Stripe: 2.9% + $0.30 per transaction
- Domain: ~$12/year

### Break-Even Analysis
- Need ~50 bookings/month at $50 avg to break even
- Target: 200 bookings/month for sustainability

## Marketing Strategy

1. **Local Partnerships**: Work with Fusagasugá tourism board
2. **Community Engagement**: Partner with local projects
3. **Content Marketing**: Blog about rural Colombian tourism
4. **Social Media**: Instagram-focused with property photos
5. **Referral Program**: Host and guest incentives

## Success Metrics

### Launch Targets (First 3 Months)
- 20+ verified hosts
- 100+ bookings
- $5,000+ to community projects
- 4.5+ average rating
- 50% repeat booking rate

### Long-Term Goals (Year 1)
- 100+ active listings
- 1,000+ bookings
- $50,000+ to community projects
- Expand to 3 nearby regions
- Break-even or profitable

## Contact & Support

- **Project**: Part of SPTC initiative
- **Focus Area**: Fusagasugá, Colombia
- **Technical Documentation**: See README.md
- **Setup Guide**: See SETUP.md
- **Deployment Guide**: See DEPLOYMENT.md

## License

Part of the SPTC project initiative for community development in rural Colombia.

---

**Status**: ✅ Ready for deployment and beta testing
**Last Updated**: January 2025
**Version**: 0.1.0 (MVP)
