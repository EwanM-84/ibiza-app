# Google Maps Setup Guide

## Overview
The accommodation map on the homepage uses Google Maps JavaScript API to display property locations with price markers.

## Features Implemented
- Interactive map centered on Fusagasugá, Colombia
- Custom price markers for each property
- Click markers to see property details in a popup card
- Hover effects on price markers (scale up, red border)
- 7 properties displayed with real locations
- Zoom controls, street view, and fullscreen options

## Getting Your Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. Create a new project or select an existing one

3. Enable the Maps JavaScript API:
   - Go to "APIs & Services" > "Library"
   - Search for "Maps JavaScript API"
   - Click "Enable"

4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

5. Restrict your API key (recommended):
   - Click on your API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domains:
     - `http://localhost:*` (for development)
     - `https://yourdomain.com/*` (for production)
   - Under "API restrictions", select "Restrict key"
   - Select only "Maps JavaScript API"
   - Save

6. Add the API key to your `.env.local` file:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

7. Restart your development server:
   ```bash
   npm run dev
   ```

## Map Component Location
- Component: `components/AccommodationMap.tsx`
- Used on: `app/page.tsx` (below hero search section)

## Property Data
The map uses static property data from the AccommodationMap component. In production, you would fetch this from Supabase:

```typescript
const properties: Property[] = [
  {
    id: "1",
    title: "Coffee Farm Cottage",
    price: "$45",
    lat: 4.3369,
    lng: -74.3644,
    image: "...",
    rating: "4.9",
  },
  // ... more properties
];
```

## Customization

### Changing Map Center
Edit line 48 in `components/AccommodationMap.tsx`:
```typescript
center: { lat: 4.3369, lng: -74.3644 }, // Fusagasugá coordinates
```

### Changing Map Zoom
Edit line 49:
```typescript
zoom: 13, // Adjust between 1-20
```

### Styling Price Markers
The price markers are styled with inline CSS starting at line 56. You can adjust:
- Colors (background, border, text)
- Padding and border radius
- Font size and weight
- Box shadow

### Map Controls
Available controls can be toggled in the map initialization (lines 52-57):
- `zoomControl`: Zoom in/out buttons
- `mapTypeControl`: Satellite/map view toggle
- `streetViewControl`: Street view pegman
- `fullscreenControl`: Fullscreen button

## Troubleshooting

### Map not loading
- Check that your API key is set correctly in `.env.local`
- Verify the API key starts with `NEXT_PUBLIC_`
- Restart the dev server after adding the key
- Check browser console for errors

### Markers not appearing
- Verify property coordinates are valid lat/lng values
- Check that properties array is not empty
- Look for JavaScript errors in browser console

### Price markers look wrong
- The component uses inline styles for compatibility
- Make sure all style properties are valid CSS
- Check that hover handlers are working

## Production Deployment

When deploying to Netlify:

1. Add the environment variable in Netlify dashboard:
   - Go to Site settings > Environment variables
   - Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` with your key
   - Redeploy the site

2. Update API key restrictions:
   - Add your production domain to the HTTP referrers
   - Remove localhost if you want (or keep for testing)

## Cost Considerations

Google Maps JavaScript API pricing:
- First $200/month is free (covered by Google Cloud free tier)
- $7 per 1,000 map loads after that
- For a small site, you'll likely stay within the free tier

Monitor usage in Google Cloud Console > Maps > Metrics

## Future Enhancements

Consider adding:
- Clustering for many properties (use `@googlemaps/markerclusterer`)
- Search/filter by location
- Draw radius around search point
- Show nearby amenities (cafes, restaurants)
- Custom map styles to match brand colors
- Mobile-optimized touch gestures
