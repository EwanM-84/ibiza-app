"use client";

import { useEffect, useRef, useState } from "react";

interface Property {
  id: string;
  title: string;
  price: string;
  lat: number;
  lng: number;
  image: string;
  rating: string;
}

const properties: Property[] = [
  {
    id: "1",
    title: "Coffee Farm Cottage",
    price: "$45",
    lat: 4.3369,
    lng: -74.3644,
    image: "https://images.unsplash.com/photo-1602391833977-358a52198938?w=400&q=80",
    rating: "4.9",
  },
  {
    id: "2",
    title: "Mountain View Villa",
    price: "$65",
    lat: 4.3450,
    lng: -74.3550,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80",
    rating: "4.8",
  },
  {
    id: "3",
    title: "Traditional Finca",
    price: "$55",
    lat: 4.3280,
    lng: -74.3720,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80",
    rating: "5.0",
  },
  {
    id: "4",
    title: "Boutique Eco Lodge",
    price: "$85",
    lat: 4.3400,
    lng: -74.3500,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: "4.9",
  },
  {
    id: "5",
    title: "Riverside Cabin",
    price: "$50",
    lat: 4.3320,
    lng: -74.3680,
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80",
    rating: "4.7",
  },
  {
    id: "6",
    title: "Colonial Hacienda",
    price: "$95",
    lat: 4.3380,
    lng: -74.3600,
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400&q=80",
    rating: "5.0",
  },
  {
    id: "7",
    title: "Modern Loft",
    price: "$70",
    lat: 4.3360,
    lng: -74.3620,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80",
    rating: "4.8",
  },
];

export default function AccommodationMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);

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

        // Load the Google Maps script dynamically with async
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async`;
        script.async = true;
        script.defer = true;

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
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 4.3369, lng: -74.3644 },
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

        // Add Booking.com-style speech bubble markers
        properties.forEach((property) => {
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
            position: { lat: property.lat, lng: property.lng },
            title: property.title,
            icon: svgMarker,
            label: {
              text: property.price,
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 'bold',
            },
          });

          marker.addListener("click", () => {
            setSelectedProperty(property);
            mapInstance.panTo({ lat: property.lat, lng: property.lng });
          });
        });
      } catch (error) {
        setError("Failed to render map");
      }
    };

    initMap();
  }, []);

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

      {selectedProperty && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4">
          <div className="bg-white rounded-3xl shadow-ios-2xl p-4 animate-fade-in">
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-sptc-gray-100 rounded-full flex items-center justify-center hover:bg-sptc-gray-200 transition-colors"
            >
              <span className="text-sptc-gray-700 text-lg font-bold">&times;</span>
            </button>

            <div className="flex space-x-4">
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                className="w-24 h-24 object-cover rounded-2xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 truncate mb-1">
                  {selectedProperty.title}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-semibold text-gray-900">★ {selectedProperty.rating}</span>
                </div>
                <p className="text-gray-900">
                  <span className="font-bold text-xl">{selectedProperty.price}</span>
                  <span className="text-gray-600"> / night</span>
                </p>
              </div>
            </div>

            <button className="w-full mt-4 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold py-3 rounded-xl hover:from-sptc-red-700 hover:to-sptc-red-800 transition-all shadow-lg hover:shadow-xl">
              View details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
