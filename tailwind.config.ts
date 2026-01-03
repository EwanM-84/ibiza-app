import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Ibiza Unlocked Brand Colors
        ibiza: {
          // Baby Blue - Primary brand color
          blue: {
            50: "#F0F9FF",
            100: "#E0F2FE",
            200: "#BAE6FD",
            300: "#7DD3FC",
            400: "#38BDF8",
            500: "#0EA5E9",
            600: "#0284C7",
            700: "#0369A1",
            800: "#075985",
            900: "#0C4A6E",
          },
          // Deep Night - For dark explosive themes
          night: {
            50: "#F8FAFC",
            100: "#1E293B",
            200: "#1A1F2E",
            300: "#151923",
            400: "#10131A",
            500: "#0B0D12",
            600: "#08090D",
            700: "#050608",
            800: "#030304",
            900: "#000000",
          },
          // Electric Cyan - Accent for clubs/nightlife
          cyan: {
            50: "#ECFEFF",
            100: "#CFFAFE",
            200: "#A5F3FC",
            300: "#67E8F9",
            400: "#22D3EE",
            500: "#06B6D4",
            600: "#0891B2",
            700: "#0E7490",
            800: "#155E75",
            900: "#164E63",
          },
          // Sunset Pink - For energy/party vibes
          pink: {
            50: "#FDF2F8",
            100: "#FCE7F3",
            200: "#FBCFE8",
            300: "#F9A8D4",
            400: "#F472B6",
            500: "#EC4899",
            600: "#DB2777",
            700: "#BE185D",
            800: "#9D174D",
            900: "#831843",
          },
          // Electric Purple - Nightclub accent
          purple: {
            50: "#FAF5FF",
            100: "#F3E8FF",
            200: "#E9D5FF",
            300: "#D8B4FE",
            400: "#C084FC",
            500: "#A855F7",
            600: "#9333EA",
            700: "#7C3AED",
            800: "#6B21A8",
            900: "#581C87",
          },
          // Gray scale for UI
          gray: {
            50: "#FAFAFA",
            100: "#F5F5F5",
            200: "#E5E5E5",
            300: "#D4D4D4",
            400: "#A3A3A3",
            500: "#737373",
            600: "#525252",
            700: "#404040",
            800: "#262626",
            900: "#171717",
            950: "#0A0A0A",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "San Francisco", "Segoe UI", "sans-serif"],
        display: ["var(--font-outfit)", "var(--font-inter)", "-apple-system", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-xl": ["3.75rem", { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "800" }],
        "display-lg": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "700" }],
        "display-sm": ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
      },
      boxShadow: {
        // iOS-style shadows
        "ios-sm": "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
        ios: "0 4px 14px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)",
        "ios-md": "0 6px 20px rgba(0, 0, 0, 0.1), 0 3px 8px rgba(0, 0, 0, 0.05)",
        "ios-lg": "0 12px 40px rgba(0, 0, 0, 0.12), 0 6px 16px rgba(0, 0, 0, 0.06)",
        "ios-xl": "0 20px 60px rgba(0, 0, 0, 0.15), 0 10px 24px rgba(0, 0, 0, 0.08)",
        "ios-2xl": "0 32px 80px rgba(0, 0, 0, 0.18), 0 16px 40px rgba(0, 0, 0, 0.1)",
        // Glow effects for nightlife
        "glow-blue": "0 0 20px rgba(14, 165, 233, 0.4), 0 0 40px rgba(14, 165, 233, 0.2)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)",
        "glow-pink": "0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(236, 72, 153, 0.2)",
        "glow-purple": "0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)",
        "glow-white": "0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.15)",
        // Glass effects
        "glass": "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
        "glass-dark": "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.05)",
        "inner-glow": "inset 0 1px 2px rgba(255, 255, 255, 0.5)",
        "inner-glow-blue": "inset 0 1px 2px rgba(14, 165, 233, 0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // Ibiza gradients
        "ibiza-gradient": "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 50%, #0EA5E9 100%)",
        "ibiza-dark": "linear-gradient(180deg, #0B0D12 0%, #151923 50%, #0B0D12 100%)",
        "ibiza-night": "linear-gradient(135deg, #0B0D12 0%, #1A1F2E 25%, #0B0D12 50%, #1A1F2E 75%, #0B0D12 100%)",
        "ibiza-party": "linear-gradient(135deg, #EC4899 0%, #A855F7 50%, #06B6D4 100%)",
        "ibiza-sunset": "linear-gradient(180deg, #0EA5E9 0%, #A855F7 50%, #EC4899 100%)",
        "ibiza-ocean": "linear-gradient(180deg, #0EA5E9 0%, #06B6D4 100%)",
        "mesh-gradient": "radial-gradient(at 40% 20%, rgba(14, 165, 233, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(6, 182, 212, 0.3) 0px, transparent 50%), radial-gradient(at 80% 50%, rgba(236, 72, 153, 0.2) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(14, 165, 233, 0.3) 0px, transparent 50%)",
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "bounce-soft": "bounceSoft 2s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "party-lights": "partyLights 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(14, 165, 233, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(14, 165, 233, 0.8), 0 0 60px rgba(14, 165, 233, 0.4)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        partyLights: {
          "0%": { filter: "hue-rotate(0deg)" },
          "33%": { filter: "hue-rotate(60deg)" },
          "66%": { filter: "hue-rotate(-60deg)" },
          "100%": { filter: "hue-rotate(0deg)" },
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
