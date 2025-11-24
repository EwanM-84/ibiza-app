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
        sptc: {
          red: {
            50: "#F0FDFA",
            100: "#CCFBF1",
            200: "#99F6E4",
            300: "#5EEAD4",
            400: "#2DD4BF",
            500: "#14B8A6",
            600: "#0D9488",
            700: "#0F766E",
            800: "#115E59",
            900: "#134E4A",
          },
          yellow: {
            50: "#FFFEF0",
            100: "#FFFBDB",
            200: "#FFF4A3",
            300: "#FFED72",
            400: "#FFE03D",
            500: "#FFC72C",
            600: "#FAAF00",
            700: "#D69200",
            800: "#B37700",
            900: "#8F5F00",
          },
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
        // Premium color palette
        luxury: {
          gold: {
            50: "#FFFDF5",
            100: "#FEF9E7",
            200: "#FCF0C3",
            300: "#F9E49A",
            400: "#F5D56E",
            500: "#D4AF37",
            600: "#B8942F",
            700: "#9A7B26",
            800: "#7C631E",
            900: "#5E4B17",
          },
          cream: {
            50: "#FDFCFA",
            100: "#FAF8F5",
            200: "#F5F1EB",
            300: "#EDE6DC",
            400: "#E2D8C8",
            500: "#D4C5AE",
          },
          charcoal: {
            50: "#F7F7F7",
            100: "#E3E3E3",
            200: "#C8C8C8",
            300: "#A4A4A4",
            400: "#818181",
            500: "#666666",
            600: "#515151",
            700: "#434343",
            800: "#383838",
            900: "#1A1A1A",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-dm-serif)", "Georgia", "serif"],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "display-md": ["2.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "display-sm": ["1.875rem", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" }],
      },
      boxShadow: {
        "ios-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        ios: "0 2px 12px rgba(0, 0, 0, 0.08)",
        "ios-md": "0 4px 16px rgba(0, 0, 0, 0.1)",
        "ios-lg": "0 8px 32px rgba(0, 0, 0, 0.12)",
        "ios-xl": "0 12px 48px rgba(0, 0, 0, 0.15)",
        "ios-2xl": "0 24px 64px rgba(0, 0, 0, 0.18)",
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        "inner-glow": "inset 0 1px 2px 0 rgba(255, 255, 255, 0.5)",
        // Premium shadows
        "premium": "0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 12px 40px -4px rgba(0, 0, 0, 0.15)",
        "premium-lg": "0 8px 30px -4px rgba(0, 0, 0, 0.12), 0 20px 60px -8px rgba(0, 0, 0, 0.18)",
        "premium-xl": "0 12px 40px -6px rgba(0, 0, 0, 0.15), 0 32px 80px -12px rgba(0, 0, 0, 0.22)",
        "gold-glow": "0 4px 20px -2px rgba(212, 175, 55, 0.25), 0 12px 40px -4px rgba(212, 175, 55, 0.15)",
        "soft": "0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-mesh": "linear-gradient(135deg, var(--tw-gradient-stops))",
        // Premium gradients
        "premium-gradient": "linear-gradient(135deg, #F5EBE0 0%, #E8DDD0 50%, #DED0BD 100%)",
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #F5D56E 50%, #D4AF37 100%)",
        "luxury-dark": "linear-gradient(180deg, #1A1A1A 0%, #2D2D2D 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        float: "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
