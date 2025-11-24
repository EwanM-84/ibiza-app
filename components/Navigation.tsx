"use client";

import Link from "next/link";
import { User, Globe, Sparkles, Menu, X } from "lucide-react";
import { getText } from "@/lib/text";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import LoginModal from "./LoginModal";

export default function Navigation() {
  const { language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<"client" | "host" | "admin">("client");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-soft py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 group"
          >
            <div className={`relative transition-all duration-300 ${scrolled ? "w-12 h-12" : "w-14 h-14 sm:w-16 sm:h-16"}`}>
              <img
                src="/images/icons/sptc-logo.jpg"
                alt="SPTC Rural Logo"
                className="w-full h-full object-contain rounded-full shadow-premium group-hover:shadow-premium-lg transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-full border-2 border-white/50 group-hover:border-luxury-gold-400/50 transition-colors duration-300"></div>
            </div>
            <div className="flex flex-col leading-none">
              <span className={`font-display font-bold text-luxury-charcoal-900 tracking-tight transition-all duration-300 ${scrolled ? "text-lg" : "text-xl sm:text-2xl"}`}>
                SPTC
              </span>
              <span className="font-sans text-[10px] sm:text-xs font-medium text-luxury-charcoal-500 tracking-[0.2em] uppercase">
                Rural Colombia
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
          <div className="flex items-center space-x-2 lg:space-x-3">
            <Link
              href="/host/register"
              className="hidden sm:flex items-center space-x-2 bg-luxury-charcoal-900 text-white font-medium px-5 py-2.5 rounded-full shadow-premium hover:shadow-premium-lg hover:bg-luxury-charcoal-800 transition-all duration-300 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{getText("nav.becomeHost", language)}</span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2.5 hover:bg-luxury-cream-200/50 rounded-full transition-all duration-300"
                aria-label="Change language"
                title="Change language"
              >
                <Globe className="w-5 h-5 text-luxury-charcoal-600" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-premium-lg border border-luxury-cream-200 overflow-hidden z-50 animate-fade-in">
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setLanguage("en");
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                        language === "en"
                          ? "bg-luxury-cream-200 text-luxury-charcoal-900 font-semibold"
                          : "text-luxury-charcoal-600 hover:bg-luxury-cream-100"
                      }`}
                    >
                      <span className="mr-2">🇬🇧</span> English
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("es");
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                        language === "es"
                          ? "bg-luxury-cream-200 text-luxury-charcoal-900 font-semibold"
                          : "text-luxury-charcoal-600 hover:bg-luxury-cream-100"
                      }`}
                    >
                      <span className="mr-2">🇪🇸</span> Español
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setLoginMode("client");
                setShowLoginModal(true);
              }}
              className="p-2.5 hover:bg-luxury-cream-200/50 rounded-full transition-all duration-300"
              aria-label="Login"
              title="Login"
            >
              <User className="w-5 h-5 text-luxury-charcoal-600" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2.5 hover:bg-luxury-cream-200/50 rounded-full transition-all duration-300"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6 text-luxury-charcoal-700" />
              ) : (
                <Menu className="w-6 h-6 text-luxury-charcoal-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl shadow-premium-lg border-t border-luxury-cream-200 transition-all duration-300 ${
        showMobileMenu ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}>
        <div className="px-4 py-4 space-y-1">
          <MobileNavLink href="/homes" onClick={() => setShowMobileMenu(false)}>
            {getText("nav.homes", language)}
          </MobileNavLink>
          <MobileNavLink href="/experiences" onClick={() => setShowMobileMenu(false)}>
            {getText("nav.experiences", language)}
          </MobileNavLink>
          <MobileNavLink href="/community" onClick={() => setShowMobileMenu(false)}>
            {getText("nav.communityProjects", language)}
          </MobileNavLink>
          <MobileNavLink href="/volunteering" onClick={() => setShowMobileMenu(false)}>
            {getText("nav.volunteeringAbroad", language)}
          </MobileNavLink>
          <div className="pt-2 mt-2 border-t border-luxury-cream-200">
            <Link
              href="/host/register"
              className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-luxury-charcoal-900 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-luxury-charcoal-800"
              onClick={() => setShowMobileMenu(false)}
            >
              <Sparkles className="w-4 h-4" />
              <span>{getText("nav.becomeHost", language)}</span>
            </Link>
          </div>
        </div>
      </div>

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
      className="relative px-4 py-2.5 text-sm font-medium text-luxury-charcoal-700 hover:text-luxury-charcoal-900 transition-all duration-300 group"
    >
      {children}
      <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-luxury-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      className="block px-4 py-3.5 rounded-xl text-base font-medium text-luxury-charcoal-700 hover:bg-luxury-cream-100 hover:text-luxury-charcoal-900 transition-all duration-200"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
