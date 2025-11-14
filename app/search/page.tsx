"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/lib/text";

type Accommodation = {
  id: number;
  name: string;
  type: string;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  image: string;
  features: string[];
  host: string;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  isSuperhost?: boolean;
  freeBreakfast?: boolean;
  freeCancellation?: boolean;
};

export default function SearchResults() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const location = searchParams?.get("location") || "Fusagasugá";
  const checkIn = searchParams?.get("checkIn") || "";
  const checkOut = searchParams?.get("checkOut") || "";
  const adults = searchParams?.get("adults") || "2";
  const children = searchParams?.get("children") || "0";

  const [showMap, setShowMap] = useState(false);
  const [priceRange, setPriceRange] = useState([15, 200]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");

  // Mock data - replace with actual API call
  const accommodations: Accommodation[] = [
    {
      id: 1,
      name: "Coffee Farm Cottage",
      type: "Country House",
      location: "Fusagasugá",
      distance: "1.3 km from center",
      rating: 9.5,
      reviews: 107,
      price: 40,
      originalPrice: 50,
      image: "/images/placeholder-listing.jpg",
      features: ["Coffee tours", "Mountain view", "Kitchen", "Free parking"],
      host: "Maria Rodriguez",
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      isSuperhost: true,
      freeBreakfast: true,
      freeCancellation: true,
    },
    {
      id: 2,
      name: "Mountain View Cabin",
      type: "Cabin",
      location: "Fusagasugá",
      distance: "2.5 km from center",
      rating: 9.1,
      reviews: 91,
      price: 55,
      image: "/images/placeholder-listing-2.jpg",
      features: ["Mountain view", "Fireplace", "Hot tub", "Private"],
      host: "Carlos Gomez",
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      isSuperhost: true,
      freeCancellation: false,
    },
    {
      id: 3,
      name: "Traditional Adobe House",
      type: "Traditional Home",
      location: "Fusagasugá",
      distance: "0.8 km from center",
      rating: 8.9,
      reviews: 64,
      price: 35,
      image: "/images/placeholder-listing-3.jpg",
      features: ["Traditional style", "Garden", "Kitchen", "Family friendly"],
      host: "Ana Martinez",
      bedrooms: 3,
      beds: 4,
      bathrooms: 2,
      freeBreakfast: true,
    },
  ];

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
                <MapPin className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">{location}</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                  {location}: {accommodations.length} {getText("searchPage.propertiesFound", language)}
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

            {/* Accommodation Cards */}
            <div className="space-y-4">
              {accommodations.map((accommodation) => (
                <AccommodationCard
                  key={accommodation.id}
                  accommodation={accommodation}
                  language={language}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccommodationCard({
  accommodation,
  language,
}: {
  accommodation: Accommodation;
  language: string;
}) {
  const getTypeTranslation = (type: string) => {
    if (type === "Country House") return getText("searchPage.countryHouse", language);
    if (type === "Cabin") return getText("searchPage.cabin", language);
    if (type === "Traditional Home") return getText("searchPage.traditionalHome", language);
    return type;
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-80 h-64 md:h-auto relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <Home className="w-16 h-16 text-gray-400" />
          </div>
          {accommodation.isSuperhost && (
            <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-sptc-red shadow-md flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              {getText("searchPage.superhost", language)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {getTypeTranslation(accommodation.type)}
                </span>
                {accommodation.freeCancellation && (
                  <span className="text-xs font-semibold text-green-600">
                    {getText("searchPage.freeCancellation", language)}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-sptc-red transition-colors">
                {accommodation.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{accommodation.distance.replace("from center", getText("searchPage.fromCenter", language))}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-sptc-red text-white px-3 py-1.5 rounded-xl">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold">{accommodation.rating}</span>
              <span className="text-xs opacity-90">
                ({accommodation.reviews})
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {accommodation.features.map((feature) => (
              <span
                key={feature}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            {accommodation.bedrooms && (
              <span>{accommodation.bedrooms} {getText("searchPage.bedroom", language)}</span>
            )}
            {accommodation.beds && <span>{accommodation.beds} {getText("searchPage.bed", language)}</span>}
            {accommodation.bathrooms && (
              <span>{accommodation.bathrooms} {getText("searchPage.bathroom", language)}</span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {getText("searchPage.hostedBy", language)} {accommodation.host}
              </p>
              {accommodation.freeBreakfast && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                  <Utensils className="w-3 h-3" />
                  {getText("searchPage.breakfastIncluded", language)}
                </span>
              )}
            </div>
            <div className="text-right">
              {accommodation.originalPrice && (
                <span className="text-sm text-gray-500 line-through block">
                  ${accommodation.originalPrice}
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">
                  ${accommodation.price}
                </span>
                <span className="text-sm text-gray-600">/ {getText("searchPage.night", language)}</span>
              </div>
              <button className="mt-2 px-6 py-2 bg-gradient-to-r from-sptc-red to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                {getText("searchPage.seeAvailability", language)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
