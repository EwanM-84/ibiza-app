"use client";

import Link from "next/link";
import { User, Globe, Sparkles } from "lucide-react";
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
  const router = useRouter();
  const supabase = createClientComponentClient();

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
    <nav
      className="relative z-50 px-4 pt-4"
      style={{
        background: "radial-gradient(circle at top left, #F5EBE0 0%, #E8DDD0 40%, #DED0BD 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="px-6 lg:px-8 py-4 animate-fade-in">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 group"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-24 lg:h-24">
                <img
                  src="/images/icons/sptc-logo.jpg"
                  alt="SPTC Rural Logo"
                  className="w-full h-full object-contain rounded-full shadow-lg group-hover:scale-110 transition-transform duration-200"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-base sm:text-lg lg:text-2xl font-bold text-sptc-red-600 tracking-tight">
                  SPTC
                </span>
                <span className="font-sans text-[10px] sm:text-xs lg:text-sm font-semibold text-sptc-gray-700 tracking-widest uppercase mt-0.5">
                  Rural
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink href="/homes">{getText("nav.homes", language)}</NavLink>
              <NavLink href="/experiences">{getText("nav.experiences", language)}</NavLink>
              <NavLink href="/community">{getText("nav.communityProjects", language)}</NavLink>
              <NavLink href="/volunteering">{getText("nav.volunteeringAbroad", language)}</NavLink>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
              <Link
                href="/host/register"
                className="hidden sm:flex items-center space-x-2 btn-primary text-sm lg:text-base"
              >
                <Sparkles className="w-4 h-4" />
                <span>{getText("nav.becomeHost", language)}</span>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="p-3 hover:bg-sptc-gray-100 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
                  aria-label="Change language"
                  title="Change language"
                >
                  <Globe className="w-5 h-5 text-sptc-gray-600" />
                </button>

                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-lg border border-sptc-gray-200 overflow-hidden z-50">
                    <button
                      onClick={() => {
                        setLanguage("en");
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-sptc-gray-50 transition-colors ${
                        language === "en" ? "bg-sptc-red-50 text-sptc-red-600 font-semibold" : "text-sptc-gray-700"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("es");
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-sptc-gray-50 transition-colors ${
                        language === "es" ? "bg-sptc-red-50 text-sptc-red-600 font-semibold" : "text-sptc-gray-700"
                      }`}
                    >
                      Español
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleUserIconClick}
                className="p-3 hover:bg-sptc-gray-100 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label={isLoggedIn ? "Dashboard" : "Login"}
                title={isLoggedIn ? "Go to Dashboard" : "Login"}
              >
                {isLoggedIn && userInitial ? (
                  <div className="w-6 h-6 bg-gradient-to-br from-sptc-red-500 to-sptc-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {userInitial}
                  </div>
                ) : (
                  <User className="w-5 h-5 text-sptc-gray-600" />
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-sptc-gray-100 rounded-xl transition-colors ml-1"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6 text-sptc-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-sptc-gray-200 z-40">
          <div className="px-4 py-3 space-y-1">
            <Link href="/homes" className="block px-4 py-3 rounded-xl text-base font-semibold text-sptc-gray-700 hover:bg-sptc-gray-50" onClick={() => setShowMobileMenu(false)}>
              {getText("nav.homes", language)}
            </Link>
            <Link href="/experiences" className="block px-4 py-3 rounded-xl text-base font-semibold text-sptc-gray-700 hover:bg-sptc-gray-50" onClick={() => setShowMobileMenu(false)}>
              {getText("nav.experiences", language)}
            </Link>
            <Link href="/community" className="block px-4 py-3 rounded-xl text-base font-semibold text-sptc-gray-700 hover:bg-sptc-gray-50" onClick={() => setShowMobileMenu(false)}>
              {getText("nav.communityProjects", language)}
            </Link>
            <Link href="/volunteering" className="block px-4 py-3 rounded-xl text-base font-semibold text-sptc-gray-700 hover:bg-sptc-gray-50" onClick={() => setShowMobileMenu(false)}>
              {getText("nav.volunteeringAbroad", language)}
            </Link>
            <Link
              href="/host/register"
              className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-sptc-red-600 hover:bg-sptc-red-50 flex items-center gap-2"
              onClick={() => setShowMobileMenu(false)}
            >
              <Sparkles className="w-4 h-4" />
              <span>{getText("nav.becomeHost", language)}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        initialMode={loginMode}
      />
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-4 py-2.5 rounded-xl text-sm lg:text-base font-semibold text-sptc-gray-700 hover:text-sptc-gray-900 hover:bg-sptc-gray-50 transition-all duration-200"
    >
      {children}
    </Link>
  );
}
