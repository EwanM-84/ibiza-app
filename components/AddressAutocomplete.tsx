"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface AddressComponents {
  streetNumber?: string;
  street?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onAddressSelect: (components: AddressComponents) => void;
  placeholder?: string;
  className?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Start typing an address...",
  className = "",
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
      console.warn("Google Maps API key not configured");
      return;
    }

    const initAutocomplete = () => {
      if (!inputRef.current || autocompleteRef.current) return;

      try {
        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["address"],
            fields: ["address_components", "formatted_address", "geometry"],
          }
        );

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace();

          if (!place?.geometry?.location) {
            console.warn("No geometry for this place");
            return;
          }

          const components = parseAddressComponents(
            place.address_components || [],
            place.formatted_address || "",
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );

          onChange(components.fullAddress);
          onAddressSelect(components);
        });

        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize autocomplete:", error);
      }
    };

    // Check if Google Maps is already loaded
    if ((window as any).google?.maps?.places) {
      initAutocomplete();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", initAutocomplete);
      return;
    }

    // Load the Google Maps script with Places library
    setIsLoading(true);
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;

    script.onload = () => {
      setIsLoading(false);
      initAutocomplete();
    };

    script.onerror = () => {
      setIsLoading(false);
      console.error("Failed to load Google Maps script");
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup listener if needed
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const parseAddressComponents = (
    components: google.maps.GeocoderAddressComponent[],
    formattedAddress: string,
    lat: number,
    lng: number
  ): AddressComponents => {
    const result: AddressComponents = {
      fullAddress: formattedAddress,
      latitude: lat,
      longitude: lng,
    };

    components.forEach((component) => {
      const types = component.types;

      if (types.includes("street_number")) {
        result.streetNumber = component.long_name;
      }
      if (types.includes("route")) {
        result.street = component.long_name;
      }
      if (types.includes("locality") || types.includes("postal_town")) {
        result.city = component.long_name;
      }
      if (types.includes("administrative_area_level_1")) {
        result.region = component.long_name;
      }
      if (types.includes("country")) {
        result.country = component.long_name;
      }
      if (types.includes("postal_code")) {
        result.postalCode = component.long_name;
      }
    });

    return result;
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sptc-red-500 focus:border-transparent ${className}`}
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        )}
        {isReady && !isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
      {!isReady && !isLoading && (
        <p className="text-xs text-amber-600 mt-1">
          Google Places not available. Please enter address manually.
        </p>
      )}
    </div>
  );
}
