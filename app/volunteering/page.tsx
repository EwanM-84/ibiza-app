"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/lib/text";
import {
  BookOpen,
  Users,
  TreePine,
  Sprout,
  Hammer,
  Palette,
  Leaf,
  Coffee,
  Globe,
  Heart,
  Calendar,
  MapPin,
  ChevronRight,
  Filter
} from "lucide-react";

export default function VolunteeringPage() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: getText("volunteeringPage.allProjects", language) },
    { id: "education", label: getText("volunteeringPage.education", language) },
    { id: "environment", label: getText("volunteeringPage.environment", language) },
    { id: "community", label: getText("volunteeringPage.communityDevelopment", language) },
    { id: "agriculture", label: getText("volunteeringPage.agriculture", language) },
    { id: "empowerment", label: getText("volunteeringPage.empowerment", language) },
  ];

  const projects = [
    {
      id: 1,
      title: getText("volunteeringPage.project1Title", language),
      category: "education",
      icon: BookOpen,
      description: getText("volunteeringPage.project1Description", language),
      tasks: getText("volunteeringPage.project1Tasks", language),
      duration: getText("volunteeringPage.project1Duration", language),
      idealFor: getText("volunteeringPage.project1IdealFor", language),
      location: getText("volunteeringPage.project1Location", language),
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=90",
    },
    {
      id: 2,
      title: getText("volunteeringPage.project2Title", language),
      category: "empowerment",
      icon: Users,
      description: getText("volunteeringPage.project2Description", language),
      tasks: getText("volunteeringPage.project2Tasks", language),
      duration: getText("volunteeringPage.project2Duration", language),
      idealFor: getText("volunteeringPage.project2IdealFor", language),
      location: getText("volunteeringPage.project2Location", language),
      image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=90",
    },
    {
      id: 3,
      title: getText("volunteeringPage.project3Title", language),
      category: "environment",
      icon: TreePine,
      description: getText("volunteeringPage.project3Description", language),
      tasks: getText("volunteeringPage.project3Tasks", language),
      duration: getText("volunteeringPage.project3Duration", language),
      idealFor: getText("volunteeringPage.project3IdealFor", language),
      location: getText("volunteeringPage.project3Location", language),
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=90",
    },
    {
      id: 4,
      title: getText("volunteeringPage.project4Title", language),
      category: "agriculture",
      icon: Sprout,
      description: getText("volunteeringPage.project4Description", language),
      tasks: getText("volunteeringPage.project4Tasks", language),
      duration: getText("volunteeringPage.project4Duration", language),
      idealFor: getText("volunteeringPage.project4IdealFor", language),
      location: getText("volunteeringPage.project4Location", language),
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=90",
    },
    {
      id: 5,
      title: getText("volunteeringPage.project5Title", language),
      category: "community",
      icon: Hammer,
      description: getText("volunteeringPage.project5Description", language),
      tasks: getText("volunteeringPage.project5Tasks", language),
      duration: getText("volunteeringPage.project5Duration", language),
      idealFor: getText("volunteeringPage.project5IdealFor", language),
      location: getText("volunteeringPage.project5Location", language),
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=90",
    },
    {
      id: 6,
      title: getText("volunteeringPage.project6Title", language),
      category: "community",
      icon: Palette,
      description: getText("volunteeringPage.project6Description", language),
      tasks: getText("volunteeringPage.project6Tasks", language),
      duration: getText("volunteeringPage.project6Duration", language),
      idealFor: getText("volunteeringPage.project6IdealFor", language),
      location: getText("volunteeringPage.project6Location", language),
      image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=90",
    },
    {
      id: 7,
      title: getText("volunteeringPage.project7Title", language),
      category: "environment",
      icon: Leaf,
      description: getText("volunteeringPage.project7Description", language),
      tasks: getText("volunteeringPage.project7Tasks", language),
      duration: getText("volunteeringPage.project7Duration", language),
      idealFor: getText("volunteeringPage.project7IdealFor", language),
      location: getText("volunteeringPage.project7Location", language),
      image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=90",
    },
    {
      id: 8,
      title: getText("volunteeringPage.project8Title", language),
      category: "agriculture",
      icon: Coffee,
      description: getText("volunteeringPage.project8Description", language),
      tasks: getText("volunteeringPage.project8Tasks", language),
      duration: getText("volunteeringPage.project8Duration", language),
      idealFor: getText("volunteeringPage.project8IdealFor", language),
      location: getText("volunteeringPage.project8Location", language),
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=90",
    },
    {
      id: 9,
      title: getText("volunteeringPage.project9Title", language),
      category: "education",
      icon: Globe,
      description: getText("volunteeringPage.project9Description", language),
      tasks: getText("volunteeringPage.project9Tasks", language),
      duration: getText("volunteeringPage.project9Duration", language),
      idealFor: getText("volunteeringPage.project9IdealFor", language),
      location: getText("volunteeringPage.project9Location", language),
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=90",
    },
    {
      id: 10,
      title: getText("volunteeringPage.project10Title", language),
      category: "empowerment",
      icon: Heart,
      description: getText("volunteeringPage.project10Description", language),
      tasks: getText("volunteeringPage.project10Tasks", language),
      duration: getText("volunteeringPage.project10Duration", language),
      idealFor: getText("volunteeringPage.project10IdealFor", language),
      location: getText("volunteeringPage.project10Location", language),
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=90",
    },
  ];

  const filteredProjects = selectedCategory === "all"
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative pt-24 pb-32 px-4 overflow-hidden"
        style={{
          background: "radial-gradient(circle at top left, #F5EBE0 0%, #E8DDD0 40%, #DED0BD 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Heart className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
              {getText("volunteeringPage.title", language)} <span className="text-sptc-red-600">{getText("volunteeringPage.titleHighlight", language)}</span>
            </h1>
            <p className="text-2xl text-gray-700 mb-12 leading-relaxed">
              {getText("volunteeringPage.subtitle", language)}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { value: "10+", label: getText("volunteeringPage.stat1", language) },
                { value: "500+", label: getText("volunteeringPage.stat2", language) },
                { value: "50+", label: getText("volunteeringPage.stat3", language) },
                { value: "1-12", label: getText("volunteeringPage.stat4", language) },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
                  <div className="text-4xl font-bold text-sptc-red-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600 text-sm font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-12 px-4 bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Filter className="w-6 h-6 text-sptc-red-600" />
              {getText("volunteeringPage.filterByCategory", language)}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                  selectedCategory === category.id
                    ? "bg-sptc-red-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {filteredProjects.length} {getText("volunteeringPage.projectsAvailable", language)}
            </h2>
            <p className="text-gray-600">{getText("volunteeringPage.projectsSubtitle", language)}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => {
              const Icon = project.icon;
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
                      <Icon className="w-5 h-5 text-sptc-red-600" />
                      <span className="font-bold text-gray-900 text-sm">
                        {categories.find(c => c.id === project.category)?.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{project.title}</h3>

                    <div className="flex items-center gap-4 mb-6 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-sptc-red-600" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-sptc-red-600" />
                        <span>{project.duration}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tasks */}
                    <div className="bg-gray-50 border-l-4 border-sptc-red-600 p-4 rounded-lg mb-6">
                      <p className="text-sm font-bold text-gray-900 mb-2">{getText("volunteeringPage.tasks", language)}</p>
                      <p className="text-gray-700 text-sm">{project.tasks}</p>
                    </div>

                    {/* Ideal For */}
                    <div className="bg-sptc-yellow-50 border-l-4 border-sptc-yellow-500 p-4 rounded-lg mb-6">
                      <p className="text-sm font-bold text-gray-900 mb-2">{getText("volunteeringPage.idealFor", language)}</p>
                      <p className="text-gray-700 text-sm">{project.idealFor}</p>
                    </div>

                    <button className="w-full py-4 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold rounded-2xl hover:from-sptc-red-700 hover:to-sptc-red-800 transition-all shadow-lg flex items-center justify-center gap-2 group">
                      {getText("volunteeringPage.applyNow", language)}
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
              {getText("volunteeringPage.whyVolunteerTitle", language)}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {getText("volunteeringPage.whyVolunteerSubtitle", language)}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{getText("volunteeringPage.benefit1Title", language)}</h3>
              <p className="text-gray-600 leading-relaxed">
                {getText("volunteeringPage.benefit1Description", language)}
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-sptc-yellow-500 to-sptc-yellow-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{getText("volunteeringPage.benefit2Title", language)}</h3>
              <p className="text-gray-600 leading-relaxed">
                {getText("volunteeringPage.benefit2Description", language)}
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{getText("volunteeringPage.benefit3Title", language)}</h3>
              <p className="text-gray-600 leading-relaxed">
                {getText("volunteeringPage.benefit3Description", language)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-20 h-20 text-white mx-auto mb-6" />
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {getText("volunteeringPage.ctaTitle", language)}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {getText("volunteeringPage.ctaSubtitle", language)}
          </p>
          <button className="bg-white text-sptc-red-600 font-bold text-lg px-12 py-5 rounded-2xl hover:bg-gray-100 transition-all shadow-2xl">
            {getText("volunteeringPage.ctaButton", language)}
          </button>
        </div>
      </section>
    </div>
  );
}
