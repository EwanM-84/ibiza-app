"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Ticket, Star, Music, PartyPopper } from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
  const [selectedVenue, setSelectedVenue] = useState("all");

  const venues = [
    { id: "all", label: "All Venues" },
    { id: "ushuaia", label: "Ushuaïa" },
    { id: "pacha", label: "Pacha" },
    { id: "hi", label: "Hï Ibiza" },
    { id: "amnesia", label: "Amnesia" },
    { id: "dc10", label: "DC-10" },
    { id: "privilege", label: "Privilege" },
  ];

  const events = [
    {
      id: 1,
      title: "David Guetta - F*** Me I'm Famous",
      venue: "Ushuaïa Ibiza",
      venueId: "ushuaia",
      date: "Every Friday",
      time: "16:00 - 00:00",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
      price: 70,
      soldOut: false,
      dj: "David Guetta",
      genre: "EDM / House",
    },
    {
      id: 2,
      title: "Elrow - Psychedelic Trip",
      venue: "Amnesia",
      venueId: "amnesia",
      date: "Every Saturday",
      time: "23:00 - 07:00",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
      price: 55,
      soldOut: false,
      dj: "Various Artists",
      genre: "Tech House",
    },
    {
      id: 3,
      title: "Black Coffee Residency",
      venue: "Hï Ibiza",
      venueId: "hi",
      date: "Every Sunday",
      time: "22:00 - 06:00",
      image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80",
      price: 50,
      soldOut: true,
      dj: "Black Coffee",
      genre: "Afro House",
    },
    {
      id: 4,
      title: "Fisher - Catch & Release",
      venue: "Ushuaïa Ibiza",
      venueId: "ushuaia",
      date: "Every Tuesday",
      time: "16:00 - 00:00",
      image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
      price: 65,
      soldOut: false,
      dj: "Fisher",
      genre: "Tech House",
    },
    {
      id: 5,
      title: "Circoloco",
      venue: "DC-10",
      venueId: "dc10",
      date: "Every Monday",
      time: "16:00 - 06:00",
      image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&q=80",
      price: 45,
      soldOut: false,
      dj: "Seth Troxler, The Martinez Brothers",
      genre: "Techno / House",
    },
    {
      id: 6,
      title: "Calvin Harris",
      venue: "Ushuaïa Ibiza",
      venueId: "ushuaia",
      date: "Every Thursday",
      time: "17:00 - 00:00",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
      price: 80,
      soldOut: true,
      dj: "Calvin Harris",
      genre: "EDM / Pop",
    },
    {
      id: 7,
      title: "Flower Power",
      venue: "Pacha",
      venueId: "pacha",
      date: "Every Wednesday",
      time: "23:00 - 06:00",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
      price: 40,
      soldOut: false,
      dj: "Various Artists",
      genre: "Disco / 70s",
    },
    {
      id: 8,
      title: "Solomun +1",
      venue: "Pacha",
      venueId: "pacha",
      date: "Every Sunday",
      time: "23:59 - 07:00",
      image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
      price: 55,
      soldOut: false,
      dj: "Solomun",
      genre: "Melodic House",
    },
    {
      id: 9,
      title: "Cocoon",
      venue: "Amnesia",
      venueId: "amnesia",
      date: "Every Monday",
      time: "23:00 - 07:00",
      image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80",
      price: 50,
      soldOut: false,
      dj: "Sven Väth",
      genre: "Techno",
    },
  ];

  const filteredEvents = selectedVenue === "all"
    ? events
    : events.filter(event => event.venueId === selectedVenue);

  return (
    <div className="min-h-screen bg-ibiza-night-500">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ibiza-night-900/90 via-ibiza-night-900/80 to-ibiza-night-500" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <PartyPopper className="w-4 h-4 text-ibiza-pink-400" />
            <span className="text-sm font-medium text-white/90">Season 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Upcoming <span className="text-gradient-party">Events</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Don't miss the hottest parties on the island. Get your tickets before they sell out.
          </p>
        </div>
      </section>

      {/* Venue Filter */}
      <section className="sticky top-16 sm:top-20 z-30 bg-ibiza-night-500/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            {venues.map((venue) => (
              <button
                key={venue.id}
                onClick={() => setSelectedVenue(venue.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedVenue === venue.id
                    ? "bg-ibiza-pink-500 text-white shadow-glow-pink"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {venue.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {filteredEvents.length} events this week
            </h2>
            <p className="text-white/60">The best parties in Ibiza</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-2xl glass-card hover:border-ibiza-pink-500/50 transition-all duration-500"
              >
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ibiza-night-500 via-ibiza-night-500/50 to-transparent" />

                  <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-ibiza-night-500/90 backdrop-blur border border-white/10">
                    <span className="text-white font-bold">€{event.price}</span>
                  </div>

                  {event.soldOut && (
                    <div className="absolute inset-0 bg-ibiza-night-900/80 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">SOLD OUT</span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-ibiza-pink-500/20 border border-ibiza-pink-500/30 text-ibiza-pink-400 text-xs font-bold">
                      {event.genre}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-ibiza-pink-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-white/50 text-sm mb-4">{event.venue}</p>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white/60 text-xs sm:text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-ibiza-pink-400" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-ibiza-pink-400" />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                    <Music className="w-4 h-4" />
                    <span>{event.dj}</span>
                  </div>

                  {!event.soldOut && (
                    <button className="w-full btn-party py-3 text-sm">
                      <Ticket className="w-4 h-4 inline mr-2" />
                      Get Tickets
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
