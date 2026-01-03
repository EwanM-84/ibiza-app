"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Music,
  MapPin,
  Star,
  Clock,
  Users,
  Sparkles,
  Filter,
  Search,
  ChevronRight,
  Zap,
  Crown,
  Flame
} from "lucide-react";

// Comprehensive club data
const clubs = [
  {
    id: 1,
    name: "Ushuaïa Ibiza",
    slug: "ushuaia",
    tagline: "The Open Air Capital of the World",
    description: "The world's most famous open-air club, featuring the biggest names in electronic music against the stunning backdrop of Playa d'en Bossa beach. Home to legendary residencies from David Guetta, Martin Garrix, and Calvin Harris.",
    location: "Playa d'en Bossa",
    rating: 4.9,
    reviews: 12847,
    capacity: 5000,
    openingHours: "16:00 - 00:00",
    priceRange: "€€€€",
    musicStyle: ["House", "EDM", "Commercial"],
    features: ["Open Air", "Pool Party", "VIP Tables", "Hotel"],
    image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80",
    featured: true,
    badge: "Legendary",
    residencies: ["David Guetta", "Martin Garrix", "Kygo", "Calvin Harris"],
    upcomingEvents: 24,
    avgTicketPrice: "€70-150"
  },
  {
    id: 2,
    name: "Pacha Ibiza",
    slug: "pacha",
    tagline: "Where Legends Are Born",
    description: "The iconic cherry logo has represented Ibiza's nightlife since 1973. Pacha is not just a club—it's a lifestyle. Five decades of legendary parties, world-class DJs, and unforgettable nights in the heart of Ibiza Town.",
    location: "Ibiza Town",
    rating: 4.8,
    reviews: 15632,
    capacity: 3000,
    openingHours: "23:00 - 07:00",
    priceRange: "€€€€",
    musicStyle: ["House", "Tech House", "Deep House"],
    features: ["Indoor", "Multiple Rooms", "VIP Area", "Restaurant"],
    image: "https://images.unsplash.com/photo-1571266028243-d220c6a67d70?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
    featured: true,
    badge: "Iconic",
    residencies: ["Solomun", "Marco Carola", "Hot Since 82"],
    upcomingEvents: 18,
    avgTicketPrice: "€60-120"
  },
  {
    id: 3,
    name: "Hï Ibiza",
    slug: "hi-ibiza",
    tagline: "The New Home of Music",
    description: "Built on the legendary foundation of Space Ibiza, Hï represents the future of clubbing. State-of-the-art sound systems, immersive lighting, and the world's best underground DJs come together in this temple of electronic music.",
    location: "Playa d'en Bossa",
    rating: 4.9,
    reviews: 9821,
    capacity: 5000,
    openingHours: "00:00 - 06:00",
    priceRange: "€€€€",
    musicStyle: ["Tech House", "Techno", "Progressive"],
    features: ["Indoor", "Theatre", "Club Room", "Wild Corner"],
    image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80",
    featured: true,
    badge: "Premium",
    residencies: ["Black Coffee", "Fisher", "Glitterbox", "Tale Of Us"],
    upcomingEvents: 22,
    avgTicketPrice: "€60-130"
  },
  {
    id: 4,
    name: "Amnesia",
    slug: "amnesia",
    tagline: "The Temple of Electronic Music",
    description: "Since 1976, Amnesia has been the beating heart of Ibiza's underground scene. Famous for its legendary foam parties and sunrise moments, the club's iconic terrace has witnessed some of the most magical moments in dance music history.",
    location: "San Rafael",
    rating: 4.8,
    reviews: 11234,
    capacity: 5000,
    openingHours: "00:00 - 08:00",
    priceRange: "€€€",
    musicStyle: ["Techno", "Tech House", "Trance"],
    features: ["Terrace", "Main Room", "Foam Party", "Sunrise Sets"],
    image: "https://images.unsplash.com/photo-1571266028243-d220c6a67d70?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
    featured: true,
    badge: "Heritage",
    residencies: ["Cocoon", "Pyramid", "Together", "Elrow"],
    upcomingEvents: 20,
    avgTicketPrice: "€50-100"
  },
  {
    id: 5,
    name: "DC-10",
    slug: "dc10",
    tagline: "The Underground Kingdom",
    description: "Next to the airport runway, DC-10 is where the real party people go. Raw, unfiltered, and utterly authentic—this is Ibiza at its most pure. Monday's Circoloco is the stuff of legend, attracting the world's best underground selectors.",
    location: "Las Salinas",
    rating: 4.7,
    reviews: 8456,
    capacity: 1500,
    openingHours: "16:00 - 06:00",
    priceRange: "€€",
    musicStyle: ["Techno", "Minimal", "Underground"],
    features: ["Open Air", "Garden", "Terrace", "Raw Vibes"],
    image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80",
    featured: false,
    badge: "Underground",
    residencies: ["Circoloco", "Paradise"],
    upcomingEvents: 12,
    avgTicketPrice: "€40-80"
  },
  {
    id: 6,
    name: "Privilege",
    slug: "privilege",
    tagline: "The World's Largest Club",
    description: "Guinness World Record holder for the largest nightclub on the planet. With a capacity of 10,000, Privilege is where epic meets enormous. The iconic swimming pool stage and massive main room create experiences unlike anywhere else.",
    location: "San Rafael",
    rating: 4.6,
    reviews: 7892,
    capacity: 10000,
    openingHours: "00:00 - 07:00",
    priceRange: "€€€",
    musicStyle: ["EDM", "House", "Trance"],
    features: ["Pool Stage", "Dome Room", "Vista Club", "Massive"],
    image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1571266028243-d220c6a67d70?w=1200&q=80",
    featured: false,
    badge: "Epic",
    residencies: ["SuperMartXé", "Resistance"],
    upcomingEvents: 15,
    avgTicketPrice: "€45-90"
  },
  {
    id: 7,
    name: "Eden",
    slug: "eden",
    tagline: "San Antonio's Premier Venue",
    description: "Completely renovated and reborn, Eden has become the go-to club for world-class house and techno in San Antonio. Modern sound system, intimate vibes, and a lineup that rivals the island's biggest venues.",
    location: "San Antonio",
    rating: 4.5,
    reviews: 5234,
    capacity: 2500,
    openingHours: "00:00 - 06:00",
    priceRange: "€€",
    musicStyle: ["House", "Tech House", "Disco"],
    features: ["Indoor", "Modern Sound", "Laser Show", "Intimate"],
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80",
    featured: false,
    badge: null,
    residencies: ["Defected", "Toolroom", "Shine"],
    upcomingEvents: 16,
    avgTicketPrice: "€35-70"
  },
  {
    id: 8,
    name: "Es Paradis",
    slug: "es-paradis",
    tagline: "The Pyramid of Pleasure",
    description: "San Antonio's iconic pyramid-shaped club is famous for its legendary water parties. When the ceiling opens and thousands of liters of water cascade down, you'll understand why Es Paradis is truly paradise.",
    location: "San Antonio",
    rating: 4.4,
    reviews: 4567,
    capacity: 2000,
    openingHours: "00:00 - 06:00",
    priceRange: "€€",
    musicStyle: ["Commercial", "House", "Dance"],
    features: ["Water Party", "Pyramid Design", "Pool", "Retractable Roof"],
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
    featured: false,
    badge: null,
    residencies: ["Fiesta del Agua", "Judgement Sundays"],
    upcomingEvents: 14,
    avgTicketPrice: "€30-60"
  },
  {
    id: 9,
    name: "Ibiza Rocks Hotel",
    slug: "ibiza-rocks",
    tagline: "Pool Party Pioneers",
    description: "The original pool party destination. Ibiza Rocks Hotel brings live music and DJs to the most epic pool setting imaginable. From Craig David to Rudimental, the biggest names play right by the pool.",
    location: "San Antonio",
    rating: 4.6,
    reviews: 6789,
    capacity: 3000,
    openingHours: "12:00 - 00:00",
    priceRange: "€€€",
    musicStyle: ["Pop", "R&B", "House", "Live Music"],
    features: ["Pool Party", "Hotel", "Live Acts", "Day Event"],
    image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80",
    featured: false,
    badge: "Pool Party",
    residencies: ["Craig David TS5", "Rudimental"],
    upcomingEvents: 20,
    avgTicketPrice: "€35-75"
  },
  {
    id: 10,
    name: "Benimussa Park",
    slug: "benimussa",
    tagline: "The Secret Garden",
    description: "Hidden in the hills, Benimussa Park is where magic happens. The intimate outdoor venue hosts boutique parties and secret raves, surrounded by nature and filled with the most discerning music lovers.",
    location: "San José",
    rating: 4.7,
    reviews: 3456,
    capacity: 1000,
    openingHours: "18:00 - 04:00",
    priceRange: "€€",
    musicStyle: ["Techno", "House", "Afro House"],
    features: ["Outdoor", "Natural Setting", "Intimate", "Boutique"],
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80",
    featured: false,
    badge: "Secret",
    residencies: ["WooMooN", "Storytellers"],
    upcomingEvents: 8,
    avgTicketPrice: "€40-80"
  },
  {
    id: 11,
    name: "Octan",
    slug: "octan",
    tagline: "Underground Excellence",
    description: "The intimate underground club that serious house heads call home. Octan delivers pure quality over quantity with carefully curated lineups and a crowd that really knows their music.",
    location: "Ibiza Town",
    rating: 4.6,
    reviews: 2345,
    capacity: 500,
    openingHours: "00:00 - 06:00",
    priceRange: "€€",
    musicStyle: ["House", "Deep House", "Minimal"],
    features: ["Intimate", "Underground", "Quality Sound", "Late Night"],
    image: "https://images.unsplash.com/photo-1571266028243-d220c6a67d70?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
    featured: false,
    badge: "Boutique",
    residencies: ["Underground Sound"],
    upcomingEvents: 10,
    avgTicketPrice: "€25-50"
  },
  {
    id: 12,
    name: "Cova Santa",
    slug: "cova-santa",
    tagline: "Music Meets Gastronomy",
    description: "Where world-class dining meets underground beats. Cova Santa offers a unique concept: exceptional Mediterranean cuisine followed by intimate DJ sets in a stunning cave-like venue. The ultimate Ibiza experience.",
    location: "San José",
    rating: 4.8,
    reviews: 4123,
    capacity: 800,
    openingHours: "19:00 - 04:00",
    priceRange: "€€€",
    musicStyle: ["Deep House", "Balearic", "World Music"],
    features: ["Restaurant", "Cave Venue", "Dinner & Dancing", "Boutique"],
    image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80",
    featured: false,
    badge: "Unique",
    residencies: ["WooMooN"],
    upcomingEvents: 12,
    avgTicketPrice: "€60-120"
  }
];

const filters = ["All", "Legendary", "Pool Party", "Underground", "San Antonio", "Ibiza Town", "Playa d'en Bossa"];

export default function ClubsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         club.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         club.musicStyle.some(style => style.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeFilter === "All") return matchesSearch;
    if (activeFilter === "Legendary") return matchesSearch && club.featured;
    if (activeFilter === "Pool Party") return matchesSearch && club.features.some(f => f.toLowerCase().includes("pool"));
    if (activeFilter === "Underground") return matchesSearch && club.musicStyle.includes("Techno");
    return matchesSearch && club.location === activeFilter;
  });

  const featuredClubs = clubs.filter(c => c.featured);

  return (
    <div className="min-h-screen bg-ibiza-night-900">
      {/* Hero Section */}
      <section className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ibiza-night-900/60 via-ibiza-night-900/40 to-ibiza-night-900" />
          <div className="absolute inset-0 bg-gradient-to-r from-ibiza-pink-500/20 via-transparent to-ibiza-blue-500/20" />
        </div>

        {/* Animated Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-ibiza-pink-500/30 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-ibiza-blue-500/30 rounded-full blur-[120px] animate-pulse-slow delay-1000" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-ibiza-pink-500/20 backdrop-blur-sm border border-ibiza-pink-500/30 rounded-full px-4 py-2 mb-6">
            <Music className="w-4 h-4 text-ibiza-pink-400" />
            <span className="text-ibiza-pink-400 text-sm font-medium">World-Famous Nightlife</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6">
            Clubs & <span className="text-gradient">Nightlife</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-8">
            From legendary superclubs to intimate underground venues, discover where the world's best DJs play until sunrise
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-12">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">12+</p>
              <p className="text-xs sm:text-sm text-white/50">Legendary Clubs</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">200+</p>
              <p className="text-xs sm:text-sm text-white/50">Events Per Week</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">06:00</p>
              <p className="text-xs sm:text-sm text-white/50">Sunrise Sets</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-white/50">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="sticky top-16 sm:top-20 z-30 bg-ibiza-night-900/95 backdrop-blur-xl border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search clubs, locations, music styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-ibiza-blue-500/50 focus:ring-2 focus:ring-ibiza-blue-500/20"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-4 h-4 text-white/50 flex-shrink-0" />
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter
                    ? "bg-ibiza-blue-500 text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Clubs */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-8">
            <Crown className="w-6 h-6 text-ibiza-gold" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Legendary Venues</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredClubs.slice(0, 4).map((club, index) => (
              <Link
                key={club.id}
                href={`/clubs/${club.slug}`}
                className="group relative overflow-hidden rounded-3xl aspect-[16/10] sm:aspect-[16/9]"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${club.heroImage}')` }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ibiza-night-900 via-ibiza-night-900/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-ibiza-night-900/80 via-transparent to-transparent" />

                {/* Badge */}
                {club.badge && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-ibiza-gold/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <Flame className="w-3.5 h-3.5 text-ibiza-night-900" />
                    <span className="text-xs font-bold text-ibiza-night-900">{club.badge}</span>
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-ibiza-blue-400" />
                    <span className="text-sm text-ibiza-blue-400">{club.location}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-ibiza-blue-400 transition-colors">
                    {club.name}
                  </h3>

                  <p className="text-white/60 text-sm mb-4 line-clamp-2">{club.tagline}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-ibiza-gold fill-ibiza-gold" />
                        <span className="text-white font-semibold">{club.rating}</span>
                        <span className="text-white/50 text-sm">({club.reviews.toLocaleString()})</span>
                      </div>
                      <span className="text-white/30">•</span>
                      <span className="text-ibiza-cyan-400 text-sm font-medium">{club.upcomingEvents} events</span>
                    </div>

                    <div className="flex items-center gap-2 text-white/70 group-hover:text-ibiza-blue-400 transition-colors">
                      <span className="text-sm font-medium">Explore</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Clubs Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">All Clubs</h2>
            <span className="text-white/50">{filteredClubs.length} venues</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map(club => (
              <Link
                key={club.id}
                href={`/clubs/${club.slug}`}
                className="group glass-card rounded-2xl overflow-hidden hover-lift"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${club.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ibiza-night-900 to-transparent" />

                  {/* Badge */}
                  {club.badge && (
                    <div className="absolute top-3 left-3 bg-ibiza-night-900/80 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-xs font-semibold text-ibiza-blue-400">{club.badge}</span>
                    </div>
                  )}

                  {/* Price Range */}
                  <div className="absolute top-3 right-3 bg-ibiza-night-900/80 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-xs font-semibold text-ibiza-gold">{club.priceRange}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-ibiza-blue-400" />
                    <span className="text-xs text-ibiza-blue-400">{club.location}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-ibiza-blue-400 transition-colors">
                    {club.name}
                  </h3>

                  <p className="text-white/50 text-sm mb-4 line-clamp-2">{club.tagline}</p>

                  {/* Music Styles */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {club.musicStyle.slice(0, 3).map(style => (
                      <span
                        key={style}
                        className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/70"
                      >
                        {style}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-ibiza-gold fill-ibiza-gold" />
                      <span className="text-white font-semibold text-sm">{club.rating}</span>
                      <span className="text-white/40 text-xs">({club.reviews.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-white/40" />
                      <span className="text-white/50 text-xs">{club.openingHours}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredClubs.length === 0 && (
            <div className="text-center py-16">
              <Music className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No clubs found</h3>
              <p className="text-white/50">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-ibiza-pink-500/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-ibiza-blue-500/20 rounded-full blur-[80px]" />

            <div className="relative">
              <Sparkles className="w-10 h-10 text-ibiza-blue-400 mx-auto mb-6" />
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                Ready to Party?
              </h2>
              <p className="text-white/60 mb-8 max-w-xl mx-auto">
                Get exclusive access to VIP tables, skip-the-line tickets, and special event packages
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/events" className="btn-party">
                  <Zap className="w-4 h-4" />
                  <span>View Events</span>
                </Link>
                <Link href="/experiences" className="btn-secondary">
                  <span>VIP Experiences</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
