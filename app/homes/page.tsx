"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, MapPin, Star, Heart, Users, Bed, Bath, Wifi, Waves, UtensilsCrossed, Car } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/lib/text";

export default function HomesPage() {
  const { language } = useLanguage();
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const amenities = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "kitchen", label: "Kitchen", icon: UtensilsCrossed },
    { id: "parking", label: "Parking", icon: Car },
    { id: "pool", label: "Pool", icon: Waves },
  ];

  const properties = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1602391833977-358a52198938?w=800&q=80",
      title: "Luxury Villa with Pool",
      location: "Cala Jondal, Ibiza",
      price: 450,
      rating: 4.9,
      reviews: 127,
      beds: 4,
      baths: 3,
      guests: 8,
      type: "villa",
      amenities: ["wifi", "kitchen", "pool", "parking"],
      host: {
        name: "María",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
        verified: true,
      },
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      title: "Ibiza Town Penthouse",
      location: "Ibiza Town, Ibiza",
      price: 280,
      rating: 4.8,
      reviews: 89,
      beds: 2,
      baths: 2,
      guests: 4,
      type: "apartment",
      amenities: ["wifi", "kitchen"],
      host: {
        name: "Carlos",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
        verified: true,
      },
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      title: "Traditional Finca",
      location: "Santa Gertrudis, Ibiza",
      price: 320,
      rating: 5.0,
      reviews: 203,
      beds: 5,
      baths: 3,
      guests: 10,
      type: "finca",
      amenities: ["wifi", "kitchen", "parking", "pool"],
      host: {
        name: "Ana",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
        verified: true,
      },
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      title: "Beachfront Apartment",
      location: "Playa d'en Bossa, Ibiza",
      price: 195,
      rating: 4.9,
      reviews: 156,
      beds: 2,
      baths: 1,
      guests: 4,
      type: "apartment",
      amenities: ["wifi", "kitchen"],
      host: {
        name: "Diego",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
        verified: true,
      },
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
      title: "San Antonio Party Pad",
      location: "San Antonio, Ibiza",
      price: 150,
      rating: 4.7,
      reviews: 64,
      beds: 3,
      baths: 2,
      guests: 6,
      type: "apartment",
      amenities: ["wifi", "kitchen", "parking"],
      host: {
        name: "Laura",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
        verified: true,
      },
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&q=80",
      title: "Es Cubells Cliff House",
      location: "Es Cubells, Ibiza",
      price: 550,
      rating: 5.0,
      reviews: 178,
      beds: 6,
      baths: 4,
      guests: 12,
      type: "villa",
      amenities: ["wifi", "kitchen", "parking", "pool"],
      host: {
        name: "Pedro",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
        verified: true,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative pt-24 pb-16 px-4"
        style={{
          background: "radial-gradient(circle at top left, #F5EBE0 0%, #E8DDD0 40%, #DED0BD 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
              {getText("homesPage.title", language)} <span className="text-sptc-red-600">{getText("homesPage.titleHighlight", language)}</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {getText("homesPage.subtitle", language)}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={getText("homesPage.searchPlaceholder", language)}
                    className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sptc-red-500"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors flex items-center gap-2"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-semibold">{getText("homesPage.filters", language)}</span>
              </button>
              <button className="px-8 py-4 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold rounded-2xl hover:from-sptc-red-700 hover:to-sptc-red-800 transition-all shadow-lg flex items-center gap-2">
                <Search className="w-5 h-5" />
                <span>{getText("homesPage.search", language)}</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="max-w-4xl mx-auto mt-6 bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{getText("homesPage.filters", language)}</h3>

              {/* Property Type */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-4">{getText("homesPage.propertyType", language)}</label>
                <div className="flex flex-wrap gap-3">
                  {["all", "cottage", "villa", "finca", "lodge", "cabin", "hacienda"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        selectedType === type
                          ? "bg-sptc-red-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {getText(`homesPage.${type}`, language)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  {getText("homesPage.priceRange", language)}: ${priceRange[0]} - ${priceRange[1]} {getText("homesPage.perNight", language)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sptc-red-600"
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">{getText("homesPage.amenities", language)}</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {amenities.map((amenity) => {
                    const Icon = amenity.icon;
                    const isSelected = selectedAmenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity.id));
                          } else {
                            setSelectedAmenities([...selectedAmenities, amenity.id]);
                          }
                        }}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          isSelected
                            ? "border-sptc-red-600 bg-sptc-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${isSelected ? "text-sptc-red-600" : "text-gray-600"}`} />
                        <span className={`text-sm font-semibold ${isSelected ? "text-sptc-red-600" : "text-gray-700"}`}>
                          {amenity.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 px-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {properties.length} {getText("homesPage.staysIn", language)}
              </h2>
              <p className="text-gray-600">{getText("homesPage.verifiedAccommodations", language)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link href={`/homes/${property.id}`} key={property.id}>
                <div className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Heart className="w-5 h-5 text-gray-700" />
                    </button>
                    {property.host.verified && (
                      <div className="absolute top-4 left-4 bg-sptc-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {getText("homesPage.verifiedHost", language)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Host */}
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={property.host.image}
                        alt={property.host.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{getText("homesPage.hostedBy", language)} {property.host.name}</p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                    <p className="text-gray-600 mb-4 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {property.location}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {property.guests} {getText("homesPage.guests", language)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" /> {property.beds} {getText("homesPage.beds", language)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4" /> {property.baths} {getText("homesPage.baths", language)}
                      </span>
                    </div>

                    {/* Price and Rating */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">${property.price}</span>
                        <span className="text-gray-600"> / {getText("homesPage.night", language)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-current text-sptc-yellow-500" />
                        <span className="font-bold text-gray-900">{property.rating}</span>
                        <span className="text-gray-600">({property.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {getText("homesPage.cantFind", language)}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {getText("homesPage.contactHelp", language)}
          </p>
          <button className="bg-white text-sptc-red-600 font-bold text-lg px-12 py-5 rounded-2xl hover:bg-gray-100 transition-all shadow-2xl">
            {getText("homesPage.getInTouch", language)}
          </button>
        </div>
      </section>
    </div>
  );
}
