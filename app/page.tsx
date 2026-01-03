"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search, Star, Heart, Play, Music, Sun, MapPin, Calendar,
  Sparkles, ArrowRight, Clock, Ticket, ChevronRight,
  Waves, PartyPopper, Headphones, Sunset, Anchor, Utensils,
  Camera, Bike, Ship
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// ============================================
// IBIZA VENUE DATA
// ============================================

const featuredClubs = [
  {
    id: 1,
    name: "Ushuaïa Ibiza",
    type: "Open-Air Club",
    image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
    rating: 4.9,
    reviews: 12847,
    tags: ["Pool Party", "Daytime", "World-Class DJs"],
    price: "€€€€",
    location: "Playa d'en Bossa",
    isLive: true,
    description: "The #1 open-air club in the world. Legendary pool parties with the biggest names in dance music.",
  },
  {
    id: 2,
    name: "Pacha Ibiza",
    type: "Legendary Nightclub",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    rating: 4.8,
    reviews: 18421,
    tags: ["Iconic", "House Music", "Cherry Logo"],
    price: "€€€€",
    location: "Ibiza Town",
    description: "Since 1973. The most iconic club on the island with its famous cherry logo.",
  },
  {
    id: 3,
    name: "Hï Ibiza",
    type: "Super Club",
    image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&q=80",
    rating: 4.9,
    reviews: 9156,
    tags: ["State-of-the-Art", "Theatre", "Black Coffee"],
    price: "€€€€",
    location: "Playa d'en Bossa",
    description: "The newest super club. Cutting-edge sound and production in the former Space venue.",
  },
  {
    id: 4,
    name: "Amnesia",
    type: "Legendary Nightclub",
    image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80",
    rating: 4.7,
    reviews: 15893,
    tags: ["Techno", "Foam Party", "Terrace"],
    price: "€€€",
    location: "San Rafael",
    description: "Home of the legendary foam party. Two rooms of pure electronic music since 1970.",
  },
  {
    id: 5,
    name: "DC-10",
    type: "Underground Club",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    rating: 4.8,
    reviews: 7234,
    tags: ["Circoloco", "Techno", "Authentic"],
    price: "€€",
    location: "Airport Road",
    description: "The underground favourite. Home to Circoloco since 1999. Pure, raw techno.",
  },
  {
    id: 6,
    name: "Privilege",
    type: "World's Largest Club",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    rating: 4.5,
    reviews: 8567,
    tags: ["Massive", "Main Room", "Swimming Pool"],
    price: "€€€",
    location: "San Rafael",
    description: "Guinness World Record holder. 10,000 capacity with a swimming pool in the main room.",
  },
];

const beachClubs = [
  {
    id: 1,
    name: "Café del Mar",
    type: "Sunset Bar",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    rating: 4.9,
    reviews: 24893,
    tags: ["Iconic Sunsets", "Chill Out", "Since 1980"],
    price: "€€€",
    location: "San Antonio",
    description: "The birthplace of the Ibiza sunset ritual. World-famous chill-out compilations.",
  },
  {
    id: 2,
    name: "Blue Marlin",
    type: "Luxury Beach Club",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
    rating: 4.8,
    reviews: 11234,
    tags: ["VIP", "Champagne", "Celebrity Spot"],
    price: "€€€€",
    location: "Cala Jondal",
    description: "Where the jet-set parties. Luxury loungers, world-class DJs, and Cristal on ice.",
  },
  {
    id: 3,
    name: "Nassau Beach Club",
    type: "Beach Club & Restaurant",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    rating: 4.7,
    reviews: 8765,
    tags: ["Beachfront", "Fine Dining", "Cocktails"],
    price: "€€€",
    location: "Playa d'en Bossa",
    description: "Elegant beachfront dining with live DJs and stunning Mediterranean views.",
  },
  {
    id: 4,
    name: "Experimental Beach",
    type: "Boutique Beach Club",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    rating: 4.9,
    reviews: 5432,
    tags: ["Hidden Gem", "Cocktails", "Bohemian"],
    price: "€€€€",
    location: "Cap des Falcó",
    description: "A secret paradise. Bohemian luxury with craft cocktails and breathtaking cliff views.",
  },
  {
    id: 5,
    name: "Nikki Beach",
    type: "International Beach Club",
    image: "https://images.unsplash.com/photo-1520942702018-0862200e6873?w=800&q=80",
    rating: 4.6,
    reviews: 9876,
    tags: ["Pool", "Champagne Spray", "White Party"],
    price: "€€€€",
    location: "Santa Eulalia",
    description: "The global beach club brand. Famous white parties and champagne-fueled pool sessions.",
  },
  {
    id: 6,
    name: "Sunset Ashram",
    type: "Bohemian Beach Bar",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
    rating: 4.8,
    reviews: 7654,
    tags: ["Boho Vibes", "Live Music", "Organic"],
    price: "€€",
    location: "Cala Conta",
    description: "Barefoot luxury meets hippie spirit. Organic cuisine, live acoustic sets, and magic sunsets.",
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "David Guetta - F*** Me I'm Famous",
    venue: "Ushuaïa Ibiza",
    date: "Every Friday",
    time: "16:00 - 00:00",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    price: "€70",
    soldOut: false,
    dj: "David Guetta",
    genre: "EDM / House",
  },
  {
    id: 2,
    title: "Elrow - Psychedelic Trip",
    venue: "Amnesia",
    date: "Every Saturday",
    time: "23:00 - 07:00",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    price: "€55",
    soldOut: false,
    dj: "Various Artists",
    genre: "Tech House",
  },
  {
    id: 3,
    title: "Black Coffee Residency",
    venue: "Hï Ibiza",
    date: "Every Sunday",
    time: "22:00 - 06:00",
    image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80",
    price: "€50",
    soldOut: true,
    dj: "Black Coffee",
    genre: "Afro House",
  },
  {
    id: 4,
    title: "Fisher - Catch & Release",
    venue: "Ushuaïa Ibiza",
    date: "Every Tuesday",
    time: "16:00 - 00:00",
    image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
    price: "€65",
    soldOut: false,
    dj: "Fisher",
    genre: "Tech House",
  },
  {
    id: 5,
    title: "Circoloco",
    venue: "DC-10",
    date: "Every Monday",
    time: "16:00 - 06:00",
    image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&q=80",
    price: "€45",
    soldOut: false,
    dj: "Seth Troxler, The Martinez Brothers",
    genre: "Techno / House",
  },
  {
    id: 6,
    title: "Calvin Harris",
    venue: "Ushuaïa Ibiza",
    date: "Every Thursday",
    time: "17:00 - 00:00",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    price: "€80",
    soldOut: true,
    dj: "Calvin Harris",
    genre: "EDM / Pop",
  },
];

const experiences = [
  {
    id: 1,
    title: "Sunset Boat Party",
    category: "Boat Party",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    rating: 4.9,
    reviews: 2341,
    price: "€89",
    duration: "4 hours",
    icon: Ship,
    description: "Sail into the sunset with open bar, live DJ, and swimming stops at secret coves.",
  },
  {
    id: 2,
    title: "VIP Club Tour",
    category: "Nightlife",
    image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
    rating: 4.8,
    reviews: 1876,
    price: "€199",
    duration: "6 hours",
    icon: Sparkles,
    description: "Skip the lines at Pacha, Amnesia, and Hï Ibiza with VIP host and free drinks.",
  },
  {
    id: 3,
    title: "Hidden Beaches Jeep Tour",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    rating: 4.9,
    reviews: 987,
    price: "€75",
    duration: "5 hours",
    icon: Bike,
    description: "Explore secret beaches and cliff jumping spots in a 4x4 adventure.",
  },
  {
    id: 4,
    title: "Formentera Day Trip",
    category: "Island Hopping",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    rating: 4.9,
    reviews: 3456,
    price: "€65",
    duration: "Full Day",
    icon: Anchor,
    description: "Ferry to the paradise island with crystal-clear waters and white sand beaches.",
  },
  {
    id: 5,
    title: "Paella & Sangria Experience",
    category: "Food & Drink",
    image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&q=80",
    rating: 4.7,
    reviews: 654,
    price: "€55",
    duration: "3 hours",
    icon: Utensils,
    description: "Learn to cook authentic Spanish paella with a local chef in a farmhouse.",
  },
  {
    id: 6,
    title: "Sunrise Yoga & Beach",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    rating: 4.8,
    reviews: 432,
    price: "€35",
    duration: "2 hours",
    icon: Sun,
    description: "Start your day with oceanfront yoga followed by fresh smoothies and fruit.",
  },
];

export default function Home() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All", icon: Sparkles },
    { id: "clubs", label: "Clubs", icon: Music },
    { id: "beaches", label: "Beach Clubs", icon: Sun },
    { id: "events", label: "Events", icon: Calendar },
    { id: "experiences", label: "Experiences", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-ibiza-night-500">
      {/* HERO SECTION */}
      <section className="relative min-h-[100dvh] sm:min-h-[90vh] flex items-center overflow-hidden pt-0">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center animate-slow-pan"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ibiza-night-900/80 via-ibiza-night-900/60 to-ibiza-night-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-ibiza-night-900/50 via-transparent to-ibiza-night-900/50" />
          <div className="absolute inset-0 bg-mesh opacity-60" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-ibiza-blue-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ibiza-purple-500/20 rounded-full blur-3xl animate-float-delayed" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-ibiza-pink-500 animate-pulse" />
              <span className="text-sm font-medium text-white/90">Season 2026 Now Live</span>
            </div>

            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-4 sm:mb-6 animate-slide-up">
              <span className="text-white">Unlock the</span>
              <br />
              <span className="text-gradient-party">Magic of Ibiza</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-2xl mb-8 sm:mb-10 leading-relaxed animate-slide-up font-light">
              Discover world-famous clubs, stunning beach parties, and unforgettable
              experiences on the White Isle.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl animate-slide-up">
              <div className="search-bar p-2 sm:p-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex-1 flex items-center gap-3 px-3 sm:px-4">
                    <Search className="w-5 h-5 text-ibiza-blue-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search clubs, events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40 text-base sm:text-lg py-3 sm:py-4 min-w-0"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                  <button className="btn-primary flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 w-full sm:w-auto">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                <span className="text-white/40 text-sm whitespace-nowrap flex-shrink-0">Popular:</span>
                <QuickLink>Ushuaïa</QuickLink>
                <QuickLink>Pacha</QuickLink>
                <QuickLink>DC-10</QuickLink>
                <QuickLink>Boat Parties</QuickLink>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-bounce-soft">
            <span className="text-white/40 text-sm">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-ibiza-blue-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <section className="sticky top-16 sm:top-20 z-30 bg-ibiza-night-500/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 sm:py-4 overflow-x-auto no-scrollbar scroll-snap-x -mx-3 px-3 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 scroll-snap-start touch-target haptic-tap ${
                  activeCategory === cat.id
                    ? "bg-ibiza-blue-500 text-white shadow-glow-blue"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white active:bg-white/15"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CLUBS */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
                Legendary <span className="text-gradient">Clubs</span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg">Where the world comes to dance</p>
            </div>
            <Link href="/clubs" className="hidden sm:flex items-center gap-2 text-ibiza-blue-400 hover:text-ibiza-blue-300 transition-colors font-medium">
              View all clubs
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredClubs.slice(0, 6).map((club, index) => (
              <VenueCard key={club.id} venue={club} index={index} />
            ))}
          </div>

          <Link href="/clubs" className="sm:hidden flex items-center justify-center gap-2 mt-8 text-ibiza-blue-400 font-medium">
            View all clubs
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* LIVE NOW BANNER */}
      <section className="py-6 sm:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1920&q=80')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ibiza-pink-600/90 via-ibiza-purple-600/90 to-ibiza-blue-600/90" />

            <div className="relative p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-4 sm:gap-6 text-center md:text-left">
                <div className="relative hidden sm:block">
                  <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <Play className="w-8 sm:w-10 h-8 sm:h-10 text-white fill-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 badge-live text-xs">LIVE</div>
                </div>
                <div>
                  <p className="text-white/70 text-sm font-medium mb-1">Happening Now at Ushuaïa</p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">David Guetta - F*** Me I'm Famous</h3>
                  <p className="text-white/80 mt-1 text-sm sm:text-base">15,000+ watching live</p>
                </div>
              </div>
              <button className="btn-secondary bg-white/20 border-white/30 hover:bg-white/30 flex items-center gap-2 w-full md:w-auto justify-center">
                <Play className="w-5 h-5" />
                Watch Live
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BEACH CLUBS */}
      <section className="py-16 sm:py-20 px-4 bg-ibiza-night-400/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <Sun className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-400" />
                <span className="text-yellow-400 font-semibold uppercase tracking-wider text-xs sm:text-sm">Daytime Paradise</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
                Beach <span className="text-gradient-sunset">Clubs</span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg">Sun, sea, and world-class vibes</p>
            </div>
            <Link href="/beaches" className="hidden sm:flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors font-medium">
              All beach clubs
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {beachClubs.map((club, index) => (
              <BeachClubCard key={club.id} club={club} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-ibiza-pink-400" />
                <span className="text-ibiza-pink-400 font-semibold uppercase tracking-wider text-xs sm:text-sm">This Week</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
                Upcoming <span className="text-gradient-party">Events</span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg">Don't miss the hottest parties</p>
            </div>
            <Link href="/events" className="hidden sm:flex items-center gap-2 text-ibiza-pink-400 hover:text-ibiza-pink-300 transition-colors font-medium">
              All events
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {upcomingEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCES */}
      <section className="py-16 sm:py-20 px-4 bg-ibiza-night-400/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Unforgettable <span className="text-gradient">Experiences</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
              Beyond the clubs - boat parties, hidden beaches, and island adventures
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {experiences.map((exp, index) => (
              <ExperienceCard key={exp.id} experience={exp} index={index} />
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <Link href="/experiences" className="btn-primary inline-flex items-center gap-2">
              <span>Explore All Experiences</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard number="50+" label="World-Class Clubs" icon={Music} />
            <StatCard number="200+" label="Events Per Week" icon={Calendar} />
            <StatCard number="80+" label="Beach Clubs" icon={Sun} />
            <StatCard number="1M+" label="Visitors Yearly" icon={PartyPopper} />
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD CTA */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] glass-card-dark">
            <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-ibiza-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-ibiza-purple-500/20 rounded-full blur-3xl" />

            <div className="relative p-6 sm:p-8 md:p-16 grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ibiza-blue-500/20 border border-ibiza-blue-500/30 mb-4 sm:mb-6">
                  <Sparkles className="w-4 h-4 text-ibiza-blue-400" />
                  <span className="text-sm font-medium text-ibiza-blue-400">Coming Soon</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                  Get the <span className="text-gradient">Ibiza Unlocked</span> App
                </h2>

                <p className="text-white/60 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                  Exclusive deals, real-time event updates, skip-the-line access, and your
                  personal Ibiza concierge – all in your pocket.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button className="btn-primary flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs opacity-80">Download on the</div>
                      <div className="font-semibold">App Store</div>
                    </div>
                  </button>
                  <button className="btn-secondary flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs opacity-80">Get it on</div>
                      <div className="font-semibold">Google Play</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative flex justify-center">
                <div className="relative w-48 sm:w-64 h-[380px] sm:h-[500px]">
                  <div className="absolute inset-0 bg-ibiza-night-300 rounded-[2rem] sm:rounded-[3rem] border-4 border-ibiza-night-200 shadow-2xl overflow-hidden">
                    <div className="absolute inset-2 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-ibiza-blue-600 to-ibiza-purple-600">
                      <img
                        src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80"
                        alt="App Preview"
                        className="w-full h-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                        <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 backdrop-blur rounded-xl sm:rounded-2xl flex items-center justify-center mb-4">
                          <span className="text-xl sm:text-2xl font-bold">IU</span>
                        </div>
                        <p className="text-center text-xs sm:text-sm opacity-80">Your Ibiza Experience</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -inset-4 bg-ibiza-blue-500/30 rounded-[3rem] sm:rounded-[4rem] blur-2xl -z-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ibiza-night-600 border-t border-white/10 py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-ibiza-blue-400 to-ibiza-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-base sm:text-lg">IU</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Ibiza</h3>
                  <p className="text-[10px] sm:text-xs text-ibiza-blue-400 uppercase tracking-wider">Unlocked</p>
                </div>
              </div>
              <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
                Your gateway to the ultimate Ibiza experience. Discover, book, and live the magic.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Explore</h4>
              <ul className="space-y-2 sm:space-y-3">
                <FooterLink href="/clubs">Clubs</FooterLink>
                <FooterLink href="/beaches">Beach Clubs</FooterLink>
                <FooterLink href="/events">Events</FooterLink>
                <FooterLink href="/experiences">Experiences</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 sm:space-y-3">
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/careers">Careers</FooterLink>
                <FooterLink href="/press">Press</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2 sm:space-y-3">
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
                <FooterLink href="/cookies">Cookie Policy</FooterLink>
              </ul>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-xs sm:text-sm">
              © {new Date().getFullYear()} Ibiza Unlocked. All rights reserved.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <SocialLink href="#" label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </SocialLink>
              <SocialLink href="#" label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </SocialLink>
              <SocialLink href="#" label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </SocialLink>
              <SocialLink href="#" label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </SocialLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* --- Component Helpers --- */

function QuickLink({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0">
      {children}
    </button>
  );
}

function VenueCard({ venue, index }: { venue: any; index: number }) {
  return (
    <Link
      href={`/clubs/${venue.id}`}
      className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-ibiza-night-400 border border-white/10 hover:border-ibiza-blue-500/50 transition-all duration-500 block"
    >
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ibiza-night-500 via-transparent to-transparent" />

        {venue.isLive && (
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 badge-live text-xs">LIVE</div>
        )}

        <button className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-ibiza-night-500/80 backdrop-blur flex items-center justify-center text-white/70 hover:text-ibiza-pink-400 hover:bg-ibiza-night-500 transition-all">
          <Heart className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>

        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
          <span className="px-2 sm:px-3 py-1 rounded-full bg-ibiza-night-500/80 backdrop-blur text-white/80 text-xs font-medium">
            {venue.location}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-ibiza-blue-400 transition-colors">
              {venue.name}
            </h3>
            <p className="text-white/50 text-xs sm:text-sm">{venue.type}</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10">
            <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-semibold text-xs sm:text-sm">{venue.rating}</span>
          </div>
        </div>

        <p className="text-white/60 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{venue.description}</p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {venue.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="px-2 sm:px-3 py-1 rounded-full bg-white/5 text-white/60 text-[10px] sm:text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10">
          <span className="text-white/40 text-xs sm:text-sm">{venue.reviews.toLocaleString()} reviews</span>
          <span className="text-ibiza-blue-400 font-semibold text-sm">{venue.price}</span>
        </div>
      </div>
    </Link>
  );
}

function BeachClubCard({ club, index }: { club: any; index: number }) {
  return (
    <Link
      href={`/beaches/${club.id}`}
      className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-ibiza-night-400 border border-white/10 hover:border-yellow-500/50 transition-all duration-500 block"
    >
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={club.image}
          alt={club.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ibiza-night-500 via-transparent to-transparent" />

        <button className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-ibiza-night-500/80 backdrop-blur flex items-center justify-center text-white/70 hover:text-ibiza-pink-400 transition-all">
          <Heart className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>

        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex items-center gap-2">
          <Sun className="w-4 h-4 text-yellow-400" />
          <span className="text-white/90 text-xs sm:text-sm font-medium">{club.location}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
              {club.name}
            </h3>
            <p className="text-white/50 text-xs sm:text-sm">{club.type}</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10">
            <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-semibold text-xs sm:text-sm">{club.rating}</span>
          </div>
        </div>

        <p className="text-white/60 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{club.description}</p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {club.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="px-2 sm:px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400/80 text-[10px] sm:text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function EventCard({ event, index }: { event: any; index: number }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl glass-card hover:border-ibiza-pink-500/50 transition-all duration-500">
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ibiza-night-500 via-ibiza-night-500/50 to-transparent" />

        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-ibiza-night-500/90 backdrop-blur border border-white/10">
          <span className="text-white font-bold text-sm sm:text-base">{event.price}</span>
        </div>

        {event.soldOut && (
          <div className="absolute inset-0 bg-ibiza-night-900/80 flex items-center justify-center">
            <span className="text-white font-bold text-lg sm:text-xl">SOLD OUT</span>
          </div>
        )}

        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
          <span className="px-2 sm:px-3 py-1 rounded-full bg-ibiza-pink-500/20 border border-ibiza-pink-500/30 text-ibiza-pink-400 text-[10px] sm:text-xs font-bold">
            {event.genre}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-ibiza-pink-400 transition-colors line-clamp-1">
          {event.title}
        </h3>
        <p className="text-white/50 text-xs sm:text-sm mb-3 sm:mb-4">{event.venue}</p>

        <div className="flex items-center gap-3 sm:gap-4 text-white/60 text-xs sm:text-sm mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Calendar className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-ibiza-pink-400" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-ibiza-pink-400" />
            <span>{event.time}</span>
          </div>
        </div>

        {!event.soldOut && (
          <button className="w-full btn-party py-2.5 sm:py-3 text-xs sm:text-sm">
            <Ticket className="w-3.5 sm:w-4 h-3.5 sm:h-4 inline mr-2" />
            Get Tickets
          </button>
        )}
      </div>
    </div>
  );
}

function ExperienceCard({ experience, index }: { experience: any; index: number }) {
  const Icon = experience.icon;
  return (
    <Link
      href={`/experiences/${experience.id}`}
      className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-ibiza-night-400 border border-white/10 hover:border-ibiza-cyan-500/50 transition-all duration-500 block"
    >
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={experience.image}
          alt={experience.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ibiza-night-500 via-ibiza-night-500/30 to-transparent" />

        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-ibiza-cyan-500/20 backdrop-blur border border-ibiza-cyan-500/30 flex items-center justify-center">
          <Icon className="w-4 sm:w-5 h-4 sm:h-5 text-ibiza-cyan-400" />
        </div>

        <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 px-2 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur">
          <span className="text-white font-bold text-sm sm:text-base">{experience.price}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <span className="text-ibiza-cyan-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">{experience.category}</span>
          <span className="text-white/30">•</span>
          <span className="text-white/50 text-[10px] sm:text-xs">{experience.duration}</span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2 group-hover:text-ibiza-cyan-400 transition-colors">
          {experience.title}
        </h3>

        <p className="text-white/60 text-xs sm:text-sm mb-3 line-clamp-2">{experience.description}</p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-semibold text-xs sm:text-sm">{experience.rating}</span>
          </div>
          <span className="text-white/30 text-xs">({experience.reviews} reviews)</span>
        </div>
      </div>
    </Link>
  );
}

function StatCard({ number, label, icon: Icon }: { number: string; label: string; icon: any }) {
  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center">
      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-ibiza-blue-500/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
        <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-ibiza-blue-400" />
      </div>
      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">{number}</div>
      <div className="text-white/60 text-xs sm:text-sm">{label}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-white/50 hover:text-white transition-colors text-xs sm:text-sm">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
    >
      {children}
    </a>
  );
}
