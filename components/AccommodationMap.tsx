"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  price_per_night: number;
  latitude?: number | null;
  longitude?: number | null;
  images?: string[];
  rating?: number;
}

interface AccommodationMapProps {
  listings?: Listing[];
}

// Default center for Fusagasugá, Colombia
const DEFAULT_CENTER = { lat: 4.3369, lng: -74.3644 };

export default function AccommodationMap({ listings = [] }: AccommodationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter listings with valid coordinates
  const listingsWithCoords = listings.filter(
    l => l.latitude && l.longitude && l.latitude !== 0 && l.longitude !== 0
  );

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
      setError("Google Maps API key not configured");
      return;
    }

    const initMap = async () => {
      try {
        // Check if Google Maps is already loaded
        if ((window as any).google?.maps) {
          renderMap();
          return;
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
        if (existingScript) {
          existingScript.addEventListener('load', renderMap);
          return;
        }

        // Load the Google Maps script dynamically
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;

        script.onload = () => {
          renderMap();
        };

        script.onerror = () => {
          setError("Failed to load Google Maps. Please check your API key and network connection.");
        };

        document.head.appendChild(script);

      } catch (error) {
        setError("Failed to load Google Maps");
      }
    };

    const renderMap = () => {
      if (!mapRef.current) return;

      try {
        // Calculate center based on listings or use default
        let center = DEFAULT_CENTER;
        if (listingsWithCoords.length > 0) {
          const avgLat = listingsWithCoords.reduce((sum, l) => sum + (l.latitude || 0), 0) / listingsWithCoords.length;
          const avgLng = listingsWithCoords.reduce((sum, l) => sum + (l.longitude || 0), 0) / listingsWithCoords.length;
          center = { lat: avgLat, lng: avgLng };
        }

        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom: 13,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: true,
          scrollwheel: true,
          gestureHandling: 'greedy',
        });

        setMap(mapInstance);

        // Add Booking.com-style speech bubble markers for real listings
        listingsWithCoords.forEach((listing) => {
          // Create custom speech bubble marker with SVG
          const svgMarker = {
            path: 'M 0,0 L 50,0 L 50,30 L 27,30 L 25,35 L 23,30 L 0,30 Z',
            fillColor: '#DC143C',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            scale: 1,
            anchor: new google.maps.Point(25, 35),
            labelOrigin: new google.maps.Point(25, 15),
          };

          const marker = new google.maps.Marker({
            map: mapInstance,
            position: { lat: listing.latitude!, lng: listing.longitude! },
            title: listing.title,
            icon: svgMarker,
            label: {
              text: `$${listing.price_per_night}`,
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 'bold',
            },
          });

          marker.addListener("click", () => {
            setSelectedListing(listing);
            mapInstance.panTo({ lat: listing.latitude!, lng: listing.longitude! });
          });
        });

        // Fit bounds if multiple listings
        if (listingsWithCoords.length > 1) {
          const bounds = new google.maps.LatLngBounds();
          listingsWithCoords.forEach(listing => {
            bounds.extend({ lat: listing.latitude!, lng: listing.longitude! });
          });
          mapInstance.fitBounds(bounds);
        }
      } catch (error) {
        setError("Failed to render map");
      }
    };

    initMap();
  }, [listings.length]);

  if (error) {
    return (
      <div className="relative w-full">
        <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-ios-2xl bg-gradient-to-br from-sptc-gray-100 to-sptc-gray-200 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <div className="w-20 h-20 mx-auto mb-6 bg-sptc-yellow-500 rounded-3xl flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Map Preview</h3>
            <p className="text-gray-600 mb-4">
              To enable the interactive map, add your Google Maps API key to the .env.local file
            </p>
            <div className="bg-white rounded-2xl p-4 text-left">
              <p className="text-sm font-mono text-gray-700">
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              See GOOGLE_MAPS_SETUP.md for instructions
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div
        ref={mapRef}
        className="w-full h-[600px] rounded-3xl overflow-hidden shadow-ios-2xl bg-sptc-gray-100"
        style={{ minHeight: "600px" }}
      />

      {selectedListing && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4">
          <div className="bg-white rounded-3xl shadow-ios-2xl p-4 animate-fade-in">
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-sptc-gray-100 rounded-full flex items-center justify-center hover:bg-sptc-gray-200 transition-colors z-10"
            >
              <span className="text-sptc-gray-700 text-lg font-bold">&times;</span>
            </button>

            <div className="flex space-x-4">
              <img
                src={selectedListing.images?.[0] || "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80"}
                alt={selectedListing.title}
                className="w-24 h-24 object-cover rounded-2xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 truncate mb-1">
                  {selectedListing.title}
                </h3>
                {selectedListing.rating && (
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-semibold text-gray-900">★ {selectedListing.rating}</span>
                  </div>
                )}
                <p className="text-gray-900">
                  <span className="font-bold text-xl">${selectedListing.price_per_night}</span>
                  <span className="text-gray-600"> / night</span>
                </p>
              </div>
            </div>

            <Link
              href={`/listing/${selectedListing.id}`}
              className="block w-full mt-4 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold py-3 rounded-xl hover:from-sptc-red-700 hover:to-sptc-red-800 transition-all shadow-lg hover:shadow-xl text-center"
            >
              View details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
