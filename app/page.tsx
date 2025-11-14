"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Star, Heart, Award, Shield, TreePine, Home as HomeIcon, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Users, DollarSign, Sprout, GraduationCap, Lightbulb, TrendingUp, CheckCircle } from "lucide-react";
import AccommodationMap from "@/components/AccommodationMap";
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/lib/text";

export default function Home() {
  const { language } = useLanguage();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top left, #F5EBE0 0%, #E8DDD0 40%, #DED0BD 100%)",
      }}
    >
      {/* HERO */}
      <section
        className="relative overflow-visible pt-8 lg:pt-12"
        style={{
          background:
            "radial-gradient(circle at top left, #F5EBE0 0%, #E8DDD0 40%, #DED0BD 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-[45fr_55fr] gap-12 items-center">
            {/* Left side: heading + booking bar */}
            <div className="order-1 space-y-8">
              <h1 className="space-y-0">
                {/* Line 1: "Live the" - small, supporting */}
                <span className="block font-sans text-sm sm:text-base md:text-xl font-medium text-sptc-gray-700 tracking-wide mb-2">
                  {getText("hero.liveThe", language)}
                </span>

                {/* Line 2: "stories" - BIG hero word */}
                <span className="block font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-sptc-red-600 leading-none tracking-tight -mt-2">
                  <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">{getText("hero.stories", language).charAt(0)}</span>{getText("hero.stories", language).slice(1)}
                </span>

                {/* Line 3: "of rural Colombia" - medium, grounded */}
                <span className="block font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-sptc-gray-900 leading-tight mt-2">
                  {getText("hero.ofRuralColombia", language).split("Colombia")[0]}<span className="text-sptc-yellow-500">Colombia</span>
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl max-w-xl text-sptc-gray-600 leading-relaxed font-sans mt-6">
                {getText("hero.heroDescription", language)}
              </p>

              {/* Booking bar */}
              <div
                className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 w-full max-w-[900px]"
                style={{
                  boxShadow: "0 24px 60px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-6">
                  <div className="flex-1 min-w-0 sm:min-w-[160px]">
                    <label
                      className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2"
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      {getText("hero.checkIn", language)}
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full text-base text-gray-900 bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/60 hover:border-gray-300 transition-colors cursor-pointer"
                        style={{ fontFamily: '"Inter", sans-serif' }}
                        placeholder={getText("hero.selectDate", language)}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 sm:min-w-[160px]">
                    <label
                      className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2"
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      {getText("hero.checkOut", language)}
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        className="w-full text-base text-gray-900 bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/60 hover:border-gray-300 transition-colors cursor-pointer"
                        style={{ fontFamily: '"Inter", sans-serif' }}
                        placeholder={getText("hero.selectDate", language)}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 sm:min-w-[180px] relative">
                    <label
                      className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2"
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      {getText("hero.guests", language)}
                    </label>
                    <div
                      onClick={() => setShowGuestPicker(!showGuestPicker)}
                      className="w-full text-base text-gray-900 bg-transparent border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-gray-300 transition-colors flex items-center justify-between"
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      <span suppressHydrationWarning>
                        {adults + children} {adults + children === 1 ? getText("hero.guest", language) : getText("hero.guestsPlural", language)}
                      </span>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${showGuestPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Guest Picker Dropdown */}
                    {showGuestPicker && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-6 z-50 border border-gray-100 min-w-[280px]">
                        {/* Adults */}
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                          <div>
                            <p className="text-sm font-medium text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }}>{getText("hero.adults", language)}</p>
                            <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: '"Inter", sans-serif' }}>{getText("hero.agesAdult", language)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); setAdults(Math.max(1, adults - 1)); }}
                              className="w-9 h-9 rounded-full border-2 border-gray-300 hover:border-gray-900 transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                              disabled={adults <= 1}
                            >
                              <span className="text-gray-600 text-lg font-light">−</span>
                            </button>
                            <span className="w-8 text-center text-base font-light text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }} suppressHydrationWarning>{adults}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); setAdults(Math.min(10, adults + 1)); }}
                              className="w-9 h-9 rounded-full border-2 border-gray-300 hover:border-gray-900 transition-colors flex items-center justify-center"
                            >
                              <span className="text-gray-600 text-lg font-light">+</span>
                            </button>
                          </div>
                        </div>

                        {/* Children */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }}>{getText("hero.children", language)}</p>
                            <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: '"Inter", sans-serif' }}>{getText("hero.agesChild", language)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); setChildren(Math.max(0, children - 1)); }}
                              className="w-9 h-9 rounded-full border-2 border-gray-300 hover:border-gray-900 transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                              disabled={children <= 0}
                            >
                              <span className="text-gray-600 text-lg font-light">−</span>
                            </button>
                            <span className="w-8 text-center text-base font-light text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }} suppressHydrationWarning>{children}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); setChildren(Math.min(10, children + 1)); }}
                              className="w-9 h-9 rounded-full border-2 border-gray-300 hover:border-gray-900 transition-colors flex items-center justify-center"
                            >
                              <span className="text-gray-600 text-lg font-light">+</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/search?location=Fusagasugá&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`}
                    className="w-full sm:w-auto whitespace-nowrap px-6 sm:px-10 py-3 bg-gradient-to-br from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white font-medium rounded-xl sm:rounded-2xl transition-all shadow-[0_8px_30px_rgba(220,38,38,0.35)] hover:shadow-[0_12px_40px_rgba(220,38,38,0.45)] transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      letterSpacing: "0.02em",
                    }}
                  >
                    <Search className="w-5 h-5" />
                    <span className="text-sm">
                      {getText("hero.search", language)}
                    </span>
                  </Link>
                </div>
              </div>

              {/* Trust line */}
              <div className="flex items-center gap-2 pt-4 text-xs md:text-sm text-gray-500">
                <span className="text-green-500">✓</span>
                <span
                  style={{ fontFamily: '"Inter", sans-serif', opacity: 0.9 }}
                >
                  Every booking supports local community projects
                </span>
              </div>
            </div>

            {/* Right side: image collage - staggered like Withlocals */}
            <div className="order-first lg:order-last">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-w-[600px] ml-auto lg:ml-0">
                {/* Column 1: Image 1 alone */}
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg h-[200px] sm:h-[325px] mt-0 sm:mt-[50%]">
                  <img
                    src="/images/hero/image-1.png"
                    alt="image-1 placeholder"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Column 2: Image 2 and Image 3 stacked */}
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg h-[120px] sm:h-[175px]">
                    <img
                      src="/images/hero/image-2.png"
                      alt="image-2 placeholder"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg h-[200px] sm:h-[300px]">
                    <img
                      src="/images/hero/image-3.png"
                      alt="image-3 placeholder"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Column 3: Image 4 and Image 5 stacked */}
                <div className="flex flex-col gap-2 sm:gap-3 col-span-2 sm:col-span-1">
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg h-[160px] sm:h-[250px]">
                    <img
                      src="/images/hero/image-4.png"
                      alt="image-4 placeholder"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg h-[160px] sm:h-[250px]">
                    <img
                      src="/images/hero/image-5.jpg"
                      alt="image-5 placeholder"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="py-20 px-4" style={{ backgroundColor: "#E8DDD0" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <h2
              className="text-4xl lg:text-5xl font-light text-gray-900 mb-4"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              {getText("map.title", language).split(" ").slice(0, -2).join(" ")} <span className="font-semibold">{getText("map.title", language).split(" ").slice(-2).join(" ")}</span>
            </h2>
            <p
              className="text-lg text-gray-600"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              {getText("map.subtitle", language)}
            </p>
          </div>
          <AccommodationMap />
        </div>
      </section>

      {/* COMMUNITY PROJECTS SECTION */}
      <section className="py-24 px-4" style={{ background: "radial-gradient(circle at top left, #F5EBE0 0%, #E8DDD0 40%, #DED0BD 100%)" }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="text-center mb-20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sptc-red/5 blur-3xl rounded-full -z-10"></div>
            <div className="inline-block mb-6">
              <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-gray-100">
                <div className="w-2 h-2 bg-sptc-red rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700 tracking-wide uppercase" style={{ fontFamily: '"Inter", sans-serif' }}>
                  {getText("community.ourImpact", language)}
                </span>
              </div>
            </div>
            <h2 className="text-5xl lg:text-7xl font-light text-gray-900 mb-6 leading-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
              {getText("community.travelWithPurpose", language).split(" ").slice(0, -1).join(" ")} <span className="font-semibold text-sptc-red">{getText("community.travelWithPurpose", language).split(" ").slice(-1)}</span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light" style={{ fontFamily: '"Inter", sans-serif' }}>
              {getText("community.impactDescription", language)}
            </p>
            <div className="mt-8 flex items-center justify-center gap-2">
              <div className="h-1 w-12 bg-sptc-red rounded-full"></div>
              <div className="h-1 w-8 bg-sptc-red/40 rounded-full"></div>
              <div className="h-1 w-4 bg-sptc-red/20 rounded-full"></div>
            </div>
          </div>

          {/* Impact Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <TrendingUp className="w-8 h-8 text-sptc-red-600 mx-auto mb-3" />
              <div className="text-4xl font-bold text-gray-900 mb-2">$60,600</div>
              <div className="text-gray-600 text-sm font-semibold">{getText("community.totalRaised", language)}</div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <TreePine className="w-8 h-8 text-sptc-red-600 mx-auto mb-3" />
              <div className="text-4xl font-bold text-gray-900 mb-2">3,750</div>
              <div className="text-gray-600 text-sm font-semibold">{getText("community.treesPlanted", language)}</div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <Users className="w-8 h-8 text-sptc-red-600 mx-auto mb-3" />
              <div className="text-4xl font-bold text-gray-900 mb-2">12</div>
              <div className="text-gray-600 text-sm font-semibold">{getText("community.communitiesServed", language)}</div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <CheckCircle className="w-8 h-8 text-sptc-red-600 mx-auto mb-3" />
              <div className="text-4xl font-bold text-gray-900 mb-2">8</div>
              <div className="text-gray-600 text-sm font-semibold">{getText("community.projectsCompleted", language)}</div>
            </div>
          </div>

          {/* How Your Stay Makes an Impact */}
          <div className="mb-24 mt-32">
            <h3 className="text-4xl lg:text-5xl font-light text-gray-900 text-center mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
              {getText("community.howItWorksTitle", language).split(" ").slice(0, -1).join(" ")} <span className="font-semibold text-sptc-red">{getText("community.howItWorksTitle", language).split(" ").slice(-1)}</span>
            </h3>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto" style={{ fontFamily: '"Inter", sans-serif' }}>
              {getText("community.howItWorksSubtitle", language)}
            </p>
            <div className="grid md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                    <HomeIcon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-sptc-yellow-500 rounded-full flex items-center justify-center font-bold text-gray-900 shadow-lg">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{getText("community.step1Title", language)}</h3>
                <p className="text-gray-600 leading-relaxed">{getText("community.step1Description", language)}</p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-sptc-yellow-500 rounded-full flex items-center justify-center font-bold text-gray-900 shadow-lg">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{getText("community.step2Title", language)}</h3>
                <p className="text-gray-600 leading-relaxed">{getText("community.step2Description", language)}</p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-sptc-yellow-500 rounded-full flex items-center justify-center font-bold text-gray-900 shadow-lg">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{getText("community.step3Title", language)}</h3>
                <p className="text-gray-600 leading-relaxed">{getText("community.step3Description", language)}</p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-sptc-yellow-500 rounded-full flex items-center justify-center font-bold text-gray-900 shadow-lg">
                    4
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{getText("community.step4Title", language)}</h3>
                <p className="text-gray-600 leading-relaxed">{getText("community.step4Description", language)}</p>
              </div>
            </div>
          </div>

          {/* Current Community Projects */}
          <div className="mb-20">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4">
              {getText("projects.title", language)} <span className="text-sptc-red">{getText("projects.titleHighlight", language)}</span>
            </h3>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              {getText("projects.subtitle", language)}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Project 1 */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-green-500 to-green-600 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80"
                    alt={getText("projects.project1Title", language)}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-sm font-bold text-green-600">{getText("projects.project1Category", language)}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{getText("projects.project1Title", language)}</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {getText("projects.project1Description", language)}
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700">{getText("projects.project1Raised", language)}</span>
                      <span className="text-gray-500">{getText("projects.project1Of", language)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-md" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-600">{getText("projects.project1Complete", language)}</span>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors">
                      {getText("projects.project1Button", language)}
                    </button>
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80"
                    alt={getText("projects.project2Title", language)}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-sm font-bold text-blue-600">{getText("projects.project2Category", language)}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{getText("projects.project2Title", language)}</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {getText("projects.project2Description", language)}
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700">{getText("projects.project2Raised", language)}</span>
                      <span className="text-gray-500">{getText("projects.project2Of", language)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-md" style={{ width: '41%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-600">{getText("projects.project2Complete", language)}</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors">
                      {getText("projects.project2Button", language)}
                    </button>
                  </div>
                </div>
              </div>

              {/* Project 3 */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-sptc-yellow-500 to-sptc-yellow-600 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
                    alt={getText("projects.project3Title", language)}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-sm font-bold text-green-600">{getText("projects.project3Category", language)}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{getText("projects.project3Title", language)}</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {getText("projects.project3Description", language)}
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700">{getText("projects.project3Raised", language)}</span>
                      <span className="text-gray-500">{getText("projects.project3Of", language)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-md" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-bold text-green-600">{getText("projects.project3Complete", language)}</span>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors">
                      {getText("projects.project3Button", language)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="relative">
            <div className="text-center mb-12">
              <h3 className="text-4xl lg:text-5xl font-light text-gray-900 mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
                {getText("testimonials.title", language)} <span className="font-semibold text-sptc-red">{getText("testimonials.titleHighlight", language)}</span>
              </h3>
              <p className="text-lg text-gray-600" style={{ fontFamily: '"Inter", sans-serif' }}>
                {getText("testimonials.subtitle", language)}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Testimonial 1 */}
              <div className="group relative bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sptc-red/5 to-transparent rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-start gap-5 mb-6">
                    <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-sptc-red to-red-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>
                        {getText("testimonials.person1Name", language)}
                      </h4>
                      <p className="text-sptc-red font-medium text-sm" style={{ fontFamily: '"Inter", sans-serif' }}>
                        {getText("testimonials.person1Role", language)} • {getText("testimonials.person1Location", language)}
                      </p>
                    </div>
                  </div>
                  <div className="relative pl-1">
                    <div className="absolute -left-2 top-0 text-6xl text-sptc-red/20 leading-none" style={{ fontFamily: '"Playfair Display", serif' }}>"</div>
                    <p className="text-gray-700 leading-relaxed text-lg relative pl-8" style={{ fontFamily: '"Inter", sans-serif' }}>
                      {getText("testimonials.person1Quote", language)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="group relative bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sptc-red/5 to-transparent rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-start gap-5 mb-6">
                    <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-sptc-red to-red-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Sprout className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>
                        {getText("testimonials.person2Name", language)}
                      </h4>
                      <p className="text-sptc-red font-medium text-sm" style={{ fontFamily: '"Inter", sans-serif' }}>
                        {getText("testimonials.person2Role", language)} • {getText("testimonials.person2Location", language)}
                      </p>
                    </div>
                  </div>
                  <div className="relative pl-1">
                    <div className="absolute -left-2 top-0 text-6xl text-sptc-red/20 leading-none" style={{ fontFamily: '"Playfair Display", serif' }}>"</div>
                    <p className="text-gray-700 leading-relaxed text-lg relative pl-8" style={{ fontFamily: '"Inter", sans-serif' }}>
                      {getText("testimonials.person2Quote", language)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {getText("cta.title", language).split(" ").slice(0, -1).join(" ")} <span className="text-sptc-red">{getText("cta.title", language).split(" ").slice(-1)}</span>
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {getText("cta.description", language)}
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-3 px-10 py-5 bg-teal-500 text-white font-bold text-lg rounded-2xl hover:bg-teal-500 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              <Heart className="w-6 h-6" />
              <span>{getText("cta.exploreStays", language)}</span>
            </button>
          </div>
        </div>
      </section>

      {/* DESTINATIONS GRID */}
      <section className="py-20 px-4" style={{ backgroundColor: "#E8DDD0" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16 text-center">
            <h2
              className="text-4xl lg:text-5xl font-light text-gray-900 mb-4"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              {getText("destinations.title", language).split(" ").slice(0, -1).join(" ")} <span className="font-semibold">{getText("destinations.title", language).split(" ").slice(-1)}</span>
            </h2>
            <p
              className="text-lg text-gray-600"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              {getText("destinations.subtitle", language)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Fusagasugá */}
            <DestinationCard
              title={getText("destinations.fusagasuga", language)}
              experiences={`12 ${getText("destinations.experiences", language)}`}
              mainImage="https://images.unsplash.com/photo-1608241755473-214f53c1f55a?w=800&q=80"
              image2="https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400&q=80"
              image3="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80"
            />

            {/* Medellín */}
            <DestinationCard
              title={getText("destinations.medellin", language)}
              experiences={`24 ${getText("destinations.experiences", language)}`}
              mainImage="https://images.unsplash.com/photo-1568632234158-3e1c5be90024?w=800&q=80"
              image2="https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=400&q=80"
              image3="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80"
            />

            {/* Salento / Coffee region */}
            <DestinationCard
              title={getText("destinations.salento", language)}
              experiences={`18 ${getText("destinations.experiences", language)}`}
              mainImage="https://images.unsplash.com/photo-1601655399907-0356a161f5b8?w=800&q=80"
              image2="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80"
              image3="https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&q=80"
            />
          </div>
        </div>
      </section>

      {/* TREE PLANTING COUNTER */}
      <section className="py-16 px-4" style={{ background: "radial-gradient(circle at top left, #F5EBE0 0%, #E8DDD0 40%, #DED0BD 100%)" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: Image */}
              <div className="relative h-64 md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1000&q=90"
                  alt="Tree planting"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/50 to-transparent"></div>
              </div>

              {/* Right: Counter */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <TreePine className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-green-600 uppercase tracking-wider">{getText("treeCounter.title", language)}</h3>
                    <p className="text-xs text-gray-600">{getText("treeCounter.subtitle", language)}</p>
                  </div>
                </div>

                <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
                  <span className="text-green-600">3,750</span> {getText("treeCounter.treesPlanted", language)}
                </h2>

                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  {getText("treeCounter.description", language)}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-green-50 rounded-2xl">
                    <div className="text-3xl font-bold text-green-600 mb-1">25</div>
                    <div className="text-xs text-gray-600 font-semibold">{getText("treeCounter.hectaresReforested", language)}</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-2xl">
                    <div className="text-3xl font-bold text-green-600 mb-1">12</div>
                    <div className="text-xs text-gray-600 font-semibold">{getText("treeCounter.communitiesInvolved", language)}</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-2xl">
                    <div className="text-3xl font-bold text-green-600 mb-1">5+</div>
                    <div className="text-xs text-gray-600 font-semibold">{getText("treeCounter.nativeSpecies", language)}</div>
                  </div>
                </div>

                <a
                  href="/community"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-2xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
                >
                  <span>{getText("treeCounter.learnMore", language)}</span>
                  <TreePine className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED STAYS */}
      <section className="py-20 px-4" style={{ backgroundColor: "#E8DDD0" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {getText("featuredStays.title", language)}
            </h2>
            <p className="text-xl text-gray-600">
              {getText("featuredStays.subtitle", language)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PropertyCard
              image="https://images.unsplash.com/photo-1602391833977-358a52198938?w=800&q=80"
              title="Coffee Farm Cottage"
              location="Coffee Region"
              price="$45"
              rating="4.9"
              reviews="127"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"
              title="Mountain View Villa"
              location="Andean hills"
              price="$65"
              rating="4.8"
              reviews="89"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80"
              title="Traditional Finca"
              location="Near Silvania"
              price="$55"
              rating="5.0"
              reviews="203"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
              title="Boutique Eco Lodge"
              location="Coffee Region"
              price="$85"
              rating="4.9"
              reviews="156"
            />
          </div>
        </div>
      </section>

      {/* MORE STAYS */}
      <section className="py-20 px-4" style={{ background: "radial-gradient(circle at top left, #F5EBE0 0%, #E8DDD0 40%, #DED0BD 100%)" }}>
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">
            {getText("moreStays.title", language)}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PropertyCard
              image="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80"
              title="Riverside cabin"
              location="Magdalena River, Tolima"
              price="$50"
              rating="4.7"
              reviews="64"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&q=80"
              title="Colonial hacienda"
              location="Villa de Leyva, Boyacá"
              price="$95"
              rating="5.0"
              reviews="178"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
              title="Modern loft"
              location="Salento, Quindío"
              price="$70"
              rating="4.8"
              reviews="92"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"
              title="Mountain retreat"
              location="Cocora Valley, Quindío"
              price="$85"
              rating="4.9"
              reviews="127"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80"
              title="Traditional finca"
              location="Manizales, Caldas"
              price="$55"
              rating="4.6"
              reviews="89"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
              title="Eco lodge"
              location="Tayrona, Magdalena"
              price="$110"
              rating="5.0"
              reviews="203"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=800&q=80"
              title="Colonial house"
              location="Barichara, Santander"
              price="$65"
              rating="4.8"
              reviews="145"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1598970605070-ffb66fba595b?w=800&q=80"
              title="Coffee plantation"
              location="Armenia, Quindío"
              price="$75"
              rating="4.9"
              reviews="156"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1545243424-0ce743321e11?w=800&q=80"
              title="Farm stay"
              location="Pereira, Risaralda"
              price="$60"
              rating="4.7"
              reviews="98"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80"
              title="Valley villa"
              location="Cauca Valley"
              price="$80"
              rating="4.8"
              reviews="112"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1602391833977-358a52198938?w=800&q=80"
              title="Rural cottage"
              location="Jardín, Antioquia"
              price="$55"
              rating="4.6"
              reviews="73"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"
              title="Modern farmhouse"
              location="Guatapé, Antioquia"
              price="$90"
              rating="4.9"
              reviews="167"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80"
              title="Lakeside cabin"
              location="Guatapé Lake, Antioquia"
              price="$70"
              rating="4.7"
              reviews="134"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
              title="Hilltop villa"
              location="San Gil, Santander"
              price="$95"
              rating="5.0"
              reviews="189"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
              title="Country estate"
              location="Popayán, Cauca"
              price="$85"
              rating="4.8"
              reviews="121"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"
              title="Jungle retreat"
              location="Leticia, Amazonas"
              price="$120"
              rating="4.9"
              reviews="156"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
              title="Bamboo house"
              location="Filandia, Quindío"
              price="$65"
              rating="4.7"
              reviews="94"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"
              title="Farmstay cottage"
              location="Santa Rosa de Cabal, Risaralda"
              price="$55"
              rating="4.6"
              reviews="81"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80"
              title="Mountain lodge"
              location="Los Nevados, Caldas"
              price="$100"
              rating="4.9"
              reviews="178"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80"
              title="Heritage home"
              location="Mompox, Bolívar"
              price="$75"
              rating="4.8"
              reviews="143"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80"
              title="River house"
              location="Honda, Tolima"
              price="$60"
              rating="4.7"
              reviews="107"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
              title="Countryside villa"
              location="Rionegro, Antioquia"
              price="$80"
              rating="4.8"
              reviews="129"
            />
            <PropertyCard
              image="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80"
              title="Tropical bungalow"
              location="Cartagena countryside, Bolívar"
              price="$90"
              rating="4.9"
              reviews="152"
            />
          </div>
        </div>
      </section>

      {/* CTA: BECOME A HOST */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1920&q=90"
            alt="Colombian town"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-sptc-red-900/80 via-sptc-red-800/70 to-sptc-red-900/80" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border-2 border-white/20">
            <HomeIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {getText("becomeHostCta.title", language)}
          </h2>
          <p className="text-2xl text-white/95 mb-10 leading-relaxed">
            {getText("becomeHostCta.description", language)}
          </p>
          <a
            href="/host/onboarding"
            className="inline-block bg-white text-sptc-red-600 font-bold text-lg px-12 py-5 rounded-2xl hover:bg-gray-100 transition-all shadow-2xl transform hover:scale-105"
          >
            {getText("becomeHostCta.button", language)}
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/images/icons/sptc-logo.jpg"
                  alt="SPTC Rural Logo"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-2xl font-bold">SPTC</h3>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">Rural</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {getText("footer.tagline", language)}
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-sptc-red-600 rounded-full flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-sptc-red-600 rounded-full flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-sptc-red-600 rounded-full flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">{getText("footer.quickLinks", language)}</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/homes" className="text-gray-400 hover:text-white transition-colors">
                    {getText("footer.findHomes", language)}
                  </a>
                </li>
                <li>
                  <a href="/experiences" className="text-gray-400 hover:text-white transition-colors">
                    {getText("footer.experiences", language)}
                  </a>
                </li>
                <li>
                  <a href="/community" className="text-gray-400 hover:text-white transition-colors">
                    {getText("footer.communityProjects", language)}
                  </a>
                </li>
                <li>
                  <a href="/host/onboarding" className="text-gray-400 hover:text-white transition-colors">
                    {getText("footer.becomeHost", language)}
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                    {getText("footer.aboutUs", language)}
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">{getText("footer.support", language)}</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/help" className="text-gray-400 hover:text-white transition-colors">
                    {getText("footer.helpCenter", language)}
                  </a>
                </li>
                <li>
                  <a href="/cancellation" className="text-gray-400 hover:text-white transition-colors">
                    {getText("footer.cancellationPolicy", language)}
                  </a>
                </li>
                <li>
                  <a href="/safety" className="text-gray-400 hover:text-white transition-colors">
                    {getText("footer.safetyInformation", language)}
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    {getText("footer.privacyPolicy", language)}
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    {getText("footer.termsOfService", language)}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">{getText("footer.contactUs", language)}</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-sptc-red-600 flex-shrink-0 mt-1" />
                  <div className="text-gray-400 text-sm">
                    <p>SPTC Colombia</p>
                    <p>Fusagasugá, Cundinamarca</p>
                    <p>Colombia</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-sptc-red-600 flex-shrink-0" />
                  <a href="tel:+573001234567" className="text-gray-400 hover:text-white transition-colors text-sm">
                    +57 300 123 4567
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-sptc-red-600 flex-shrink-0" />
                  <a href="mailto:info@sptc.rural" className="text-gray-400 hover:text-white transition-colors text-sm">
                    info@sptc.rural
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} SPTC Rural. {getText("footer.allRightsReserved", language)}
              </p>
              <div className="flex gap-6 text-sm">
                <a href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                  {getText("footer.privacy", language)}
                </a>
                <a href="/terms" className="text-gray-500 hover:text-white transition-colors">
                  {getText("footer.terms", language)}
                </a>
                <a href="/cookies" className="text-gray-500 hover:text-white transition-colors">
                  {getText("footer.cookies", language)}
                </a>
                <a href="/sitemap" className="text-gray-500 hover:text-white transition-colors">
                  {getText("footer.sitemap", language)}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* --- Small presentational components --- */

function DestinationCard({
  title,
  experiences,
  mainImage,
  image2,
  image3,
}: {
  title: string;
  experiences: string;
  mainImage: string;
  image2: string;
  image3: string;
}) {
  return (
    <div className="group cursor-pointer">
      <div className="grid grid-cols-2 gap-2 h-[380px]">
        <div className="col-span-2 relative overflow-hidden rounded-2xl shadow-md">
          <img
            src={mainImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="relative overflow-hidden rounded-2xl shadow-md">
          <img
            src={image2}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="relative overflow-hidden rounded-2xl shadow-md">
          <img
            src={image3}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </div>
      <div className="mt-4">
        <h3
          className="text-xl font-semibold text-gray-900 mb-1"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-600">{experiences}</p>
      </div>
    </div>
  );
}

function PropertyCard({
  image,
  title,
  location,
  price,
  rating,
  reviews,
}: {
  image: string;
  title: string;
  location: string;
  price: string;
  rating: string;
  reviews: string;
}) {
  return (
    <div className="group cursor-pointer">
      <div className="relative mb-4 overflow-hidden rounded-2xl">
        <img
          src={image}
          alt={title}
          className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <button 
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Add to favorites"
          title="Add to favorites"
        >
          <Heart className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-current text-gray-900" />
            <span className="text-sm font-semibold">{rating}</span>
            <span className="text-sm text-gray-600">({reviews})</span>
          </div>
        </div>
        <p className="text-gray-600">{location}</p>
        <p className="text-gray-900">
          <span className="font-bold text-lg">{price}</span>
          <span className="text-gray-600"> / night</span>
        </p>
      </div>
    </div>
  );
}

function FeatureRow({
  iconBg,
  icon,
  title,
  text,
}: {
  iconBg: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start space-x-4">
      <div
        className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm md:text-base">{text}</p>
      </div>
    </div>
  );
}
