import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { LanguageProvider } from "@/contexts/LanguageContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#0EA5E9",
};

export const metadata: Metadata = {
  title: "Ibiza Unlocked - Your Gateway to the Island's Best Experiences",
  description:
    "Discover the ultimate Ibiza experience. Beach clubs, world-famous nightlife, hidden gems, and exclusive events. Your adventure starts here.",
  icons: {
    icon: "/images/icons/ibiza-logo.png",
    apple: "/images/icons/ibiza-logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ibiza Unlocked",
  },
  openGraph: {
    title: "Ibiza Unlocked - Your Gateway to Paradise",
    description: "Discover the ultimate Ibiza experience. Beach clubs, world-famous nightlife, hidden gems, and exclusive events.",
    siteName: "Ibiza Unlocked",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ibiza Unlocked - Your Gateway to Paradise",
    description: "Discover the ultimate Ibiza experience. Beach clubs, world-famous nightlife, hidden gems, and exclusive events.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased font-sans">
        <LanguageProvider>
          <Navigation />
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
