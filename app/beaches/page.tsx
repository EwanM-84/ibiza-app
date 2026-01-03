"use client";

import { useState } from "react";
import { Sun, MapPin, Star, Heart, Clock, Music, Utensils, Waves } from "lucide-react";
import Link from "next/link";

export default function BeachesPage() {
  const [selectedArea, setSelectedArea] = useState("all");

  const areas = [
    { id: "all", label: "All Areas" },
    { id: "sanantonio", label: "San Antonio" },
    { id: "playabossa", label: "Playa d'en Bossa" },
    { id: "ibizatown", label: "Ibiza Town" },
    { id: "santaeulalia", label: "Santa Eulalia" },
    { id: "north", label: "North Coast" },
  ];

  const beachClubs = [
    {
      id: 1,
      name: "Café del Mar",
      type: "Sunset Bar",
      area: "sanantonio",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      rating: 4.9,
      reviews: 24893,
      tags: ["Iconic Sunsets", "Chill Out", "Since 1980"],
      price: "€€€",
      location: "San Antonio",
      description: "The birthplace of the Ibiza sunset ritual. World-famous chill-out compilations.",
      hours: "17:00 - 01:00",
      features: ["Sunset Views", "Live DJs", "Cocktails"],
    },
    {
      id: 2,
      name: "Blue Marlin",
      type: "Luxury Beach Club",
      area: "ibizatown",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
      rating: 4.8,
      reviews: 11234,
      tags: ["VIP", "Champagne", "Celebrity Spot"],
      price: "€€€€",
      location: "Cala Jondal",
      description: "Where the jet-set parties. Luxury loungers, world-class DJs, and Cristal on ice.",
      hours: "11:00 - 00:00",
      features: ["VIP Service", "Fine Dining", "Beach Beds"],
    },
    {
      id: 3,
      name: "Nassau Beach Club",
      type: "Beach Club & Restaurant",
      area: "playabossa",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
      rating: 4.7,
      reviews: 8765,
      tags: ["Beachfront", "Fine Dining", "Cocktails"],
      price: "€€€",
      location: "Playa d'en Bossa",
      description: "Elegant beachfront dining with live DJs and stunning Mediterranean views.",
      hours: "10:00 - 02:00",
      features: ["Restaurant", "Pool", "Live Music"],
    },
    {
      id: 4,
      name: "Experimental Beach",
      type: "Boutique Beach Club",
      area: "ibizatown",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
      rating: 4.9,
      reviews: 5432,
      tags: ["Hidden Gem", "Cocktails", "Bohemian"],
      price: "€€€€",
      location: "Cap des Falcó",
      description: "A secret paradise. Bohemian luxury with craft cocktails and breathtaking cliff views.",
      hours: "12:00 - 00:00",
      features: ["Cliff Views", "Craft Cocktails", "Sunset"],
    },
    {
      id: 5,
      name: "Nikki Beach",
      type: "International Beach Club",
      area: "santaeulalia",
      image: "https://images.unsplash.com/photo-1520942702018-0862200e6873?w=800&q=80",
      rating: 4.6,
      reviews: 9876,
      tags: ["Pool", "Champagne Spray", "White Party"],
      price: "€€€€",
      location: "Santa Eulalia",
      description: "The global beach club brand. Famous white parties and champagne-fueled pool sessions.",
      hours: "11:00 - 23:00",
      features: ["Pool", "Brunch", "Beach Beds"],
    },
    {
      id: 6,
      name: "Sunset Ashram",
      type: "Bohemian Beach Bar",
      area: "sanantonio",
      image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
      rating: 4.8,
      reviews: 7654,
      tags: ["Boho Vibes", "Live Music", "Organic"],
      price: "€€",
      location: "Cala Conta",
      description: "Barefoot luxury meets hippie spirit. Organic cuisine, live acoustic sets, and magic sunsets.",
      hours: "12:00 - 00:00",
      features: ["Organic Food", "Live Acoustic", "Sunset"],
    },
    {
      id: 7,
      name: "Beachouse",
      type: "Beach Restaurant",
      area: "playabossa",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      rating: 4.5,
      reviews: 6543,
      tags: ["Beachfront", "Family Friendly", "Casual"],
      price: "€€",
      location: "Playa d'en Bossa",
      description: "Relaxed beachfront dining with Mediterranean cuisine and chilled house music.",
      hours: "10:00 - 01:00",
      features: ["Beach Access", "Kids Welcome", "Sunbeds"],
    },
    {
      id: 8,
      name: "Amante",
      type: "Clifftop Restaurant",
      area: "ibizatown",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
      rating: 4.9,
      reviews: 4321,
      tags: ["Fine Dining", "Sunrise", "Romantic"],
      price: "€€€€",
      location: "Sol d'en Serra",
      description: "Perched on the cliffs. Fine dining with stunning views over the Mediterranean sea.",
      hours: "11:00 - 23:00",
      features: ["Fine Dining", "Cliff Views", "Private Beach"],
    },
    {
      id: 9,
      name: "Cala Bassa Beach Club",
      type: "Beach Club",
      area: "sanantonio",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
      rating: 4.7,
      reviews: 8765,
      tags: ["Crystal Waters", "Family Friendly", "Paella"],
      price: "€€€",
      location: "Cala Bassa",
      description: "Crystal clear waters and perfect paella. One of Ibiza's most beautiful beach settings.",
      hours: "10:00 - 20:00",
      features: ["Clear Water", "Restaurant", "Water Sports"],
    },
  ];

  const filteredClubs = selectedArea === "all"
    ? beachClubs
    : beachClubs.filter(club => club.area === selectedArea);

  return (
    <div className="min-h-screen bg-ibiza-night-500">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ibiza-night-900/80 via-ibiza-night-900/60 to-ibiza-night-500" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Sun className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white/90">Daytime Paradise</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Beach <span className="text-gradient-sunset">Clubs</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Sun, sea, and world-class vibes. The best beach clubs on the White Isle.
          </p>
        </div>
      </section>

      {/* Area Filter */}
      <section className="sticky top-16 sm:top-20 z-30 bg-ibiza-night-500/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            {areas.map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedArea(area.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedArea === area.id
                    ? "bg-yellow-500 text-black shadow-lg"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {area.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Beach Clubs Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {filteredClubs.length} beach clubs
            </h2>
            <p className="text-white/60">The best spots to soak up the Ibiza sun</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredClubs.map((club) => (
              <Link
                href={`/beaches/${club.id}`}
                key={club.id}
                className="group relative overflow-hidden rounded-2xl bg-ibiza-night-400 border border-white/10 hover:border-yellow-500/50 transition-all duration-500 block"
              >
                <div className="relative h-44 sm:h-56 overflow-hidden">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ibiza-night-500 via-transparent to-transparent" />

                  <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-ibiza-night-500/80 backdrop-blur flex items-center justify-center text-white/70 hover:text-ibiza-pink-400 transition-all">
                    <Heart className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/90 text-sm font-medium">{club.location}</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {club.name}
                      </h3>
                      <p className="text-white/50 text-sm">{club.type}</p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold text-sm">{club.rating}</span>
                    </div>
                  </div>

                  <p className="text-white/60 text-sm mb-4 line-clamp-2">{club.description}</p>

                  <div className="flex items-center gap-4 text-white/50 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{club.hours}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {club.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400/80 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-white/40 text-sm">{club.reviews.toLocaleString()} reviews</span>
                    <span className="text-yellow-400 font-semibold">{club.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
