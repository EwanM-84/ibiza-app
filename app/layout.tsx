import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { LanguageProvider } from "@/contexts/LanguageContext";

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "sptc.rural - Stay local. Support the community.",
  description:
    "Book authentic stays in Colombia and nearby rural areas. Part of every booking supports local community projects.",
  icons: {
    icon: "/images/icons/sptc-logo.jpg",
    apple: "/images/icons/sptc-logo.jpg",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover", // iOS Safari safe area for notched devices
  },
  themeColor: "#DC2626", // sptc-red-600
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SPTC Rural",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${inter.variable}`}>
      <body className="antialiased bg-gray-100 font-sans">
        <LanguageProvider>
          <Navigation />
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
