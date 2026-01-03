"use client";

import Link from "next/link";
import { User, Globe, Sparkles, Menu, X, Music, Sun, MapPin, Calendar } from "lucide-react";
import { getText } from "@/lib/text";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import LoginModal from "./LoginModal";

export default function Navigation() {
  const { language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<"client" | "host" | "admin">("client");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        const { data: profile } = await supabase
          .from('host_profiles')
          .select('first_name')
          .eq('user_id', session.user.id)
          .single();
        if (profile?.first_name) {
          setUserInitial(profile.first_name.charAt(0).toUpperCase());
        }
      } else {
        setIsLoggedIn(false);
        setUserInitial(null);
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUserInitial(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      router.push('/host/dashboard');
    } else {
      setLoginMode("client");
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-2'
            : 'py-4'
        }`}
      >
        {/* Glassmorphic background */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            scrolled
              ? 'bg-ibiza-night-500/80 backdrop-blur-2xl border-b border-white/10'
              : 'bg-transparent'
          }`}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 bg-ibiza-blue-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-ibiza-blue-400 to-ibiza-cyan-500 rounded-2xl flex items-center justify-center shadow-glow-blue group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">IU</span>
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Ibiza
                </span>
                <span className="font-sans text-xs font-medium text-ibiza-blue-400 tracking-widest uppercase">
                  Unlocked
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink href="/clubs" icon={<Music className="w-4 h-4" />}>
                Clubs & Nightlife
              </NavLink>
              <NavLink href="/beaches" icon={<Sun className="w-4 h-4" />}>
                Beach Clubs
              </NavLink>
              <NavLink href="/experiences" icon={<MapPin className="w-4 h-4" />}>
                Experiences
              </NavLink>
              <NavLink href="/events" icon={<Calendar className="w-4 h-4" />}>
                Events
              </NavLink>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* CTA Button - Desktop */}
              <Link
                href="/host/register"
                className="hidden sm:flex items-center space-x-2 btn-primary text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>List Your Venue</span>
              </Link>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10
                           transition-all duration-300 hover:scale-105 active:scale-95"
                  aria-label="Change language"
                >
                  <Globe className="w-5 h-5 text-white/80" />
                </button>

                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-44 glass-card rounded-2xl overflow-hidden z-50 animate-slide-down">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setLanguage("en");
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-4 py-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                          language === "en"
                            ? "bg-ibiza-blue-500/20 text-ibiza-blue-400"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="text-lg">🇬🇧</span>
                        <span className="font-medium">English</span>
                      </button>
                      <button
                        onClick={() => {
                          setLanguage("es");
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-4 py-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                          language === "es"
                            ? "bg-ibiza-blue-500/20 text-ibiza-blue-400"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="text-lg">🇪🇸</span>
                        <span className="font-medium">Español</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Button */}
              <button
                onClick={handleUserIconClick}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10
                         transition-all duration-300 hover:scale-105 active:scale-95"
                aria-label={isLoggedIn ? "Dashboard" : "Login"}
              >
                {isLoggedIn && userInitial ? (
                  <div className="w-5 h-5 bg-gradient-to-br from-ibiza-blue-500 to-ibiza-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    {userInitial}
                  </div>
                ) : (
                  <User className="w-5 h-5 text-white/80" />
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10
                         transition-all duration-300"
                aria-label="Toggle menu"
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ibiza-night-900/90 backdrop-blur-2xl"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Menu Content */}
          <div className="relative h-full pt-24 pb-8 px-6 overflow-y-auto">
            <div className="space-y-2">
              <MobileNavLink
                href="/clubs"
                icon={<Music className="w-5 h-5" />}
                onClick={() => setShowMobileMenu(false)}
              >
                Clubs & Nightlife
              </MobileNavLink>
              <MobileNavLink
                href="/beaches"
                icon={<Sun className="w-5 h-5" />}
                onClick={() => setShowMobileMenu(false)}
              >
                Beach Clubs
              </MobileNavLink>
              <MobileNavLink
                href="/experiences"
                icon={<MapPin className="w-5 h-5" />}
                onClick={() => setShowMobileMenu(false)}
              >
                Experiences
              </MobileNavLink>
              <MobileNavLink
                href="/events"
                icon={<Calendar className="w-5 h-5" />}
                onClick={() => setShowMobileMenu(false)}
              >
                Events
              </MobileNavLink>

              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/host/register"
                  className="flex items-center justify-center gap-2 w-full btn-party py-4"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>List Your Venue</span>
                </Link>
              </div>
            </div>

            {/* Bottom Branding */}
            <div className="absolute bottom-8 left-6 right-6">
              <div className="text-center">
                <p className="text-white/40 text-sm">Discover the magic of</p>
                <p className="text-2xl font-bold text-gradient mt-1">Ibiza Unlocked</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        initialMode={loginMode}
      />

      {/* Spacer for fixed nav */}
      <div className="h-24" />
    </>
  );
}

function NavLink({
  href,
  children,
  icon
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                 text-white/70 hover:text-white hover:bg-white/10
                 transition-all duration-300 group"
    >
      {icon && (
        <span className="text-ibiza-blue-400 group-hover:text-ibiza-cyan-400 transition-colors">
          {icon}
        </span>
      )}
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  icon,
  onClick
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-4 px-5 py-4 rounded-2xl
                 bg-white/5 hover:bg-white/10 border border-white/10
                 text-white font-medium text-lg
                 transition-all duration-300 group"
    >
      {icon && (
        <span className="text-ibiza-blue-400 group-hover:text-ibiza-cyan-400 transition-colors">
          {icon}
        </span>
      )}
      {children}
    </Link>
  );
}
