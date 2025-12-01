"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  TrendingUp,
  Image as ImageIcon,
  Upload,
  Trash2,
  Eye,
  Download,
  FileEdit,
  Plus,
  Save,
  X,
  GripVertical,
} from "lucide-react";
import { getText } from "@/lib/text";
import { useLanguage } from "@/contexts/LanguageContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Tab = "listings" | "bookings" | "users" | "funds" | "images" | "content";

export default function AdminDashboard() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("listings");

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)' }}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-sptc-red to-red-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                {getText("admin.title", language)}
              </h1>
              <p className="text-red-100 mt-2 text-lg">
                Comprehensive platform management and analytics
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-2 text-white">
                <p className="text-xs uppercase tracking-wide opacity-90">Last Updated</p>
                <p className="text-sm font-semibold">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 p-1.5 border border-gray-100">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("listings")}
              className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === "listings"
                  ? "bg-gradient-to-r from-sptc-red to-red-600 text-white shadow-lg shadow-red-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{getText("admin.listings", language)}</span>
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === "bookings"
                  ? "bg-gradient-to-r from-sptc-red to-red-600 text-white shadow-lg shadow-red-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{getText("admin.bookings", language)}</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === "users"
                  ? "bg-gradient-to-r from-sptc-red to-red-600 text-white shadow-lg shadow-red-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{getText("admin.users", language)}</span>
            </button>

            <button
              onClick={() => setActiveTab("funds")}
              className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === "funds"
                  ? "bg-gradient-to-r from-sptc-red to-red-600 text-white shadow-lg shadow-red-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>{getText("admin.funds", language)}</span>
            </button>

            <button
              onClick={() => setActiveTab("images")}
              className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === "images"
                  ? "bg-gradient-to-r from-sptc-red to-red-600 text-white shadow-lg shadow-red-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Images</span>
            </button>

            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === "content"
                  ? "bg-gradient-to-r from-sptc-red to-red-600 text-white shadow-lg shadow-red-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>Homepage Content</span>
            </button>
          </div>
        </div>

        {activeTab === "listings" && <ListingsTab />}
        {activeTab === "bookings" && <BookingsTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "funds" && <FundsTab />}
        {activeTab === "images" && <ImagesTab />}
        {activeTab === "content" && <HomepageContentTab />}
      </div>
    </div>
  );
}

function ListingsTab() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Listings"
          value="24"
          icon={<Home className="w-5 h-5" />}
          trend="+3 this month"
        />
        <StatCard
          title="Active"
          value="18"
          icon={<CheckCircle className="w-5 h-5" />}
          trend="75% occupancy"
        />
        <StatCard
          title="Pending Review"
          value="6"
          icon={<Clock className="w-5 h-5" />}
          trend="Requires action"
        />
        <StatCard
          title="Avg Price"
          value="$45"
          icon={<TrendingUp className="w-5 h-5" />}
          trend="per night"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Listings</h3>
          <button className="px-4 py-2 bg-gradient-to-r from-sptc-red to-red-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
            View All
          </button>
        </div>
        <div className="space-y-3">
          <ListingItem
            title="Coffee Farm Cottage"
            host="Maria Rodriguez"
            price="$40/night"
            status="active"
          />
          <ListingItem
            title="Mountain View Cabin"
            host="Carlos Gomez"
            price="$55/night"
            status="active"
          />
          <ListingItem
            title="Traditional Adobe House"
            host="Ana Martinez"
            price="$35/night"
            status="pending"
          />
        </div>
      </div>
    </div>
  );
}

function BookingsTab() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value="142"
          icon={<Calendar className="w-5 h-5" />}
          trend="+12 this month"
        />
        <StatCard
          title="Upcoming"
          value="23"
          icon={<Clock className="w-5 h-5" />}
          trend="Next 30 days"
        />
        <StatCard
          title="Revenue"
          value="$6,340"
          icon={<DollarSign className="w-5 h-5" />}
          trend="+18% vs last month"
        />
        <StatCard
          title="Avg Stay"
          value="3.5"
          icon={<TrendingUp className="w-5 h-5" />}
          trend="nights"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Bookings</h3>
          <button className="px-4 py-2 bg-gradient-to-r from-sptc-red to-red-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
            View All
          </button>
        </div>
        <div className="space-y-3">
          <BookingItem
            guest="John Smith"
            listing="Coffee Farm Cottage"
            dates="Jan 15-18, 2025"
            total="$120"
            status="confirmed"
          />
          <BookingItem
            guest="Emma Wilson"
            listing="Mountain View Cabin"
            dates="Jan 20-23, 2025"
            total="$165"
            status="confirmed"
          />
          <BookingItem
            guest="David Brown"
            listing="Traditional Adobe House"
            dates="Jan 25-27, 2025"
            total="$70"
            status="pending"
          />
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value="387"
          icon={<Users className="w-5 h-5" />}
          trend="+45 this month"
        />
        <StatCard
          title="Hosts"
          value="24"
          icon={<Home className="w-5 h-5" />}
          trend="18 verified"
        />
        <StatCard
          title="Guests"
          value="363"
          icon={<Users className="w-5 h-5" />}
          trend="142 bookings"
        />
        <StatCard
          title="Verification Queue"
          value="6"
          icon={<Clock className="w-5 h-5" />}
          trend="Requires review"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Host Verification Queue</h3>
            <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full text-xs font-bold">
              Action Required
            </span>
          </div>
          <div className="space-y-3">
            <VerificationItem
              name="Ana Martinez"
              submitted="2 hours ago"
              status="pending"
            />
            <VerificationItem
              name="Luis Hernandez"
              submitted="5 hours ago"
              status="pending"
            />
            <VerificationItem
              name="Sofia Garcia"
              submitted="1 day ago"
              status="reviewing"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Verified Hosts</h3>
            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-xs font-bold">
              18 Active
            </span>
          </div>
          <div className="space-y-3">
            <VerificationItem
              name="Maria Rodriguez"
              submitted="Verified"
              status="verified"
            />
            <VerificationItem
              name="Carlos Gomez"
              submitted="Verified"
              status="verified"
            />
            <VerificationItem
              name="Isabel Torres"
              submitted="Verified"
              status="verified"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FundsTab() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$6,340"
          icon={<DollarSign className="w-5 h-5" />}
          trend="This month"
        />
        <StatCard
          title="Platform Fee"
          value="$951"
          icon={<TrendingUp className="w-5 h-5" />}
          trend="15% of total"
        />
        <StatCard
          title="Host Payouts"
          value="$5,389"
          icon={<CheckCircle className="w-5 h-5" />}
          trend="85% to hosts"
        />
        <StatCard
          title="Community Fund"
          value="$951"
          icon={<Users className="w-5 h-5" />}
          trend="For local projects"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Platform Fee Breakdown (15%)</h3>
          <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-xs font-bold">
            $951 Total
          </div>
        </div>
        <div className="space-y-4">
          <div className="group flex items-center justify-between p-5 bg-gradient-to-r from-red-50 to-white rounded-xl border border-red-100 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sptc-red to-red-600 rounded-xl flex items-center justify-center shadow-md">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Community Projects Fund
                </p>
                <p className="text-sm text-gray-600">
                  Direct funding for local development
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-sptc-red">$570.60</p>
              <p className="text-sm font-medium text-gray-600">60% of platform fee</p>
            </div>
          </div>

          <div className="group flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Operations & Support
                </p>
                <p className="text-sm text-gray-600">
                  Platform maintenance, customer support
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                $380.40
              </p>
              <p className="text-sm font-medium text-gray-600">40% of platform fee</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Stripe Integration Status
            </h3>
            <div className="space-y-3 text-gray-700">
              <p className="font-medium">
                Stripe will be integrated to handle:
              </p>
              <ul className="space-y-2.5 ml-4">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Guest payment processing via Stripe Checkout</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Automatic 15% platform fee calculation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Host payout distribution (85% of booking total)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Community fund allocation tracking</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Webhook handlers for payment events</span>
                </li>
              </ul>
              <div className="mt-5 p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
                <p className="text-sm font-semibold text-gray-800 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  Next Steps: Configure Stripe Connect for host payouts and set up webhook endpoints
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-sptc-red">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-sptc-red to-red-600 rounded-xl text-white shadow-lg">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{title}</p>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-3.5 h-3.5 text-green-500" />
          <p className="text-sm font-medium text-gray-600">{trend}</p>
        </div>
      </div>
    </div>
  );
}

function ListingItem({
  title,
  host,
  price,
  status,
}: {
  title: string;
  host: string;
  price: string;
  status: string;
}) {
  return (
    <div className="group flex items-center justify-between p-5 bg-gradient-to-r from-white to-gray-50 rounded-xl hover:from-gray-50 hover:to-white transition-all duration-200 border border-gray-100 hover:border-sptc-red hover:shadow-md cursor-pointer">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:from-sptc-red group-hover:to-red-600 transition-all duration-200">
          <Home className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 group-hover:text-sptc-red transition-colors">{title}</p>
          <p className="text-sm text-gray-500">Host: {host}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-lg font-bold text-gray-900">{price}</span>
        <span
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
            status === "active"
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
              : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function BookingItem({
  guest,
  listing,
  dates,
  total,
  status,
}: {
  guest: string;
  listing: string;
  dates: string;
  total: string;
  status: string;
}) {
  return (
    <div className="group flex items-center justify-between p-5 bg-gradient-to-r from-white to-gray-50 rounded-xl hover:from-gray-50 hover:to-white transition-all duration-200 border border-gray-100 hover:border-sptc-red hover:shadow-md cursor-pointer">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-sptc-red group-hover:to-red-600 transition-all duration-200">
          <Calendar className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 group-hover:text-sptc-red transition-colors">{guest}</p>
          <p className="text-sm text-gray-600">{listing}</p>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {dates}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-lg font-bold text-gray-900">{total}</span>
        <span
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
            status === "confirmed"
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
              : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function VerificationItem({
  name,
  submitted,
  status,
}: {
  name: string;
  submitted: string;
  status: string;
}) {
  return (
    <div className="group flex items-center justify-between p-5 bg-gradient-to-r from-white to-gray-50 rounded-xl hover:from-gray-50 hover:to-white transition-all duration-200 border border-gray-100 hover:border-sptc-red hover:shadow-md cursor-pointer">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
          status === "verified"
            ? "bg-gradient-to-br from-green-100 to-green-200 group-hover:from-green-500 group-hover:to-green-600"
            : status === "reviewing"
            ? "bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-500 group-hover:to-blue-600"
            : "bg-gradient-to-br from-yellow-100 to-yellow-200 group-hover:from-yellow-500 group-hover:to-yellow-600"
        }`}>
          <Users className={`w-5 h-5 transition-colors ${
            status === "verified"
              ? "text-green-600 group-hover:text-white"
              : status === "reviewing"
              ? "text-blue-600 group-hover:text-white"
              : "text-yellow-600 group-hover:text-white"
          }`} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 group-hover:text-sptc-red transition-colors">{name}</p>
          <p className="text-sm text-gray-500">{submitted}</p>
        </div>
      </div>
      <span
        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
          status === "verified"
            ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
            : status === "reviewing"
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
            : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function ImagesTab() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "hero" | "listings" | "users">("all");
  const [images, setImages] = useState([
    { id: 1, url: "/images/hero/hero-1.jpg", category: "hero", name: "Hero Image 1", size: "2.4 MB", uploaded: "2025-01-10" },
    { id: 2, url: "/images/hero/hero-2.jpg", category: "hero", name: "Hero Image 2", size: "3.1 MB", uploaded: "2025-01-10" },
    { id: 3, url: "/images/hero/hero-3.jpg", category: "hero", name: "Hero Image 3", size: "2.8 MB", uploaded: "2025-01-10" },
    { id: 4, url: "/placeholder-listing.jpg", category: "listings", name: "Coffee Farm Cottage", size: "1.5 MB", uploaded: "2025-01-08" },
    { id: 5, url: "/placeholder-listing-2.jpg", category: "listings", name: "Mountain View Cabin", size: "1.8 MB", uploaded: "2025-01-07" },
    { id: 6, url: "/placeholder-listing-3.jpg", category: "listings", name: "Traditional Adobe House", size: "1.6 MB", uploaded: "2025-01-06" },
  ]);

  const filteredImages = selectedCategory === "all"
    ? images
    : images.filter(img => img.category === selectedCategory);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          url: e.target?.result as string,
          category: "listings" as const,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          uploaded: new Date().toISOString().split('T')[0]
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (id: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      setImages(prev => prev.filter(img => img.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Images"
          value="487"
          icon={<ImageIcon className="w-5 h-5" />}
          trend="+23 this week"
        />
        <StatCard
          title="Hero Images"
          value="3"
          icon={<ImageIcon className="w-5 h-5" />}
          trend="Homepage slider"
        />
        <StatCard
          title="Listing Images"
          value="458"
          icon={<Home className="w-5 h-5" />}
          trend="Property photos"
        />
        <StatCard
          title="Storage Used"
          value="1.2 GB"
          icon={<Upload className="w-5 h-5" />}
          trend="of 10 GB"
        />
      </div>

      {/* Upload Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 border border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload New Images</h3>
            <p className="text-gray-700 mb-4">
              Click to browse and select images. Supported formats: JPG, PNG, WebP (max 5MB)
            </p>
            <div className="flex items-center space-x-3">
              <label className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all cursor-pointer">
                Choose Files
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-600">Select one or more images</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Image Gallery</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-sptc-red to-red-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({images.length})
            </button>
            <button
              onClick={() => setSelectedCategory("hero")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === "hero"
                  ? "bg-gradient-to-r from-sptc-red to-red-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Hero (3)
            </button>
            <button
              onClick={() => setSelectedCategory("listings")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === "listings"
                  ? "bg-gradient-to-r from-sptc-red to-red-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Listings (3)
            </button>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <ImageCard key={image.id} image={image} onDelete={handleDeleteImage} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ImageCard({ image, onDelete }: { image: any; onDelete: (id: number) => void }) {
  const [showPreview, setShowPreview] = useState(false);

  const handleView = () => {
    setShowPreview(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    link.click();
  };

  return (
    <React.Fragment>
      <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-sptc-red hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
          {image.url.startsWith('data:') || image.url.startsWith('/images/') ? (
            <img
              src={image.url}
              alt={image.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className="fallback-icon absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleView}
                className="p-3 bg-white rounded-xl hover:bg-gray-100 transition-colors"
                title="View image"
              >
                <Eye className="w-5 h-5 text-gray-900" />
              </button>
              <button
                onClick={handleDownload}
                className="p-3 bg-white rounded-xl hover:bg-gray-100 transition-colors"
                title="Download image"
              >
                <Download className="w-5 h-5 text-gray-900" />
              </button>
              <button
                onClick={() => onDelete(image.id)}
                className="p-3 bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
                title="Delete image"
              >
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{image.name}</p>
              <p className="text-xs text-gray-500">{image.size}</p>
            </div>
            <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${
              image.category === "hero"
                ? "bg-purple-100 text-purple-700"
                : image.category === "listings"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}>
              {image.category}
            </span>
          </div>
          <p className="text-xs text-gray-400">Uploaded: {image.uploaded}</p>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-6xl max-h-[90vh]">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-4xl font-bold"
            >
              ×
            </button>
            <img
              src={image.url}
              alt={image.name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 rounded-b-lg">
              <p className="font-semibold">{image.name}</p>
              <p className="text-sm text-gray-300">{image.size} • Uploaded: {image.uploaded}</p>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

// Homepage Content Management Tab
function HomepageContentTab() {
  const { language } = useLanguage();
  const supabase = createClientComponentClient();
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Default sections if database is empty
  const defaultSections = [
    {
      id: 'community_projects',
      section_key: 'community_projects',
      title_en: 'Current community projects',
      title_es: 'Proyectos comunitarios actuales',
      description_en: 'Help us reach our goals and make a lasting difference in rural Colombia',
      description_es: 'Ayúdanos a alcanzar nuestras metas y hacer una diferencia duradera en la Colombia rural',
      items: [
        {
          id: '1',
          image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80',
          title_en: 'School Renovation',
          title_es: 'Renovación de Escuela',
          description_en: 'Improving educational facilities in rural areas',
          description_es: 'Mejorando las instalaciones educativas en áreas rurales',
          goal: 5000,
          raised: 3200
        },
        {
          id: '2',
          image_url: 'https://images.unsplash.com/photo-1594708767771-a7502f38b0ff?w=800&q=80',
          title_en: 'Clean Water Initiative',
          title_es: 'Iniciativa de Agua Limpia',
          description_en: 'Bringing clean water to remote communities',
          description_es: 'Llevando agua limpia a comunidades remotas',
          goal: 8000,
          raised: 6500
        },
        {
          id: '3',
          image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
          title_en: "Women Artisan Collective",
          title_es: 'Colectivo de Artesanas',
          description_en: 'Supporting local crafts and traditions',
          description_es: 'Apoyando artesanías y tradiciones locales',
          goal: 3000,
          raised: 2800
        }
      ],
      is_active: true
    },
    {
      id: 'destinations',
      section_key: 'destinations',
      title_en: 'Explore Colombian destinations',
      title_es: 'Explora destinos colombianos',
      description_en: 'Authentic rural experiences across Colombia',
      description_es: 'Experiencias rurales auténticas en toda Colombia',
      items: [
        {
          id: '1',
          image_url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
          title_en: 'Coffee Region',
          title_es: 'Región Cafetera',
          description_en: 'Experience authentic coffee culture',
          description_es: 'Experimenta la auténtica cultura cafetera',
          link: '/search?region=Coffee%20Region'
        },
        {
          id: '2',
          image_url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80',
          title_en: 'Andean Mountains',
          title_es: 'Montañas Andinas',
          description_en: 'Breathtaking mountain landscapes',
          description_es: 'Paisajes montañosos impresionantes',
          link: '/search?region=Andean%20Mountains'
        },
        {
          id: '3',
          image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
          title_en: 'Caribbean Coast',
          title_es: 'Costa Caribe',
          description_en: 'Tropical paradise and rich culture',
          description_es: 'Paraíso tropical y rica cultura',
          link: '/search?region=Caribbean%20Coast'
        },
        {
          id: '4',
          image_url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80',
          title_en: 'Amazon Rainforest',
          title_es: 'Selva Amazónica',
          description_en: 'Explore the worlds largest rainforest',
          description_es: 'Explora la selva más grande del mundo',
          link: '/search?region=Amazon'
        }
      ],
      is_active: true
    }
  ];

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .order('display_order');

      if (error) {
        console.log('Using default sections (table may not exist yet)');
        setSections(defaultSections);
      } else if (data && data.length > 0) {
        setSections(data);
      } else {
        setSections(defaultSections);
      }
    } catch (e) {
      console.log('Using default sections');
      setSections(defaultSections);
    }
    setLoading(false);
  };

  const saveSection = async (section: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('homepage_content')
        .upsert({
          ...section,
          updated_at: new Date().toISOString()
        }, { onConflict: 'section_key' });

      if (error) {
        console.error('Error saving:', error);
        alert('Error saving. Please run the SQL migration first.');
      } else {
        alert('Saved successfully!');
        fetchSections();
      }
    } catch (e) {
      console.error('Save error:', e);
      alert('Error saving. Database table may not exist yet.');
    }
    setSaving(false);
    setEditingSection(null);
  };

  const updateItem = (sectionKey: string, itemId: string, field: string, value: any) => {
    setSections(prev => prev.map(section => {
      if (section.section_key === sectionKey) {
        return {
          ...section,
          items: section.items.map((item: any) =>
            item.id === itemId ? { ...item, [field]: value } : item
          )
        };
      }
      return section;
    }));
  };

  const addItem = (sectionKey: string) => {
    const newItem = {
      id: Date.now().toString(),
      image_url: 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&q=80',
      title_en: 'New Item',
      title_es: 'Nuevo Elemento',
      description_en: 'Description here',
      description_es: 'Descripción aquí',
      ...(sectionKey === 'community_projects' ? { goal: 1000, raised: 0 } : { link: '/search' })
    };

    setSections(prev => prev.map(section => {
      if (section.section_key === sectionKey) {
        return {
          ...section,
          items: [...section.items, newItem]
        };
      }
      return section;
    }));
  };

  const removeItem = (sectionKey: string, itemId: string) => {
    if (!confirm('Are you sure you want to remove this item?')) return;

    setSections(prev => prev.map(section => {
      if (section.section_key === sectionKey) {
        return {
          ...section,
          items: section.items.filter((item: any) => item.id !== itemId)
        };
      }
      return section;
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sptc-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <FileEdit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Homepage Content Manager</h3>
            <p className="text-gray-700">
              Edit the images and text for homepage sections like Community Projects and Destinations.
              Changes will appear on the homepage after saving.
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.section_key} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-sptc-red text-white rounded-full text-xs font-bold uppercase">
                    {section.section_key.replace('_', ' ')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${section.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {section.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {editingSection === section.section_key ? (
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Title (English)</label>
                        <input
                          type="text"
                          value={section.title_en}
                          onChange={(e) => setSections(prev => prev.map(s => s.section_key === section.section_key ? { ...s, title_en: e.target.value } : s))}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sptc-red focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Title (Spanish)</label>
                        <input
                          type="text"
                          value={section.title_es}
                          onChange={(e) => setSections(prev => prev.map(s => s.section_key === section.section_key ? { ...s, title_es: e.target.value } : s))}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sptc-red focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Description (English)</label>
                        <textarea
                          value={section.description_en}
                          onChange={(e) => setSections(prev => prev.map(s => s.section_key === section.section_key ? { ...s, description_en: e.target.value } : s))}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sptc-red focus:border-transparent"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Description (Spanish)</label>
                        <textarea
                          value={section.description_es}
                          onChange={(e) => setSections(prev => prev.map(s => s.section_key === section.section_key ? { ...s, description_es: e.target.value } : s))}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sptc-red focus:border-transparent"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900">{language === 'es' ? section.title_es : section.title_en}</h3>
                    <p className="text-gray-600 mt-1">{language === 'es' ? section.description_es : section.description_en}</p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                {editingSection === section.section_key ? (
                  <>
                    <button
                      onClick={() => saveSection(section)}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setEditingSection(null); fetchSections(); }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingSection(section.section_key)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sptc-red to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <FileEdit className="w-4 h-4" />
                    Edit Section
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Items Grid */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Items ({section.items?.length || 0})</h4>
              {editingSection === section.section_key && (
                <button
                  onClick={() => addItem(section.section_key)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {section.items?.map((item: any, index: number) => (
                <div key={item.id} className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-sptc-red transition-all">
                  {/* Image */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-gray-200">
                    <img
                      src={item.image_url}
                      alt={item.title_en}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&q=80';
                      }}
                    />
                    {editingSection === section.section_key && (
                      <button
                        onClick={() => removeItem(section.section_key, item.id)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {editingSection === section.section_key ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Image URL</label>
                          <input
                            type="text"
                            value={item.image_url}
                            onChange={(e) => updateItem(section.section_key, item.id, 'image_url', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sptc-red focus:border-transparent"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Title (EN)</label>
                          <input
                            type="text"
                            value={item.title_en}
                            onChange={(e) => updateItem(section.section_key, item.id, 'title_en', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sptc-red focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Title (ES)</label>
                          <input
                            type="text"
                            value={item.title_es}
                            onChange={(e) => updateItem(section.section_key, item.id, 'title_es', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sptc-red focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Description (EN)</label>
                          <textarea
                            value={item.description_en}
                            onChange={(e) => updateItem(section.section_key, item.id, 'description_en', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sptc-red focus:border-transparent"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Description (ES)</label>
                          <textarea
                            value={item.description_es}
                            onChange={(e) => updateItem(section.section_key, item.id, 'description_es', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sptc-red focus:border-transparent"
                            rows={2}
                          />
                        </div>
                        {section.section_key === 'community_projects' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Goal ($)</label>
                              <input
                                type="number"
                                value={item.goal || 0}
                                onChange={(e) => updateItem(section.section_key, item.id, 'goal', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sptc-red focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Raised ($)</label>
                              <input
                                type="number"
                                value={item.raised || 0}
                                onChange={(e) => updateItem(section.section_key, item.id, 'raised', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sptc-red focus:border-transparent"
                              />
                            </div>
                          </div>
                        )}
                        {section.section_key === 'destinations' && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Link</label>
                            <input
                              type="text"
                              value={item.link || ''}
                              onChange={(e) => updateItem(section.section_key, item.id, 'link', e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sptc-red focus:border-transparent"
                              placeholder="/search?region=..."
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <h5 className="font-semibold text-gray-900 mb-1">{language === 'es' ? item.title_es : item.title_en}</h5>
                        <p className="text-sm text-gray-600 line-clamp-2">{language === 'es' ? item.description_es : item.description_en}</p>
                        {section.section_key === 'community_projects' && item.goal && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>${item.raised?.toLocaleString()} raised</span>
                              <span>${item.goal?.toLocaleString()} goal</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-sptc-red to-red-500 rounded-full"
                                style={{ width: `${Math.min(100, (item.raised / item.goal) * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
