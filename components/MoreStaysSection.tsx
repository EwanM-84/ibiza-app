"use client";

import { useState, useEffect } from "react";
import { Star, Heart, Home, Plus } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getText } from "@/lib/text";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  location: string;
  city: string;
  region: string;
  price_per_night: number;
  images: string[];
  rating?: number;
  reviews_count?: number;
  host_profile?: {
    first_name: string;
    last_name: string;
  };
}

interface MoreStaysSectionProps {
  language: string;
}

export default function MoreStaysSection({ language }: MoreStaysSectionProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select(`
          id,
          title,
          location,
          city,
          region,
          price_per_night,
          images,
          host_profile_id,
          host_profiles (
            first_name,
            last_name
          )
        `)
        .eq("status", "active")
        .eq("available", true)
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) {
        console.error("Error fetching listings:", error);
      } else {
        setListings(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Show placeholder state when no listings
  if (!loading && listings.length === 0) {
    return (
      <section
        className="py-20 px-4"
        style={{
          background:
            "radial-gradient(circle at top left, #F5EBE0 0%, #E8DDD0 40%, #DED0BD 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">
            {getText("moreStays.title", language)}
          </h2>

          {/* Empty state - encouraging hosts to add listings */}
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-sptc-red-100 to-sptc-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-10 h-10 text-sptc-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Be the first to list your property
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              No accommodations listed yet. If you're a verified host, add your first listing and start welcoming guests to rural Colombia.
            </p>
            <Link
              href="/host/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold rounded-xl hover:from-sptc-red-700 hover:to-sptc-red-800 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Your Listing
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-20 px-4"
      style={{
        background:
          "radial-gradient(circle at top left, #F5EBE0 0%, #E8DDD0 40%, #DED0BD 100%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">
          {getText("moreStays.title", language)}
        </h2>

        {loading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 rounded-2xl h-72 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const imageUrl =
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80";

  const locationDisplay = listing.city
    ? `${listing.city}${listing.region ? `, ${listing.region}` : ""}`
    : listing.location;

  return (
    <Link href={`/listing/${listing.id}`} className="group cursor-pointer block">
      <div className="relative mb-4 overflow-hidden rounded-2xl">
        <img
          src={imageUrl}
          alt={listing.title}
          className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Add to favorites"
          title="Add to favorites"
        >
          <Heart className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900 truncate flex-1 mr-2">
            {listing.title}
          </h3>
          {listing.rating && (
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Star className="w-4 h-4 fill-current text-gray-900" />
              <span className="text-sm font-semibold">{listing.rating}</span>
              {listing.reviews_count && (
                <span className="text-sm text-gray-600">
                  ({listing.reviews_count})
                </span>
              )}
            </div>
          )}
        </div>
        <p className="text-gray-600 truncate">{locationDisplay}</p>
        <p className="text-gray-900">
          <span className="font-bold text-lg">
            ${listing.price_per_night}
          </span>
          <span className="text-gray-600"> / night</span>
        </p>
      </div>
    </Link>
  );
}
