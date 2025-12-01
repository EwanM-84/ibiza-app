"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  MapPin,
  Calendar,
  Users,
  Filter,
  X,
  Star,
  Coffee,
  Mountain,
  Leaf,
  Home,
  Wifi,
  Utensils,
  Car,
  TreePine,
  Sun,
  Map as MapIcon,
  Heart,
  Plus,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/lib/text";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import AccommodationMap from "@/components/AccommodationMap";

interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  address?: string;
  city?: string;
  region?: string;
  price_per_night: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  property_type: string;
  amenities: string[];
  latitude?: number | null;
  longitude?: number | null;
  rating?: number;
  reviews_count?: number;
  host_profiles?: {
    first_name: string;
    last_name: string;
    verification_status: string;
  };
}

function SearchResultsContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const country = searchParams?.get("country") || "Colombia";
  const region = searchParams?.get("region") || "North Andean Region";
  const checkIn = searchParams?.get("checkIn") || "";
  const checkOut = searchParams?.get("checkOut") || "";
  const adults = searchParams?.get("adults") || "2";
  const children = searchParams?.get("children") || "0";
  const totalGuests = parseInt(adults) + parseInt(children);

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [priceRange, setPriceRange] = useState([15, 500]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchListings();
  }, [sortBy, priceRange, totalGuests]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      // First, try to get all listings without status/available filter to debug
      let query = supabase
        .from("listings")
        .select(`
          id,
          title,
          description,
          location,
          address,
          city,
          region,
          price_per_night,
          images,
          bedrooms,
          bathrooms,
          max_guests,
          property_type,
          amenities,
          latitude,
          longitude,
          status,
          available,
          host_profiles (
            first_name,
            last_name,
            verification_status
          )
        `);

      // Apply sorting
      if (sortBy === "price-low") {
        query = query.order("price_per_night", { ascending: true });
      } else if (sortBy === "price-high") {
        query = query.order("price_per_night", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching listings:", error);
      } else {
        console.log("Raw listings from DB:", data);
        // Filter by status, availability, price range and guest capacity on client side
        // This allows listings with null max_guests to show (treating null as unlimited)
        let filteredData = (data || []).filter(
          (listing: any) =>
            (listing.status === "active" || !listing.status) &&
            (listing.available === true || listing.available === null) &&
            listing.price_per_night >= priceRange[0] &&
            listing.price_per_night <= priceRange[1] &&
            (listing.max_guests === null || listing.max_guests >= totalGuests)
        );
        console.log("Filtered listings:", filteredData);
        setListings(filteredData);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: "coffee-farm", label: getText("searchPage.coffeeFarmExperience", language), icon: Coffee },
    { id: "mountain-view", label: getText("searchPage.mountainViews", language), icon: Mountain },
    { id: "eco-friendly", label: getText("searchPage.ecoFriendly", language), icon: Leaf },
    { id: "traditional", label: getText("searchPage.traditionalArchitecture", language), icon: Home },
    { id: "wifi", label: getText("searchPage.wifiAvailable", language), icon: Wifi },
    { id: "meals", label: getText("searchPage.mealsIncluded", language), icon: Utensils },
    { id: "parking", label: getText("searchPage.freeParking", language), icon: Car },
    { id: "nature", label: getText("searchPage.natureTrails", language), icon: TreePine },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇨🇴</span>
                <span className="font-semibold text-gray-900">{country}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-700">{region}</span>
              </div>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {checkIn || getText("searchPage.checkIn", language)} — {checkOut || getText("searchPage.checkOut", language)}
                </span>
              </div>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>
                  {adults} {getText("searchPage.adults", language)} · {children} {getText("searchPage.children", language)}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 px-4 py-2 bg-sptc-red text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              <MapIcon className="w-4 h-4" />
              {showMap ? getText("searchPage.hideMap", language) : getText("searchPage.showOnMap", language)}
            </button>
          </div>
        </div>
      </div>

      {/* Map View */}
      {showMap && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AccommodationMap listings={listings} />
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${showMap ? 'hidden' : ''}`}>
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{getText("searchPage.filterBy", language)}</h2>
                {selectedFilters.length > 0 && (
                  <button
                    onClick={() => setSelectedFilters([])}
                    className="text-sm text-sptc-red font-semibold hover:underline"
                  >
                    {getText("searchPage.clearAll", language)}
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {getText("searchPage.pricePerNight", language)}
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([parseInt(e.target.value), priceRange[1]])
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder={getText("searchPage.min", language)}
                  />
                  <span className="text-gray-500">—</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder={getText("searchPage.max", language)}
                  />
                </div>
              </div>

              {/* Rural Filters */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {getText("searchPage.ruralExperience", language)}
                </h3>
                <div className="space-y-2">
                  {filters.map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => toggleFilter(filter.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          selectedFilters.includes(filter.id)
                            ? "bg-sptc-red text-white"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {filter.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Property Type */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  {getText("searchPage.propertyType", language)}
                </h3>
                <div className="space-y-2">
                  {[
                    getText("searchPage.countryHouses", language),
                    getText("searchPage.traditionalHomes", language),
                    getText("searchPage.coffeeFarms", language),
                    getText("searchPage.mountainCabins", language),
                    getText("searchPage.ecoLodges", language),
                  ].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-sptc-red rounded focus:ring-sptc-red"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {region}: {listings.length} {getText("searchPage.propertiesFound", language)}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {getText("searchPage.authenticRuralStays", language)}
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sptc-red"
              >
                <option value="recommended">{getText("searchPage.recommended", language)}</option>
                <option value="price-low">{getText("searchPage.priceLowToHigh", language)}</option>
                <option value="price-high">{getText("searchPage.priceHighToLow", language)}</option>
                <option value="rating">{getText("searchPage.highestRated", language)}</option>
              </select>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-80 h-64 md:h-auto bg-gray-300 flex-shrink-0"></div>
                      <div className="flex-1 p-6 space-y-4">
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-gray-300 rounded w-20"></div>
                          <div className="h-6 bg-gray-300 rounded w-20"></div>
                        </div>
                        <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-sptc-red-100 to-sptc-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Home className="w-10 h-10 text-sptc-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {getText("searchPage.noAccommodationsTitle", language)}
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
                  {getText("searchPage.noAccommodationsDescription", language)}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold rounded-xl hover:from-sptc-red-700 hover:to-sptc-red-800 transition-all shadow-lg hover:shadow-xl"
                >
                  {getText("searchPage.backToHome", language)}
                </Link>
              </div>
            ) : (
              /* Listing Cards */
              <div className="space-y-4">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    language={language}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    adults={adults}
                    children={children}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingCard({
  listing,
  language,
  checkIn,
  checkOut,
  adults,
  children,
}: {
  listing: Listing;
  language: string;
  checkIn?: string;
  checkOut?: string;
  adults?: string;
  children?: string;
}) {
  // Build query string with search params to pass to listing page
  const queryParams = new URLSearchParams();
  if (checkIn) queryParams.set("checkIn", checkIn);
  if (checkOut) queryParams.set("checkOut", checkOut);
  if (adults) queryParams.set("adults", adults);
  if (children) queryParams.set("children", children);
  const queryString = queryParams.toString();
  const listingUrl = `/listing/${listing.id}${queryString ? `?${queryString}` : ""}`;
  const imageUrl =
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80";

  // Prefer address field, fall back to city/region, then location
  const locationDisplay = listing.address
    || (listing.city ? `${listing.city}${listing.region ? `, ${listing.region}` : ""}` : "")
    || listing.location;

  const hostName = listing.host_profiles
    ? `${listing.host_profiles.first_name} ${listing.host_profiles.last_name}`
    : "Host";

  const isVerified = listing.host_profiles?.verification_status === "approved";

  const getTypeTranslation = (type: string) => {
    if (type === "country_house" || type === "Country House") return getText("searchPage.countryHouse", language);
    if (type === "cabin" || type === "Cabin") return getText("searchPage.cabin", language);
    if (type === "traditional_home" || type === "Traditional Home") return getText("searchPage.traditionalHome", language);
    if (type === "farm" || type === "Farm") return "Farm Stay";
    if (type === "villa" || type === "Villa") return "Villa";
    if (type === "apartment" || type === "Apartment") return "Apartment";
    return type || "Property";
  };

  // Get first 4 amenities to display
  const displayAmenities = listing.amenities?.slice(0, 4) || [];

  return (
    <Link href={listingUrl} className="block">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-80 h-64 md:h-auto relative flex-shrink-0">
            <img
              src={imageUrl}
              alt={listing.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {isVerified && (
              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-sptc-red shadow-md flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                {getText("searchPage.verifiedHost", language)}
              </div>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {getTypeTranslation(listing.property_type)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-sptc-red transition-colors">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{locationDisplay}</span>
                </div>
              </div>
              {listing.rating && (
                <div className="flex items-center gap-1 bg-sptc-red text-white px-3 py-1.5 rounded-xl">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">{listing.rating}</span>
                  {listing.reviews_count && (
                    <span className="text-xs opacity-90">
                      ({listing.reviews_count})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Amenities */}
            {displayAmenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {displayAmenities.map((amenity: string) => (
                  <span
                    key={amenity}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            )}

            {/* Details */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              {listing.bedrooms > 0 && (
                <span>{listing.bedrooms} {listing.bedrooms === 1 ? getText("searchPage.bedroom", language) : "bedrooms"}</span>
              )}
              {listing.bathrooms > 0 && (
                <span>{listing.bathrooms} {listing.bathrooms === 1 ? getText("searchPage.bathroom", language) : "bathrooms"}</span>
              )}
              {listing.max_guests > 0 && (
                <span>{getText("searchPage.upToGuests", language).replace("{count}", String(listing.max_guests))}</span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-end justify-between pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {getText("searchPage.hostedBy", language)} {hostName}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">
                    ${listing.price_per_night}
                  </span>
                  <span className="text-sm text-gray-600">/ {getText("searchPage.night", language)}</span>
                </div>
                <span className="mt-2 inline-block px-6 py-2 bg-gradient-to-r from-sptc-red to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                  {getText("searchPage.seeAvailability", language)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sptc-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
