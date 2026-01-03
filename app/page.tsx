"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search, Star, Heart, Play, Music, Sun, MapPin, Calendar,
  Sparkles, ArrowRight, Clock, Users, Ticket, ChevronRight,
  Waves, PartyPopper, Headphones, Sunset
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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

  const featuredClubs = [
    {
      id: 1,
      name: "Ushuaïa",
      type: "Beach Club",
      image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
      rating: 4.9,
      reviews: 2847,
      tags: ["Pool Party", "Live DJs", "VIP"],
      price: "€€€",
      isLive: true,
    },
    {
      id: 2,
      name: "Pacha",
      type: "Nightclub",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
      rating: 4.8,
      reviews: 3421,
      tags: ["Iconic", "House Music", "VIP Tables"],
      price: "€€€",
    },
    {
      id: 3,
      name: "Amnesia",
      type: "Nightclub",
      image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&q=80",
      rating: 4.7,
      reviews: 2156,
      tags: ["Techno", "Foam Party", "Legendary"],
      price: "€€€",
    },
    {
      id: 4,
      name: "Café del Mar",
      type: "Sunset Bar",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      rating: 4.9,
      reviews: 1893,
      tags: ["Sunset", "Chill", "Iconic Views"],
      price: "€€",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "David Guetta Live",
      venue: "Ushuaïa Ibiza",
      date: "Every Friday",
      time: "16:00 - 00:00",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
      price: "€70",
      soldOut: false,
    },
    {
      id: 2,
      title: "Elrow Party",
      venue: "Amnesia",
      date: "Every Saturday",
      time: "23:00 - 07:00",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
      price: "€50",
      soldOut: false,
    },
    {
      id: 3,
      title: "Black Coffee",
      venue: "Hï Ibiza",
      date: "Every Sunday",
      time: "22:00 - 06:00",
      image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80",
      price: "€45",
      soldOut: true,
    },
  ];

  return (
    <div className="min-h-screen bg-ibiza-night-500">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Video/Image Background */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-slow-pan"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80')`,
            }}
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-ibiza-night-900/80 via-ibiza-night-900/60 to-ibiza-night-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-ibiza-night-900/50 via-transparent to-ibiza-night-900/50" />

          {/* Animated Mesh Gradient */}
          <div className="absolute inset-0 bg-mesh opacity-60" />

          {/* Floating Particles */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-ibiza-blue-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ibiza-purple-500/20 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-ibiza-pink-500/20 rounded-full blur-3xl animate-float-slow" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-ibiza-pink-500 animate-pulse" />
              <span className="text-sm font-medium text-white/90">Season 2025 Now Live</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6 animate-slide-up">
              <span className="text-white">Unlock the</span>
              <br />
              <span className="text-gradient-party">Magic of Ibiza</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-white/70 max-w-2xl mb-10 leading-relaxed animate-slide-up font-light">
              Discover world-famous clubs, stunning beach parties, and unforgettable
              experiences on the White Isle.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl animate-slide-up">
              <div className="search-bar p-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="w-5 h-5 text-ibiza-blue-400" />
                    <input
                      type="text"
                      placeholder="Search clubs, events, experiences..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40 text-lg py-4"
                    />
                  </div>
                  <button className="btn-primary flex items-center gap-2 px-6">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-white/40 text-sm">Popular:</span>
                <QuickLink>Ushuaïa</QuickLink>
                <QuickLink>Pacha</QuickLink>
                <QuickLink>Sunset Ashram</QuickLink>
                <QuickLink>Boat Parties</QuickLink>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-soft">
            <span className="text-white/40 text-sm">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-ibiza-blue-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <section className="sticky top-20 z-30 bg-ibiza-night-500/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-ibiza-blue-500 text-white shadow-glow-blue"
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

      {/* FEATURED VENUES */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                Featured <span className="text-gradient">Venues</span>
              </h2>
              <p className="text-white/60 text-lg">The island's most iconic destinations</p>
            </div>
            <Link href="/venues" className="hidden sm:flex items-center gap-2 text-ibiza-blue-400 hover:text-ibiza-blue-300 transition-colors font-medium">
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Venue Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredClubs.map((club, index) => (
              <VenueCard key={club.id} venue={club} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* LIVE NOW BANNER */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl">
            {/* Background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1920&q=80')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ibiza-pink-600/90 via-ibiza-purple-600/90 to-ibiza-blue-600/90" />

            {/* Content */}
            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <Play className="w-10 h-10 text-white fill-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 badge-live">LIVE</div>
                </div>
                <div>
                  <p className="text-white/70 text-sm font-medium mb-1">Happening Now</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">David Guetta @ Ushuaïa</h3>
                  <p className="text-white/80 mt-1">15,000+ watching live</p>
                </div>
              </div>
              <button className="btn-secondary bg-white/20 border-white/30 hover:bg-white/30 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Live Stream
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-20 px-4 bg-ibiza-night-400/50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-ibiza-pink-400" />
                <span className="text-ibiza-pink-400 font-semibold uppercase tracking-wider text-sm">This Week</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                Upcoming <span className="text-gradient-party">Events</span>
              </h2>
              <p className="text-white/60 text-lg">Don't miss the hottest parties on the island</p>
            </div>
            <Link href="/events" className="hidden sm:flex items-center gap-2 text-ibiza-pink-400 hover:text-ibiza-pink-300 transition-colors font-medium">
              All events
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE CATEGORIES */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Your Perfect <span className="text-gradient">Ibiza Day</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              From sunrise yoga to sunset cocktails to all-night dancing
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <ExperienceCard
              icon={Sunset}
              title="Sunset Spots"
              count={24}
              gradient="from-orange-500 to-pink-500"
              image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"
            />
            <ExperienceCard
              icon={Waves}
              title="Beach Clubs"
              count={18}
              gradient="from-ibiza-blue-500 to-ibiza-cyan-500"
              image="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80"
            />
            <ExperienceCard
              icon={Headphones}
              title="Nightclubs"
              count={12}
              gradient="from-ibiza-purple-500 to-ibiza-pink-500"
              image="https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&q=80"
            />
            <ExperienceCard
              icon={PartyPopper}
              title="Boat Parties"
              count={8}
              gradient="from-ibiza-cyan-500 to-emerald-500"
              image="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80"
            />
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD CTA */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] glass-card-dark">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-ibiza-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-ibiza-purple-500/20 rounded-full blur-3xl" />

            <div className="relative p-8 md:p-16 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ibiza-blue-500/20 border border-ibiza-blue-500/30 mb-6">
                  <Sparkles className="w-4 h-4 text-ibiza-blue-400" />
                  <span className="text-sm font-medium text-ibiza-blue-400">Coming Soon</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Get the <span className="text-gradient">Ibiza Unlocked</span> App
                </h2>

                <p className="text-white/60 text-lg mb-8 leading-relaxed">
                  Exclusive deals, real-time event updates, skip-the-line access, and your
                  personal Ibiza concierge – all in your pocket.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button className="btn-primary flex items-center gap-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs opacity-80">Download on the</div>
                      <div className="font-semibold">App Store</div>
                    </div>
                  </button>
                  <button className="btn-secondary flex items-center gap-3">
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

              {/* Phone Mockup */}
              <div className="relative flex justify-center">
                <div className="relative w-64 h-[500px]">
                  {/* Phone Frame */}
                  <div className="absolute inset-0 bg-ibiza-night-300 rounded-[3rem] border-4 border-ibiza-night-200 shadow-2xl overflow-hidden">
                    {/* Screen Content */}
                    <div className="absolute inset-2 rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-ibiza-blue-600 to-ibiza-purple-600">
                      <img
                        src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80"
                        alt="App Preview"
                        className="w-full h-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-4">
                          <span className="text-2xl font-bold">IU</span>
                        </div>
                        <p className="text-center text-sm opacity-80">Your Ibiza Experience</p>
                      </div>
                    </div>
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute -inset-4 bg-ibiza-blue-500/30 rounded-[4rem] blur-2xl -z-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ibiza-night-600 border-t border-white/10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-ibiza-blue-400 to-ibiza-cyan-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">IU</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Ibiza</h3>
                  <p className="text-xs text-ibiza-blue-400 uppercase tracking-wider">Unlocked</p>
                </div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Your gateway to the ultimate Ibiza experience. Discover, book, and live the magic.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Explore</h4>
              <ul className="space-y-3">
                <FooterLink href="/clubs">Clubs</FooterLink>
                <FooterLink href="/beaches">Beach Clubs</FooterLink>
                <FooterLink href="/events">Events</FooterLink>
                <FooterLink href="/experiences">Experiences</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/careers">Careers</FooterLink>
                <FooterLink href="/press">Press</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
                <FooterLink href="/cookies">Cookie Policy</FooterLink>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Ibiza Unlocked. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
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
    <button className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm transition-all duration-200">
      {children}
    </button>
  );
}

function VenueCard({ venue, index }: { venue: any; index: number }) {
  return (
    <div
      className="group relative overflow-hidden rounded-3xl bg-ibiza-night-400 border border-white/10 hover:border-ibiza-blue-500/50 transition-all duration-500"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ibiza-night-500 via-transparent to-transparent" />

        {/* Live Badge */}
        {venue.isLive && (
          <div className="absolute top-4 left-4 badge-live">LIVE</div>
        )}

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-ibiza-night-500/80 backdrop-blur flex items-center justify-center text-white/70 hover:text-ibiza-pink-400 hover:bg-ibiza-night-500 transition-all">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-ibiza-blue-400 transition-colors">
              {venue.name}
            </h3>
            <p className="text-white/50 text-sm">{venue.type}</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-semibold text-sm">{venue.rating}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {venue.tags.map((tag: string) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-white/40 text-sm">{venue.reviews.toLocaleString()} reviews</span>
          <span className="text-ibiza-blue-400 font-semibold">{venue.price}</span>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, index }: { event: any; index: number }) {
  return (
    <div
      className="group relative overflow-hidden rounded-3xl glass-card hover:border-ibiza-pink-500/50 transition-all duration-500"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ibiza-night-500 via-ibiza-night-500/50 to-transparent" />

        {/* Price Tag */}
        <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-ibiza-night-500/90 backdrop-blur border border-white/10">
          <span className="text-white font-bold">{event.price}</span>
        </div>

        {/* Sold Out Overlay */}
        {event.soldOut && (
          <div className="absolute inset-0 bg-ibiza-night-900/80 flex items-center justify-center">
            <span className="text-white font-bold text-xl">SOLD OUT</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-ibiza-pink-400 transition-colors">
          {event.title}
        </h3>
        <p className="text-white/50 text-sm mb-4">{event.venue}</p>

        <div className="flex items-center gap-4 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-ibiza-pink-400" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-ibiza-pink-400" />
            <span>{event.time}</span>
          </div>
        </div>

        {/* CTA */}
        {!event.soldOut && (
          <button className="w-full mt-4 btn-party py-3 text-sm">
            <Ticket className="w-4 h-4 inline mr-2" />
            Get Tickets
          </button>
        )}
      </div>
    </div>
  );
}

function ExperienceCard({
  icon: Icon,
  title,
  count,
  gradient,
  image,
}: {
  icon: any;
  title: string;
  count: number;
  gradient: string;
  image: string;
}) {
  return (
    <Link
      href={`/experiences/${title.toLowerCase().replace(' ', '-')}`}
      className="group relative h-64 md:h-80 overflow-hidden rounded-3xl"
    >
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
      <div className="absolute inset-0 bg-gradient-to-t from-ibiza-night-900/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{title}</h3>
        <p className="text-white/70 text-sm">{count} venues</p>
      </div>

      {/* Hover Arrow */}
      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
        <ArrowRight className="w-5 h-5 text-white" />
      </div>
    </Link>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-white/50 hover:text-white transition-colors text-sm">
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
      className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
    >
      {children}
    </a>
  );
}
