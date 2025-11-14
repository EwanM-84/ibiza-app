# sptc.rural

A community-driven Airbnb-style platform focused on Fusagasugá, Colombia.

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling with iOS-inspired design
- **Supabase** for authentication, database, and storage
- **Lucide React** for icons

## Design Language

Modern iOS-style web application with:
- Colombian flag-inspired colors (red, yellow, white)
- Rounded containers and cards with soft shadows
- System UI fonts for native feel
- Clean, spacious layouts
- No emojis

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
sptc-rural/
├── app/
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Public homepage
│   ├── admin/
│   │   └── page.tsx        # Admin dashboard
│   ├── host/
│   │   └── onboarding/
│   │       └── page.tsx    # Host onboarding flow
│   └── globals.css         # Global styles
├── components/
│   └── Navigation.tsx      # Main navigation component
├── lib/
│   ├── supabaseClient.ts   # Supabase configuration
│   └── text.ts             # Multi-language text content
├── tailwind.config.ts      # Tailwind custom theme
└── README.md
```

## Key Features

### Public Homepage
- Hero section with search functionality
- Interactive map showing properties and community projects
- Information cards about community support, verified hosts, and experiences

### Admin Dashboard
- Listings management
- Bookings overview
- User and host management
- Community funds and payout tracking
- Platform fee breakdown (15% split)

### Host Onboarding
- Multi-step verification process
- Account details collection
- ID verification (Revolut-style)
  - Document upload
  - Selfie video verification
  - Geolocation confirmation
- Property information and photo upload

## Future Integrations

### Stripe Payments
The admin dashboard includes structure for Stripe integration:
- Guest payment processing via Stripe Checkout
- Automatic 15% platform fee calculation
- Host payout distribution (85%)
- Community fund allocation tracking
- Webhook handlers for payment events

### ID Verification
Host onboarding includes placeholders for:
- Document verification (Onfido, Jumio, or Stripe Identity)
- Facial recognition (AWS Rekognition or Azure Face API)
- Geolocation validation

### Maps
Map components are ready for integration with:
- Mapbox GL JS
- Leaflet with OpenStreetMap

## Supabase Database Schema

The project expects these tables (create them in Supabase):

```sql
-- Users table
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  role text not null check (role in ('guest', 'host', 'admin')),
  created_at timestamp with time zone default now()
);

-- Listings table
create table listings (
  id uuid primary key default uuid_generate_v4(),
  host_id uuid references users(id),
  title text not null,
  description text,
  price decimal not null,
  location text,
  created_at timestamp with time zone default now()
);

-- Bookings table
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references listings(id),
  guest_id uuid references users(id),
  check_in date not null,
  check_out date not null,
  total_price decimal not null,
  status text not null check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamp with time zone default now()
);

-- Community projects table
create table community_projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  goal_amount decimal not null,
  current_amount decimal default 0,
  created_at timestamp with time zone default now()
);
```

## Multi-Language Support

Text content is centralized in `lib/text.ts` for easy internationalization. Currently supports English, with structure ready for Spanish, French, and German.

## Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme:
- `sptc.red`: Primary accent color
- `sptc.yellow`: Secondary accent color
- `sptc.gray.*`: Neutral tones

### Text Content
Edit `lib/text.ts` to modify or translate any text in the application.

## Build for Production

```bash
npm run build
npm start
```

## Deployment

This project is configured for deployment on Netlify.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

```bash
# Install dependencies
npm install

# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# Connect to Netlify dashboard and deploy
# Or use Netlify CLI: netlify deploy --prod
```

Environment variables are already configured in `.env.local` and need to be added to Netlify dashboard.

## Contributing

This is a community-focused project. Future features will include community project voting, local experiences booking, and enhanced social features.

## License

Part of the SPTC project initiative.
