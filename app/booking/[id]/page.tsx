"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  ChevronLeft,
  Calendar,
  Users,
  Bed,
  UtensilsCrossed,
  Accessibility,
  ChevronDown,
  ChevronUp,
  Check,
  Shield,
  MapPin,
  Star,
  Home,
  Info,
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
}

interface Guest {
  type: "adult" | "child";
  age?: number;
}

interface Room {
  id: string;
  name: string;
  beds: number;
  bedType: string;
  available: boolean;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const { language } = useLanguage();
  const t = (key: string) => getText(key, language);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking details
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [guests, setGuests] = useState<Guest[]>([{ type: "adult" }]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // Dietary needs
  const [hasDietaryNeeds, setHasDietaryNeeds] = useState(false);
  const [dietaryNeeds, setDietaryNeeds] = useState<string[]>([]);
  const [otherDietary, setOtherDietary] = useState("");

  // Accessibility needs
  const [hasAccessibilityNeeds, setHasAccessibilityNeeds] = useState(false);
  const [accessibilityNeeds, setAccessibilityNeeds] = useState<string[]>([]);
  const [otherAccessibility, setOtherAccessibility] = useState("");

  // UI states
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [showDietarySection, setShowDietarySection] = useState(false);
  const [showAccessibilitySection, setShowAccessibilitySection] = useState(false);

  // Mock rooms - in production this would come from database
  const availableRooms: Room[] = [
    { id: "room1", name: "Master Bedroom", beds: 1, bedType: "King", available: true },
    { id: "room2", name: "Guest Room 1", beds: 2, bedType: "Single", available: true },
    { id: "room3", name: "Guest Room 2", beds: 1, bedType: "Queen", available: true },
  ];

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-free",
    "Dairy-free",
    "Nut allergy",
    "Halal",
    "Kosher",
    "Shellfish allergy",
  ];

  const accessibilityOptions = [
    "Wheelchair access required",
    "Ground floor room needed",
    "Grab rails in bathroom",
    "Roll-in shower",
    "Visual aids (large print)",
    "Hearing aids (visual alerts)",
    "Service animal accommodation",
  ];

  useEffect(() => {
    if (params.id) {
      fetchListing(params.id as string);
    }
  }, [params.id]);

  const fetchListing = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setListing(data);

      // Initialize rooms based on listing bedrooms
      if (data.bedrooms > 0 && !selectedRoom) {
        setSelectedRoom("room1");
      }
    } catch (err: any) {
      console.error("Error fetching listing:", err);
    } finally {
      setLoading(false);
    }
  };

  const addGuest = (type: "adult" | "child") => {
    if (listing && guests.length < listing.max_guests) {
      setGuests([...guests, { type, age: type === "child" ? 5 : undefined }]);
    }
  };

  const removeGuest = (index: number) => {
    if (guests.length > 1) {
      setGuests(guests.filter((_, i) => i !== index));
    }
  };

  const updateChildAge = (index: number, age: number) => {
    const newGuests = [...guests];
    newGuests[index].age = age;
    setGuests(newGuests);
  };

  const toggleDietary = (option: string) => {
    if (dietaryNeeds.includes(option)) {
      setDietaryNeeds(dietaryNeeds.filter((d) => d !== option));
    } else {
      setDietaryNeeds([...dietaryNeeds, option]);
    }
  };

  const toggleAccessibility = (option: string) => {
    if (accessibilityNeeds.includes(option)) {
      setAccessibilityNeeds(accessibilityNeeds.filter((a) => a !== option));
    } else {
      setAccessibilityNeeds([...accessibilityNeeds, option]);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const calculateTotal = () => {
    if (!listing) return 0;
    const nights = calculateNights();
    const subtotal = listing.price_per_night * nights;
    const serviceFee = Math.round(subtotal * 0.12);
    return subtotal + serviceFee;
  };

  const handleContinue = () => {
    // Validate required fields
    if (!checkIn || !checkOut) {
      alert(t("bookingPage.selectDatesAlert"));
      return;
    }
    if (calculateNights() < 1) {
      alert(t("bookingPage.checkOutAfterCheckIn"));
      return;
    }

    // Build query params for payment page
    const queryParams = new URLSearchParams({
      checkIn,
      checkOut,
      guests: JSON.stringify(guests),
      room: selectedRoom || "",
      dietaryNeeds: JSON.stringify(hasDietaryNeeds ? [...dietaryNeeds, otherDietary].filter(Boolean) : []),
      accessibilityNeeds: JSON.stringify(hasAccessibilityNeeds ? [...accessibilityNeeds, otherAccessibility].filter(Boolean) : []),
      nights: calculateNights().toString(),
      total: calculateTotal().toString(),
    });

    router.push(`/payment/${params.id}?${queryParams.toString()}`);
  };

  const adultsCount = guests.filter((g) => g.type === "adult").length;
  const childrenCount = guests.filter((g) => g.type === "child").length;
  const nights = calculateNights();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sptc-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t("bookingPage.loading")}</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("bookingPage.listingNotFound")}
          </h1>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-sptc-red-600 text-white font-bold rounded-xl hover:bg-sptc-red-700 transition-all"
          >
            {t("bookingPage.backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">{t("bookingPage.backToListing")}</span>
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4 text-green-600" />
              <span>{t("bookingPage.secureBooking")}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sptc-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <span className="font-semibold text-gray-900">{t("bookingPage.bookingDetails")}</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <span className="text-gray-500">{t("bookingPage.payment")}</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span className="text-gray-500">{t("bookingPage.confirmation")}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  {listing.images?.[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Home className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    {listing.title}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {listing.city}, {listing.country}
                    </span>
                  </div>
                  {listing.rating > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-current text-yellow-500" />
                      <span className="font-semibold">{listing.rating}</span>
                      <span className="text-gray-500">
                        ({listing.reviews_count} {t("bookingPage.reviews")})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dates Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-sptc-red-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-sptc-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t("bookingPage.yourDates")}</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("bookingPage.checkInDate")}
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sptc-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("bookingPage.checkOutDate")}
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sptc-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                  />
                </div>
              </div>

              {nights > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{nights} {nights !== 1 ? t("bookingPage.nights") : t("bookingPage.night")}</span>
                    {" "}· {new Date(checkIn).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    {" → "}
                    {new Date(checkOut).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </p>
                </div>
              )}
            </div>

            {/* Room Selection */}
            {listing.bedrooms > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-sptc-red-100 rounded-xl flex items-center justify-center">
                    <Bed className="w-5 h-5 text-sptc-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{t("bookingPage.selectRoom")}</h3>
                </div>

                <div className="space-y-3">
                  {availableRooms.slice(0, listing.bedrooms).map((room) => (
                    <label
                      key={room.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedRoom === room.id
                          ? "border-sptc-red-600 bg-sptc-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="room"
                          value={room.id}
                          checked={selectedRoom === room.id}
                          onChange={() => setSelectedRoom(room.id)}
                          className="w-5 h-5 text-sptc-red-600 focus:ring-sptc-red-500"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{room.name}</p>
                          <p className="text-sm text-gray-600">
                            {room.beds} {room.bedType} bed{room.beds > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      {room.available && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          {t("bookingPage.available")}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Guests Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-sptc-red-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-sptc-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t("bookingPage.guests")}</h3>
              </div>

              <div className="space-y-4">
                {/* Guest Counter */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">{t("bookingPage.adults")}</p>
                    <p className="text-sm text-gray-500">{t("bookingPage.ageAdults")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const adult = guests.findIndex((g) => g.type === "adult");
                        if (adult !== -1 && adultsCount > 1) removeGuest(adult);
                      }}
                      disabled={adultsCount <= 1}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-lg">{adultsCount}</span>
                    <button
                      onClick={() => addGuest("adult")}
                      disabled={guests.length >= listing.max_guests}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">{t("bookingPage.children")}</p>
                    <p className="text-sm text-gray-500">{t("bookingPage.ageChildren")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const child = guests.findIndex((g) => g.type === "child");
                        if (child !== -1) removeGuest(child);
                      }}
                      disabled={childrenCount <= 0}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-lg">{childrenCount}</span>
                    <button
                      onClick={() => addGuest("child")}
                      disabled={guests.length >= listing.max_guests}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children Age Selection */}
                {childrenCount > 0 && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-3">{t("bookingPage.childrensAges")}</p>
                    <div className="flex flex-wrap gap-3">
                      {guests.map((guest, index) =>
                        guest.type === "child" ? (
                          <select
                            key={index}
                            value={guest.age || 5}
                            onChange={(e) => updateChildAge(index, parseInt(e.target.value))}
                            className="px-3 py-2 border border-blue-300 rounded-lg bg-white text-sm focus:border-blue-500 outline-none"
                          >
                            {Array.from({ length: 12 }, (_, i) => (
                              <option key={i} value={i}>
                                {i === 0 ? t("bookingPage.underOne") : `${i} ${t("bookingPage.years")}`}
                              </option>
                            ))}
                          </select>
                        ) : null
                      )}
                    </div>
                  </div>
                )}

                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {t("bookingPage.maxGuests").replace("{count}", listing.max_guests.toString())}
                </p>
              </div>
            </div>

            {/* Dietary Needs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowDietarySection(!showDietarySection)}
                className="w-full flex items-center justify-between p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900">{t("bookingPage.dietaryRequirements")}</h3>
                    <p className="text-sm text-gray-500">{t("bookingPage.dietaryOptional")}</p>
                  </div>
                </div>
                {showDietarySection ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {showDietarySection && (
                <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                  <label className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      checked={hasDietaryNeeds}
                      onChange={(e) => setHasDietaryNeeds(e.target.checked)}
                      className="w-5 h-5 text-sptc-red-600 rounded focus:ring-sptc-red-500"
                    />
                    <span className="font-medium text-gray-900">{t("bookingPage.hasDietaryNeeds")}</span>
                  </label>

                  {hasDietaryNeeds && (
                    <div className="space-y-4 ml-8">
                      <div className="flex flex-wrap gap-2">
                        {dietaryOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => toggleDietary(option)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              dietaryNeeds.includes(option)
                                ? "bg-orange-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {dietaryNeeds.includes(option) && <Check className="w-4 h-4 inline mr-1" />}
                            {option}
                          </button>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("bookingPage.otherDietaryNeeds")}
                        </label>
                        <input
                          type="text"
                          value={otherDietary}
                          onChange={(e) => setOtherDietary(e.target.value)}
                          placeholder={t("bookingPage.otherDietaryPlaceholder")}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Accessibility Needs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowAccessibilitySection(!showAccessibilitySection)}
                className="w-full flex items-center justify-between p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Accessibility className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900">{t("bookingPage.accessibilityNeeds")}</h3>
                    <p className="text-sm text-gray-500">{t("bookingPage.accessibilityOptional")}</p>
                  </div>
                </div>
                {showAccessibilitySection ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {showAccessibilitySection && (
                <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                  <label className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      checked={hasAccessibilityNeeds}
                      onChange={(e) => setHasAccessibilityNeeds(e.target.checked)}
                      className="w-5 h-5 text-sptc-red-600 rounded focus:ring-sptc-red-500"
                    />
                    <span className="font-medium text-gray-900">{t("bookingPage.hasAccessibilityNeeds")}</span>
                  </label>

                  {hasAccessibilityNeeds && (
                    <div className="space-y-4 ml-8">
                      <div className="space-y-2">
                        {accessibilityOptions.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={accessibilityNeeds.includes(option)}
                              onChange={() => toggleAccessibility(option)}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("bookingPage.otherAccessibilityNeeds")}
                        </label>
                        <textarea
                          value={otherAccessibility}
                          onChange={(e) => setOtherAccessibility(e.target.value)}
                          placeholder={t("bookingPage.otherAccessibilityPlaceholder")}
                          rows={3}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Summary & Continue */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 px-6 py-4">
                <h3 className="text-lg font-bold text-white">{t("bookingPage.bookingSummary")}</h3>
              </div>

              <div className="p-6 space-y-4">
                {/* Dates Summary */}
                {nights > 0 && (
                  <div className="pb-4 border-b border-gray-200">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">{t("bookingPage.checkIn")}</span>
                      <span className="font-medium text-gray-900">
                        {new Date(checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("bookingPage.checkOut")}</span>
                      <span className="font-medium text-gray-900">
                        {new Date(checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                )}

                {/* Guests Summary */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t("bookingPage.guests")}</span>
                    <span className="font-medium text-gray-900">
                      {adultsCount} adult{adultsCount !== 1 ? "s" : ""}
                      {childrenCount > 0 && `, ${childrenCount} child${childrenCount !== 1 ? "ren" : ""}`}
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      ${listing.price_per_night} × {nights || 0} {nights !== 1 ? t("bookingPage.nights") : t("bookingPage.night")}
                    </span>
                    <span className="text-gray-900">${(listing.price_per_night * (nights || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t("bookingPage.serviceFee")}</span>
                    <span className="text-gray-900">${Math.round(listing.price_per_night * (nights || 0) * 0.12).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-900">{t("bookingPage.total")}</span>
                    <span className="text-lg font-bold text-gray-900">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  disabled={!checkIn || !checkOut || nights < 1}
                  className="w-full py-4 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 hover:from-sptc-red-700 hover:to-sptc-red-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {t("bookingPage.continueToPayment")}
                </button>

                <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  {t("bookingPage.secureCheckout")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
