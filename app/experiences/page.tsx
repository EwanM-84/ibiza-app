"use client";

import { useState } from "react";
import { Ship, Music, Sun, Utensils, Sparkles, Waves, Users, Clock, MapPin, Star, Heart } from "lucide-react";
import Link from "next/link";

export default function ExperiencesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Experiences", icon: Sparkles },
    { id: "boat", label: "Boat Parties", icon: Ship },
    { id: "nightlife", label: "Nightlife", icon: Music },
    { id: "beach", label: "Beach & Sun", icon: Sun },
    { id: "food", label: "Food & Drink", icon: Utensils },
    { id: "wellness", label: "Wellness", icon: Waves },
  ];

  const experiences = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=90",
      title: "Sunset Boat Party",
      location: "San Antonio Bay, Ibiza",
      category: "boat",
      price: 89,
      duration: "4 hours",
      rating: 4.9,
      reviews: 2341,
      groupSize: "Up to 50",
      description: "Sail into the famous Ibiza sunset with open bar, live DJ, and swimming stops at secret coves.",
      host: {
        name: "Miguel",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
      },
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=90",
      title: "VIP Club Tour",
      location: "Ibiza Town & Playa d'en Bossa",
      category: "nightlife",
      price: 199,
      duration: "6 hours",
      rating: 5.0,
      reviews: 1876,
      groupSize: "Up to 12",
      description: "Skip the lines at Pacha, Amnesia, and Hï Ibiza with VIP host and welcome drinks.",
      host: {
        name: "Sofia",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      },
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=90",
      title: "Hidden Beaches Jeep Tour",
      location: "North & West Coast, Ibiza",
      category: "beach",
      price: 75,
      duration: "5 hours",
      rating: 4.8,
      reviews: 987,
      groupSize: "Up to 8",
      description: "Explore secret beaches and cliff jumping spots in a 4x4 adventure.",
      host: {
        name: "Carlos",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      },
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&q=90",
      title: "Paella & Sangria Experience",
      location: "Santa Gertrudis, Ibiza",
      category: "food",
      price: 65,
      duration: "4 hours",
      rating: 4.9,
      reviews: 654,
      groupSize: "Up to 12",
      description: "Learn to cook authentic Spanish paella with a local chef. Unlimited sangria included.",
      host: {
        name: "María",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
      },
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=90",
      title: "Sunrise Yoga & Beach",
      location: "Benirràs Beach, Ibiza",
      category: "wellness",
      price: 45,
      duration: "3 hours",
      rating: 5.0,
      reviews: 432,
      groupSize: "Up to 15",
      description: "Oceanfront yoga as the sun rises. Fresh smoothies, fruit, and a refreshing swim.",
      host: {
        name: "Luna",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      },
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=90",
      title: "Formentera Day Trip",
      location: "Formentera Island",
      category: "beach",
      price: 95,
      duration: "Full Day",
      rating: 4.9,
      reviews: 3456,
      groupSize: "Up to 20",
      description: "Ferry to paradise island with crystal-clear waters. Bike rental and beach club lunch included.",
      host: {
        name: "Diego",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
      },
    },
  ];

  const filteredExperiences = selectedCategory === "all"
    ? experiences
    : experiences.filter(exp => exp.category === selectedCategory);

  return (
    <div className="min-h-screen bg-ibiza-night-500">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ibiza-night-900/90 via-ibiza-night-900/80 to-ibiza-night-500" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Sparkles className="w-4 h-4 text-ibiza-cyan-400" />
            <span className="text-sm font-medium text-white/90">Beyond the Clubs</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Unforgettable <span className="text-gradient">Experiences</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Boat parties, hidden beaches, VIP club tours, and island adventures
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 sm:top-20 z-30 bg-ibiza-night-500/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-ibiza-cyan-500 text-white shadow-glow-cyan"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {filteredExperiences.length} experiences available
            </h2>
            <p className="text-white/60">Led by verified Ibiza experts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((experience) => {
              const CategoryIcon = categories.find(c => c.id === experience.category)?.icon || Sparkles;
              return (
                <Link
                  href={`/experiences/${experience.id}`}
                  key={experience.id}
                  className="group relative overflow-hidden rounded-2xl bg-ibiza-night-400 border border-white/10 hover:border-ibiza-cyan-500/50 transition-all duration-500 block"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ibiza-night-500 via-ibiza-night-500/30 to-transparent" />

                    <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-ibiza-night-500/80 backdrop-blur flex items-center justify-center text-white/70 hover:text-ibiza-pink-400 transition-all">
                      <Heart className="w-5 h-5" />
                    </button>

                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-ibiza-cyan-500/20 border border-ibiza-cyan-500/30 flex items-center gap-1">
                      <CategoryIcon className="w-3 h-3 text-ibiza-cyan-400" />
                      <span className="text-ibiza-cyan-400 text-xs font-bold">
                        {categories.find(c => c.id === experience.category)?.label}
                      </span>
                    </div>

                    <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur">
                      <span className="text-white font-bold">€{experience.price}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={experience.host.image}
                        alt={experience.host.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-white/60 text-xs">Hosted by</p>
                        <p className="text-white text-sm font-medium">{experience.host.name}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-semibold text-xs">{experience.rating}</span>
                        <span className="text-white/50 text-xs">({experience.reviews})</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-ibiza-cyan-400 transition-colors">
                      {experience.title}
                    </h3>

                    <div className="flex items-center gap-1 text-white/50 text-sm mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{experience.location}</span>
                    </div>

                    <p className="text-white/60 text-sm mb-4 line-clamp-2">{experience.description}</p>

                    <div className="flex items-center gap-4 text-white/50 text-sm mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {experience.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {experience.groupSize}
                      </span>
                    </div>

                    <button className="w-full py-3 bg-ibiza-cyan-500 hover:bg-ibiza-cyan-600 text-white font-bold rounded-xl transition-colors">
                      Book Now
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Book Section */}
      <section className="py-20 px-4 bg-ibiza-night-400/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why book with us?
            </h2>
            <p className="text-white/60 text-lg">
              The real Ibiza experience from people who know the island
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center glass-card rounded-2xl p-8">
              <div className="w-16 h-16 bg-ibiza-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-ibiza-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Island Experts</h3>
              <p className="text-white/60">
                All experiences led by verified hosts who've lived and breathed Ibiza for years
              </p>
            </div>

            <div className="text-center glass-card rounded-2xl p-8">
              <div className="w-16 h-16 bg-ibiza-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-ibiza-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Skip the Queues</h3>
              <p className="text-white/60">
                VIP access, reserved tables, and insider knowledge you won't find anywhere else
              </p>
            </div>

            <div className="text-center glass-card rounded-2xl p-8">
              <div className="w-16 h-16 bg-ibiza-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-ibiza-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Quality Guaranteed</h3>
              <p className="text-white/60">
                Every experience personally vetted to ensure you get the best Ibiza has to offer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl glass-card-dark p-8 sm:p-12 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ibiza-cyan-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-ibiza-pink-500/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Want to host an experience?
              </h2>
              <p className="text-white/60 text-lg mb-8">
                Share your knowledge of Ibiza with visitors from around the world
              </p>
              <button className="btn-primary px-8 py-4">
                Become a Host
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
