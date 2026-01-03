"use client";

import { Users, Star, PartyPopper, Music } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ibiza-night-500">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ibiza-night-900/90 via-ibiza-night-900/80 to-ibiza-night-500" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Meet the <span className="text-gradient-party">Fucking Legends</span> of Ibiza
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto">
            Welcome to the heart and soul of the real Ibiza experience
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 sm:p-12">
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed text-center">
              This app, this website—this entire trip—is all thanks to two absolute fucking legends.
            </p>
          </div>
        </div>
      </section>

      {/* Mark Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                  alt="Mark"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-ibiza-pink-500 rounded-2xl flex items-center justify-center">
                <span className="text-4xl font-bold text-white">20+</span>
              </div>
              <p className="absolute -bottom-4 -right-4 mt-28 text-ibiza-pink-400 text-sm font-semibold">Years on the island</p>
            </div>

            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-ibiza-blue-500/20 rounded-xl flex items-center justify-center">
                  <Music className="w-6 h-6 text-ibiza-blue-400" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">Meet Mark</h2>
              </div>
              <p className="text-white/70 text-lg leading-relaxed">
                Mark is the guy who's been on this island for over 20 years. He's owned bars, run clubs, and basically done everything that makes Ibiza the legendary party capital it is.
              </p>
              <p className="text-white/70 text-lg leading-relaxed mt-4">
                He lives it, breathes it, and yeah, he <span className="text-ibiza-pink-400 font-semibold">shits Ibiza</span>. Without people like Mark, Ibiza just wouldn't be Ibiza.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jas Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="glass-card rounded-3xl p-8 order-2 md:order-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-ibiza-purple-500/20 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-ibiza-purple-400" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">Meet Jas</h2>
              </div>
              <p className="text-white/70 text-lg leading-relaxed">
                Jas is another total fucking legend. He's been part of the Ibiza scene for the last two decades and knows every damn thing about the island.
              </p>
              <p className="text-white/70 text-lg leading-relaxed mt-4">
                He's been that kid outside the clubs putting wristbands on people, and now he's the entrepreneur who's turning all that insane knowledge into your ultimate Ibiza guide.
              </p>
              <p className="text-white/70 text-lg leading-relaxed mt-4">
                He <span className="text-ibiza-cyan-400 font-semibold">personifies everything</span> about the island—every club, every bar, every hidden gem.
              </p>
            </div>

            <div className="relative order-1 md:order-2">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80"
                  alt="Jas"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-ibiza-cyan-500 rounded-2xl flex items-center justify-center">
                <span className="text-4xl font-bold text-white">20</span>
              </div>
              <p className="absolute -bottom-4 -left-4 mt-28 text-ibiza-cyan-400 text-sm font-semibold">Years of Ibiza knowledge</p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card-dark rounded-3xl p-8 sm:p-12">
            <div className="w-20 h-20 bg-gradient-to-br from-ibiza-pink-500 to-ibiza-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <PartyPopper className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Welcome Aboard
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              So yeah, this is your about page. It's a no-bullshit tribute to the guys who made this app because they <span className="text-gradient-party font-semibold">ARE the legends of Ibiza</span>.
            </p>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              If you want the real Ibiza experience, you follow in their footsteps. They're the captains of this wild ship, and they're here to show you what the island is really about.
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gradient-party">
              Meet the fucking legends.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
