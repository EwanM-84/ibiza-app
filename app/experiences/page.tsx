"use client";

import { useState } from "react";
import { Coffee, Mountain, Palette, UtensilsCrossed, Bike, Camera, Users, Clock, MapPin, Star, Heart } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/lib/text";

export default function ExperiencesPage() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: getText("experiencesPage.allExperiences", language), icon: Users },
    { id: "coffee", label: getText("experiencesPage.coffeeTours", language), icon: Coffee },
    { id: "adventure", label: getText("experiencesPage.adventure", language), icon: Mountain },
    { id: "culture", label: getText("experiencesPage.culture", language), icon: Palette },
    { id: "food", label: getText("experiencesPage.food", language), icon: UtensilsCrossed },
    { id: "nature", label: getText("experiencesPage.nature", language), icon: Camera },
  ];

  const experiences = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=90",
      title: "Coffee Farm Tour & Tasting",
      location: "Salento, Quindío",
      category: "coffee",
      price: 35,
      duration: "4 hours",
      rating: 4.9,
      reviews: 234,
      groupSize: "Up to 12",
      description: "Learn the complete coffee process from seed to cup. Visit a traditional coffee farm, pick coffee cherries, and enjoy a professional tasting session.",
      host: {
        name: "Juan",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
        verified: true,
      },
      highlights: ["Visit working coffee plantation", "Hands-on coffee picking", "Professional tasting", "Traditional Colombian lunch"],
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=90",
      title: "Cocora Valley Hiking Adventure",
      location: "Valle del Cocora, Quindío",
      category: "adventure",
      price: 45,
      duration: "6 hours",
      rating: 5.0,
      reviews: 189,
      groupSize: "Up to 15",
      description: "Hike through Colombia's stunning cloud forests and see the world's tallest palm trees. A moderate trek with breathtaking Andean views.",
      host: {
        name: "Sofia",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
        verified: true,
      },
      highlights: ["See wax palms up to 60m tall", "Cloud forest hiking", "Wildlife spotting", "Local guide included"],
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=90",
      title: "Traditional Basket Weaving Workshop",
      location: "Guacamayas, Boyacá",
      category: "culture",
      price: 28,
      duration: "3 hours",
      rating: 4.8,
      reviews: 76,
      groupSize: "Up to 8",
      description: "Learn traditional basket weaving techniques from local artisans. Create your own basket to take home as a unique souvenir.",
      host: {
        name: "Rosa",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
        verified: true,
      },
      highlights: ["Learn from master artisans", "Create your own basket", "Support local crafts", "Coffee and snacks included"],
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=90",
      title: "Farm-to-Table Cooking Class",
      location: "Fusagasugá, Cundinamarca",
      category: "food",
      price: 40,
      duration: "5 hours",
      rating: 4.9,
      reviews: 142,
      groupSize: "Up to 10",
      description: "Harvest fresh ingredients from the garden and learn to cook traditional Colombian dishes. Enjoy your creations with the host family.",
      host: {
        name: "María",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
        verified: true,
      },
      highlights: ["Pick fresh ingredients", "Learn authentic recipes", "Cook with host family", "Full meal included"],
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=90",
      title: "Birdwatching in the Cloud Forest",
      location: "San Vicente, Antioquia",
      category: "nature",
      price: 50,
      duration: "4 hours",
      rating: 5.0,
      reviews: 98,
      groupSize: "Up to 6",
      description: "Spot exotic birds including toucans, hummingbirds, and tanagers in their natural habitat. Includes binoculars and field guide.",
      host: {
        name: "Carlos",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
        verified: true,
      },
      highlights: ["Expert bird guide", "Spot 30+ species", "Binoculars provided", "Morning coffee included"],
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=800&q=90",
      title: "Mountain Biking Adventure",
      location: "Jardín, Antioquia",
      category: "adventure",
      price: 55,
      duration: "5 hours",
      rating: 4.7,
      reviews: 121,
      groupSize: "Up to 8",
      description: "Ride through coffee plantations and mountain trails with stunning views. Suitable for intermediate riders.",
      host: {
        name: "Diego",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
        verified: true,
      },
      highlights: ["Mountain bike provided", "Scenic rural routes", "Coffee farm stop", "Safety equipment included"],
    },
  ];

  const filteredExperiences = selectedCategory === "all"
    ? experiences
    : experiences.filter(exp => exp.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative pt-24 pb-20 px-4"
        style={{
          background: "radial-gradient(circle at top left, #F5EBE0 0%, #E8DDD0 40%, #DED0BD 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {getText("experiencesPage.title", language)} <span className="text-sptc-red-600">{getText("experiencesPage.titleHighlight", language)}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            {getText("experiencesPage.subtitle", language)}
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all ${
                    selectedCategory === category.id
                      ? "bg-sptc-red-600 text-white shadow-lg scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-16 px-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {filteredExperiences.length} {getText("experiencesPage.experiencesAvailable", language)}
            </h2>
            <p className="text-gray-600">{getText("experiencesPage.ledByHosts", language)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperiences.map((experience) => {
              const CategoryIcon = categories.find(c => c.id === experience.category)?.icon || Users;
              return (
                <Link href={`/experiences/${experience.id}`} key={experience.id}>
                  <div className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    {/* Image */}
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={experience.image}
                        alt={experience.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <Heart className="w-5 h-5 text-gray-700" />
                      </button>
                      <div className="absolute top-4 left-4 bg-sptc-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CategoryIcon className="w-3 h-3" />
                        {categories.find(c => c.id === experience.category)?.label}
                      </div>
                      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current text-sptc-yellow-500" />
                          <span className="font-bold text-gray-900 text-sm">{experience.rating}</span>
                          <span className="text-gray-600 text-sm">({experience.reviews})</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Host */}
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={experience.host.image}
                          alt={experience.host.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{getText("experiencesPage.hostedBy", language)} {experience.host.name}</p>
                          {experience.host.verified && (
                            <p className="text-xs text-sptc-red-600 font-semibold">✓ {getText("experiencesPage.verified", language)}</p>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2">{experience.title}</h3>
                      <p className="text-gray-600 mb-4 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {experience.location}
                      </p>

                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                        {experience.description}
                      </p>

                      {/* Details */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {experience.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> {experience.groupSize}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">${experience.price}</span>
                            <span className="text-gray-600"> {getText("experiencesPage.perPerson", language)}</span>
                          </div>
                          <button className="px-6 py-2 bg-sptc-red-600 text-white font-bold rounded-xl hover:bg-sptc-red-700 transition-colors">
                            {getText("experiencesPage.book", language)}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Our Experiences */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
              {getText("experiencesPage.whyBookTitle", language)}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {getText("experiencesPage.whyBookSubtitle", language)}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{getText("experiencesPage.localHostsTitle", language)}</h3>
              <p className="text-gray-600 leading-relaxed">
                {getText("experiencesPage.localHostsDescription", language)}
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-sptc-yellow-500 to-sptc-yellow-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{getText("experiencesPage.communityImpactTitle", language)}</h3>
              <p className="text-gray-600 leading-relaxed">
                {getText("experiencesPage.communityImpactDescription", language)}
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{getText("experiencesPage.qualityGuaranteedTitle", language)}</h3>
              <p className="text-gray-600 leading-relaxed">
                {getText("experiencesPage.qualityGuaranteedDescription", language)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {getText("experiencesPage.ctaTitle", language)}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {getText("experiencesPage.ctaSubtitle", language)}
          </p>
          <button className="bg-white text-sptc-red-600 font-bold text-lg px-12 py-5 rounded-2xl hover:bg-gray-100 transition-all shadow-2xl">
            {getText("experiencesPage.ctaButton", language)}
          </button>
        </div>
      </section>
    </div>
  );
}
