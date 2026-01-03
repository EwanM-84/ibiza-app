"use client";

import { Star, PartyPopper, Music, Crown } from "lucide-react";

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
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
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
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 sm:p-12">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-ibiza-pink-500 to-ibiza-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Music className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Meet Mark</h2>
                <p className="text-ibiza-pink-400 font-semibold text-sm sm:text-base">20+ Years on the Island</p>
              </div>
            </div>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-4">
              Mark is the guy who's been on this island for over 20 years. He's owned bars, run clubs, and basically done everything that makes Ibiza the legendary party capital it is.
            </p>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed">
              He lives it, breathes it, and yeah, he <span className="text-ibiza-pink-400 font-semibold">shits Ibiza</span>. Without people like Mark, Ibiza just wouldn't be Ibiza.
            </p>
          </div>
        </div>
      </section>

      {/* Jas Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 sm:p-12">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-ibiza-cyan-500 to-ibiza-cyan-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Meet Jas</h2>
                <p className="text-ibiza-cyan-400 font-semibold text-sm sm:text-base">20 Years of Ibiza Knowledge</p>
              </div>
            </div>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-4">
              Jas is another total fucking legend. He's been part of the Ibiza scene for the last two decades and knows every damn thing about the island.
            </p>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-4">
              He's been that kid outside the clubs putting wristbands on people, and now he's the entrepreneur who's turning all that insane knowledge into your ultimate Ibiza guide.
            </p>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed">
              He <span className="text-ibiza-cyan-400 font-semibold">personifies everything</span> about the island—every club, every bar, every hidden gem.
            </p>
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
