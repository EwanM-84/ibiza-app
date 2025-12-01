"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  ChevronLeft,
  Shield,
  Lock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Home,
  MapPin,
  Calendar,
  Users,
  Eye,
  EyeOff,
  Info,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/lib/text";

interface Listing {
  id: string;
  title: string;
  city: string;
  country: string;
  price_per_night: number;
  images: string[];
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const { language } = useLanguage();
  const t = (key: string) => getText(key, language);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Payment form fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCvv, setShowCvv] = useState(false);

  // Billing address
  const [billingEmail, setBillingEmail] = useState("");
  const [billingCountry, setBillingCountry] = useState("United States");
  const [billingZip, setBillingZip] = useState("");

  // Terms
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Get booking details from URL params
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const nights = parseInt(searchParams.get("nights") || "0");
  const total = parseFloat(searchParams.get("total") || "0");
  const guests = JSON.parse(searchParams.get("guests") || "[]");

  const adultsCount = guests.filter((g: any) => g.type === "adult").length;
  const childrenCount = guests.filter((g: any) => g.type === "child").length;

  useEffect(() => {
    if (params.id) {
      fetchListing(params.id as string);
    }
  }, [params.id]);

  const fetchListing = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, city, country, price_per_night, images")
        .eq("id", id)
        .single();

      if (error) throw error;
      setListing(data);
    } catch (err: any) {
      console.error("Error fetching listing:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  // Get card type
  const getCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, "");
    if (cleanNumber.startsWith("4")) return "visa";
    if (/^5[1-5]/.test(cleanNumber)) return "mastercard";
    if (/^3[47]/.test(cleanNumber)) return "amex";
    if (/^6(?:011|5)/.test(cleanNumber)) return "discover";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      alert(t("paymentPage.acceptTermsAlert"));
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    // In production, this would integrate with Stripe
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setProcessing(false);
    setPaymentSuccess(true);
  };

  const cardType = getCardType(cardNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sptc-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t("paymentPage.loading")}</p>
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
            {t("paymentPage.listingNotFound")}
          </h1>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-sptc-red-600 text-white font-bold rounded-xl hover:bg-sptc-red-700 transition-all"
          >
            {t("paymentPage.backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  // Success State
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {t("paymentPage.bookingConfirmed")}
          </h1>
          <p className="text-gray-600 mb-6">
            {t("paymentPage.reservationSuccess").replace("{title}", listing.title)}
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("paymentPage.confirmationNumber")}</span>
                <span className="font-mono font-bold text-gray-900">
                  SPTC-{Math.random().toString(36).substr(2, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("bookingPage.checkIn")}</span>
                <span className="font-semibold text-gray-900">
                  {new Date(checkIn).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("bookingPage.checkOut")}</span>
                <span className="font-semibold text-gray-900">
                  {new Date(checkOut).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-3 border-t border-gray-200">
                <span className="text-gray-600">{t("paymentPage.totalPaid")}</span>
                <span className="font-bold text-lg text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            {t("paymentPage.confirmationEmailSent").replace("{email}", billingEmail || "your email address")}
          </p>

          <div className="space-y-3">
            <Link
              href={`/listing/${params.id}`}
              className="block w-full py-3 bg-sptc-red-600 hover:bg-sptc-red-700 text-white font-bold rounded-xl transition-colors"
            >
              {t("paymentPage.viewBookingDetails")}
            </Link>
            <Link
              href="/"
              className="block w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              {t("paymentPage.backToHome")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Secure Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">{t("paymentPage.backToBooking")}</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-full">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-semibold">{t("paymentPage.sslSecured")}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium hidden sm:inline">{t("paymentPage.encryption")}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-gray-500">{t("paymentPage.bookingDetails")}</span>
            </div>
            <div className="w-16 h-0.5 bg-sptc-red-600" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sptc-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <span className="font-semibold text-gray-900">{t("paymentPage.payment")}</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span className="text-gray-500">{t("paymentPage.confirmation")}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Card Header with Trust Indicators */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">{t("paymentPage.paymentMethod")}</h2>
                        <p className="text-sm text-white/70">{t("paymentPage.secureEncrypted")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Card brand logos */}
                      <div className="bg-white rounded px-2 py-1">
                        <svg className="h-6 w-10" viewBox="0 0 50 16" fill="none">
                          <rect width="50" height="16" rx="2" fill="#1A1F71"/>
                          <path d="M19.5 12.5L21.5 3.5H24L22 12.5H19.5Z" fill="white"/>
                          <path d="M32 3.5L29.5 9.5L29 6.5C29 6.5 28.5 3.5 25.5 3.5H21L21 3.7C21 3.7 24 4.2 26.5 6.5L29 12.5H32L36 3.5H32Z" fill="white"/>
                          <path d="M15 3.5L12 9L11.5 3.5H8L10.5 12.5H13.5L18 3.5H15Z" fill="white"/>
                        </svg>
                      </div>
                      <div className="bg-white rounded px-2 py-1">
                        <svg className="h-6 w-10" viewBox="0 0 50 16" fill="none">
                          <circle cx="18" cy="8" r="8" fill="#EB001B"/>
                          <circle cx="32" cy="8" r="8" fill="#F79E1B"/>
                          <path d="M25 2.5C26.8 3.9 28 6 28 8C28 10 26.8 12.1 25 13.5C23.2 12.1 22 10 22 8C22 6 23.2 3.9 25 2.5Z" fill="#FF5F00"/>
                        </svg>
                      </div>
                      <div className="bg-white rounded px-2 py-1">
                        <svg className="h-6 w-10" viewBox="0 0 50 16" fill="none">
                          <rect width="50" height="16" rx="2" fill="#006FCF"/>
                          <text x="4" y="11" fill="white" fontSize="8" fontWeight="bold">AMEX</text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("paymentPage.cardNumber")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-4 pr-16 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg tracking-wider font-mono"
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {cardType === "visa" && (
                          <div className="bg-blue-900 text-white text-xs font-bold px-2 py-1 rounded">VISA</div>
                        )}
                        {cardType === "mastercard" && (
                          <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">MC</div>
                        )}
                        {cardType === "amex" && (
                          <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">AMEX</div>
                        )}
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("paymentPage.cardholderName")}
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      placeholder="JOHN DOE"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all uppercase tracking-wide"
                      required
                    />
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("paymentPage.expiryDate")}
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        maxLength={5}
                        placeholder="MM/YY"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-center tracking-widest font-mono text-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        {t("paymentPage.securityCode")}
                        <Info className="w-4 h-4 text-gray-400 cursor-help" title="3 or 4 digit code on the back of your card" />
                      </label>
                      <div className="relative">
                        <input
                          type={showCvv ? "text" : "password"}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          maxLength={4}
                          placeholder="***"
                          className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-center tracking-widest font-mono text-lg"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCvv(!showCvv)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCvv ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t("paymentPage.billingInformation")}</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("paymentPage.emailAddress")}
                    </label>
                    <input
                      type="email"
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">{t("paymentPage.confirmationSentTo")}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("paymentPage.country")}
                      </label>
                      <select
                        value={billingCountry}
                        onChange={(e) => setBillingCountry(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      >
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Canada</option>
                        <option>Australia</option>
                        <option>Germany</option>
                        <option>France</option>
                        <option>Spain</option>
                        <option>Colombia</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("paymentPage.zipPostalCode")}
                      </label>
                      <input
                        type="text"
                        value={billingZip}
                        onChange={(e) => setBillingZip(e.target.value)}
                        placeholder="12345"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Security Notice */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-sptc-red-600 rounded focus:ring-sptc-red-500"
                    required
                  />
                  <span className="text-sm text-gray-600">
                    {t("paymentPage.agreeToTerms")}{" "}
                    <a href="#" className="text-sptc-red-600 hover:underline font-medium">
                      {t("paymentPage.termsOfService")}
                    </a>{" "}
                    {t("paymentPage.and")}{" "}
                    <a href="#" className="text-sptc-red-600 hover:underline font-medium">
                      {t("paymentPage.cancellationPolicy")}
                    </a>
                    {t("paymentPage.paymentAgreement")}
                  </span>
                </label>

                {/* Security Assurance */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{t("paymentPage.paymentSecure")}</h4>
                      <p className="text-sm text-gray-600">
                        {t("paymentPage.paymentSecureText")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing || !acceptTerms}
                className="w-full py-5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-xl rounded-2xl transition-all shadow-xl hover:shadow-2xl disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {t("paymentPage.processingPayment")}
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    {t("paymentPage.paySecurely").replace("{amount}", total.toFixed(2))}
                  </>
                )}
              </button>

              {/* Payment Provider Badges */}
              <div className="flex items-center justify-center gap-6 py-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="w-12 h-5" viewBox="0 0 60 25" fill="currentColor">
                    <path d="M8.5 0C3.8 0 0 3.8 0 8.5V16.5C0 21.2 3.8 25 8.5 25H51.5C56.2 25 60 21.2 60 16.5V8.5C60 3.8 56.2 0 51.5 0H8.5ZM25 7H28L26.5 18H23.5L25 7ZM12 7H16.5C18.5 7 20 8 20 10C20 11.5 19 12.5 17.5 13L20 18H17L14.5 13.5H14L13.5 18H10.5L12 7ZM32 7H38C40 7 41 8 41 9.5C41 11 40 12 39 12C40 12.5 41 13 41 14.5C41 16.5 39.5 18 37 18H31L32 7ZM44 7H48.5C51 7 52 8.5 52 10.5C52 13 50 14 47.5 14H46L45.5 18H42.5L44 7ZM14.5 9.5L14 11.5H15.5C16.5 11.5 17 11 17 10.5C17 10 16.5 9.5 15.5 9.5H14.5ZM35 9.5L34.5 11.5H36.5C37.5 11.5 38 11 38 10.5C38 10 37.5 9.5 36.5 9.5H35ZM47 9.5L46.5 11.5H48C49 11.5 49.5 11 49.5 10.5C49.5 10 49 9.5 48 9.5H47ZM34 13L33.5 15.5H35.5C36.5 15.5 37.5 15 37.5 14C37.5 13.5 37 13 36 13H34Z"/>
                  </svg>
                  <span className="text-xs">{t("paymentPage.poweredByStripe")}</span>
                </div>
                <div className="h-6 w-px bg-gray-200" />
                <div className="flex items-center gap-1 text-gray-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs">{t("paymentPage.pciCompliant")}</span>
                </div>
                <div className="h-6 w-px bg-gray-200" />
                <div className="flex items-center gap-1 text-gray-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs">{t("paymentPage.secureCheckout")}</span>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Booking Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="relative h-40">
                  {listing.images?.[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Home className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg">{listing.title}</h3>
                    <p className="text-white/80 text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {listing.city}, {listing.country}
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{nights} night{nights !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>
                        {adultsCount + childrenCount} guest{adultsCount + childrenCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="py-4 border-y border-gray-200 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        ${listing.price_per_night} × {nights} {nights !== 1 ? t("bookingPage.nights") : t("bookingPage.night")}
                      </span>
                      <span className="text-gray-900">
                        ${(listing.price_per_night * nights).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("paymentPage.serviceFee")}</span>
                      <span className="text-gray-900">
                        ${(total - listing.price_per_night * nights).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">{t("bookingPage.total")}</span>
                    <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  {t("paymentPage.bookingProtection")}
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{t("paymentPage.freeCancellation")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{t("paymentPage.customerSupport")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{t("paymentPage.verifiedHosts")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{t("paymentPage.priceGuarantee")}</span>
                  </li>
                </ul>
              </div>

              {/* Help Section */}
              <div className="text-center p-4">
                <p className="text-sm text-gray-500">
                  {t("paymentPage.needHelp")}{" "}
                  <a href="#" className="text-sptc-red-600 hover:underline font-medium">
                    {t("paymentPage.contactSupport")}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
