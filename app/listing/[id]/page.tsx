"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Bed,
  Bath,
  Star,
  Heart,
  Share,
  Home,
  X,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/lib/text";

interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  region: string;
  country: string;
  price_per_night: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  property_type: string;
  images: string[];
  amenities: string[];
  rating: number;
  reviews_count: number;
  host_profiles?: {
    first_name: string;
    last_name: string;
    city: string;
    country: string;
  };
}

// Booking Card Component
function BookingCard({ listing, initialCheckIn, initialCheckOut, initialGuests }: {
  listing: Listing;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}) {
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: string) => getText(key, language);
  const [checkIn, setCheckIn] = useState(initialCheckIn || "");
  const [checkOut, setCheckOut] = useState(initialCheckOut || "");
  const [guests, setGuests] = useState(initialGuests || 1);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();
  const subtotal = listing.price_per_night * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  const handleBooking = () => {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: guests.toString(),
    });
    router.push(`/booking/${listing.id}?${params.toString()}`);
  };

  return (
    <div className="sticky top-20 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Price Header */}
      <div className="bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 px-6 py-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">
            ${listing.price_per_night}
          </span>
          <span className="text-white/80 text-sm">{t("listingPage.perNight")}</span>
        </div>
      </div>

      <div className="p-6">
        {/* Date inputs */}
        <div className="space-y-4 mb-6">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-gray-300">
              <div className="p-3">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  {t("listingPage.checkIn")}
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full text-sm text-gray-900 outline-none bg-transparent"
                />
              </div>
              <div className="p-3">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  {t("listingPage.checkOut")}
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  className="w-full text-sm text-gray-900 outline-none bg-transparent"
                />
              </div>
            </div>
            <div className="border-t border-gray-300 p-3">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                {t("listingPage.guests")}
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full text-sm text-gray-900 outline-none bg-transparent"
              >
                {Array.from({ length: listing.max_guests }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? t("listingPage.guest") : t("listingPage.guestsPlural")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleBooking}
          className="w-full py-3.5 bg-sptc-red-600 hover:bg-sptc-red-700 text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          {t("listingPage.requestBooking")}
        </button>

        <p className="text-center text-xs text-gray-500 mt-3">
          {t("listingPage.wontBeCharged")}
        </p>

        {/* Price breakdown preview */}
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 underline decoration-dotted">
              ${listing.price_per_night} x {nights || 1} {nights !== 1 ? t("bookingPage.nights") : t("bookingPage.night")}
            </span>
            <span className="text-gray-900">${nights > 0 ? subtotal : listing.price_per_night}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 underline decoration-dotted">
              {t("listingPage.serviceFee")}
            </span>
            <span className="text-gray-900">${nights > 0 ? serviceFee : 0}</span>
          </div>
          <div className="flex justify-between font-semibold pt-3 border-t border-gray-200">
            <span>{t("listingPage.total")}</span>
            <span>${nights > 0 ? total : listing.price_per_night}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const { language } = useLanguage();
  const t = (key: string) => getText(key, language);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  // Get dates and guests from URL search params (from search page)
  const checkInParam = searchParams.get("checkIn") || "";
  const checkOutParam = searchParams.get("checkOut") || "";
  const adultsParam = parseInt(searchParams.get("adults") || "1");
  const childrenParam = parseInt(searchParams.get("children") || "0");
  const totalGuests = adultsParam + childrenParam;

  useEffect(() => {
    if (params.id) {
      fetchListing(params.id as string);
    }
  }, [params.id]);

  const fetchListing = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select(`
          *,
          host_profiles (
            first_name,
            last_name,
            city,
            country
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setListing(data);
    } catch (err: any) {
      console.error("Error fetching listing:", err);
      setError("Listing not found");
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (!listing?.images) return;
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!listing?.images) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sptc-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t("listingPage.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("listingPage.listingNotFound")}
          </h1>
          <p className="text-gray-600 mb-6">
            {t("listingPage.listingNotAvailable")}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-sptc-red-600 text-white font-bold rounded-xl hover:bg-sptc-red-700 transition-all"
          >
            {t("listingPage.backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  const images = listing.images || [];
  const mainImage = images[currentImageIndex] || images[0];
  const hostProfile = listing.host_profiles;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sptc-red-600 hover:text-sptc-red-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">{t("listingPage.backToResults")}</span>
          </button>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Share className="w-4 h-4" />
              <span className="hidden sm:inline">{t("listingPage.share")}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">{t("listingPage.save")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Title Section */}
        <div className="mb-6">
          <h1
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {listing.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            {listing.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-yellow-500" />
                <span className="font-semibold text-gray-900">{listing.rating}</span>
                {listing.reviews_count > 0 && (
                  <span>({listing.reviews_count} reviews)</span>
                )}
              </div>
            )}
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>
                {listing.city}
                {listing.region && `, ${listing.region}`}
                {listing.country && `, ${listing.country}`}
              </span>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Gallery + Booking */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Photo Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
              {/* Main Image */}
              <div
                className="relative aspect-[16/10] cursor-pointer group"
                onClick={() => setShowGallery(true)}
              >
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Home className="w-20 h-20 text-gray-400" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                {/* View all photos button */}
                {images.length > 1 && (
                  <button
                    onClick={() => setShowGallery(true)}
                    className="absolute bottom-4 right-4 px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    {t("listingPage.showAllPhotos").replace("{count}", images.length.toString())}
                  </button>
                )}
              </div>

              {/* Thumbnail Grid */}
              {images.length > 1 && (
                <div className="p-3 border-t border-gray-100">
                  <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-2">
                    {images.slice(0, 5).map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                          index === currentImageIndex
                            ? "ring-2 ring-sptc-red-600 ring-offset-2"
                            : "hover:opacity-80"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === 4 && images.length > 5 && (
                          <div
                            className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowGallery(true);
                            }}
                          >
                            <span className="text-white font-semibold text-sm">+{images.length - 5}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Details Card */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Property Stats */}
              <div className="flex flex-wrap gap-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {listing.property_type || "House"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {listing.max_guests} guests
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Bed className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Bath className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Host Info */}
              {hostProfile && (
                <div className="flex items-center gap-4 py-6 border-b border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-sptc-red-500 to-sptc-red-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {hostProfile.first_name?.charAt(0) || "H"}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {t("listingPage.hostedBy")} {hostProfile.first_name} {hostProfile.last_name}
                    </p>
                    {hostProfile.city && (
                      <p className="text-sm text-gray-600">
                        {hostProfile.city}
                        {hostProfile.country && `, ${hostProfile.country}`}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  {t("listingPage.aboutProperty")}
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {listing.description || t("listingPage.noDescription")}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1">
            <BookingCard
              listing={listing}
              initialCheckIn={checkInParam}
              initialCheckOut={checkOutParam}
              initialGuests={totalGuests}
            />
          </div>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="h-full flex items-center justify-center p-4">
            {mainImage && (
              <img
                src={mainImage}
                alt={listing.title}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </>
          )}

          {/* Thumbnail strip in gallery */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-xl overflow-x-auto max-w-full">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex
                    ? "border-white scale-110"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
