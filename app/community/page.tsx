"use client";

import { Heart, Users, BookOpen, Home, Droplet, Lightbulb, TrendingUp, CheckCircle, Target, Award, TreePine } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/lib/text";
import { useRouter } from "next/navigation";

export default function CommunityPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const projects = [
    {
      id: 1,
      title: getText("communityPage.project1Title", language),
      location: getText("communityPage.project1Location", language),
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
      raised: 12500,
      goal: 15000,
      supporters: 89,
      category: getText("communityPage.project1Category", language),
      icon: Droplet,
      description: getText("communityPage.project1Description", language),
      impact: getText("communityPage.project1Impact", language),
      status: "active",
    },
    {
      id: 2,
      title: getText("communityPage.project2Title", language),
      location: getText("communityPage.project2Location", language),
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
      raised: 8200,
      goal: 10000,
      supporters: 67,
      category: getText("communityPage.project2Category", language),
      icon: BookOpen,
      description: getText("communityPage.project2Description", language),
      impact: getText("communityPage.project2Impact", language),
      status: "active",
    },
    {
      id: 3,
      title: getText("communityPage.project3Title", language),
      location: getText("communityPage.project3Location", language),
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
      raised: 15000,
      goal: 15000,
      supporters: 124,
      category: getText("communityPage.project3Category", language),
      icon: Lightbulb,
      description: getText("communityPage.project3Description", language),
      impact: getText("communityPage.project3Impact", language),
      status: "completed",
    },
    {
      id: 4,
      title: getText("communityPage.project4Title", language),
      location: getText("communityPage.project4Location", language),
      image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
      raised: 6400,
      goal: 20000,
      supporters: 43,
      category: getText("communityPage.project4Category", language),
      icon: Home,
      description: getText("communityPage.project4Description", language),
      impact: getText("communityPage.project4Impact", language),
      status: "active",
    },
    {
      id: 5,
      title: getText("communityPage.project5Title", language),
      location: getText("communityPage.project5Location", language),
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
      raised: 18500,
      goal: 25000,
      supporters: 312,
      category: getText("communityPage.project5Category", language),
      icon: TreePine,
      description: getText("communityPage.project5Description", language),
      impact: getText("communityPage.project5Impact", language),
      status: "active",
    },
  ];

  const stats = [
    { label: getText("communityPage.totalRaised", language), value: "$60,600", icon: TrendingUp },
    { label: getText("communityPage.treesPlanted", language), value: "3,750", icon: TreePine },
    { label: getText("communityPage.communitiesServed", language), value: "12", icon: Users },
    { label: getText("communityPage.projectsCompleted", language), value: "8", icon: CheckCircle },
  ];

  const howItWorks = [
    {
      step: 1,
      title: getText("communityPage.step1Title", language),
      description: getText("communityPage.step1Description", language),
      icon: Home,
    },
    {
      step: 2,
      title: getText("communityPage.step2Title", language),
      description: getText("communityPage.step2Description", language),
      icon: Heart,
    },
    {
      step: 3,
      title: getText("communityPage.step3Title", language),
      description: getText("communityPage.step3Description", language),
      icon: TrendingUp,
    },
    {
      step: 4,
      title: getText("communityPage.step4Title", language),
      description: getText("communityPage.step4Description", language),
      icon: Award,
    },
  ];

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
              {getText("communityPage.title", language)} <span className="text-sptc-red-600">{getText("communityPage.titleHighlight", language)}</span>
            </h1>
            <p className="text-2xl text-gray-700 mb-12 leading-relaxed">
              {getText("communityPage.subtitle", language)}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
                    <Icon className="w-8 h-8 text-sptc-red-600 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600 text-sm font-semibold">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
              {getText("communityPage.howItWorksTitle", language)}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {getText("communityPage.howItWorksSubtitle", language)}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-sptc-yellow-500 rounded-full flex items-center justify-center font-bold text-gray-900 shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Projects */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
              {getText("communityPage.currentProjectsTitle", language)}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {getText("communityPage.currentProjectsSubtitle", language)}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => {
              const Icon = project.icon;
              const progress = (project.raised / project.goal) * 100;

              return (
                <div key={project.id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
                      <Icon className="w-5 h-5 text-sptc-red-600" />
                      <span className="font-bold text-gray-900 text-sm">{project.category}</span>
                    </div>
                    {project.status === "completed" && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-bold text-sm">{getText("communityPage.completed", language)}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {project.location}
                    </p>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Impact */}
                    <div className="bg-sptc-yellow-50 border-l-4 border-sptc-yellow-500 p-4 rounded-lg mb-6">
                      <p className="text-sm font-bold text-gray-900 mb-1">{getText("communityPage.impact", language)}</p>
                      <p className="text-gray-700">{project.impact}</p>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-700">{getText("communityPage.progress", language)}</span>
                        <span className="text-sm font-bold text-sptc-red-600">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <div>
                        <div className="text-3xl font-bold text-gray-900">
                          ${project.raised.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {getText("communityPage.of", language)} ${project.goal.toLocaleString()} {getText("communityPage.goal", language)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-sptc-red-600">
                          {project.supporters}
                        </div>
                        <div className="text-sm text-gray-600">{getText("communityPage.supporters", language)}</div>
                      </div>
                    </div>

                    {project.status === "active" && (
                      <button className="w-full mt-6 py-4 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold rounded-2xl hover:from-sptc-red-700 hover:to-sptc-red-800 transition-all shadow-lg">
                        {getText("communityPage.supportProject", language)}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
              {getText("communityPage.storiesTitle", language)}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {getText("communityPage.storiesSubtitle", language)}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80",
                name: "María González",
                role: "Coffee Farmer & Host",
                location: "Salento, Quindío",
                quote: "The workshop center has allowed me to teach traditional basket weaving to younger generations. It's preserving our culture and providing income for 12 families.",
              },
              {
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
                name: "Carlos Ramírez",
                role: "School Director",
                location: "San Vicente, Antioquia",
                quote: "The clean water project has dramatically reduced illness among our students. Attendance is up 40% and children can focus on learning instead of being sick.",
              },
              {
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
                name: "Ana Torres",
                role: "Community Leader",
                location: "Fusagasugá, Cundinamarca",
                quote: "Our community library now serves 150 children who had no access to books before. We've seen reading scores improve by 60% in just one year.",
              },
            ].map((story, index) => (
              <div key={index} className="bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{story.name}</h4>
                    <p className="text-sm text-gray-600">{story.role}</p>
                    <p className="text-xs text-gray-500">{story.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed italic">"{story.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-20 h-20 text-white mx-auto mb-6" />
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {getText("communityPage.ctaTitle", language)}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {getText("communityPage.ctaSubtitle", language)}
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-teal-500 text-white font-bold text-lg px-12 py-5 rounded-2xl hover:bg-teal-500 transition-all shadow-2xl"
          >
            {getText("communityPage.ctaButton", language)}
          </button>
        </div>
      </section>
    </div>
  );
}
