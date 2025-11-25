"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  Image as ImageIcon,
  Upload,
  Trash2,
  Eye,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Save,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Percent,
  Settings,
  User,
  MapPin,
  FileText,
  Home,
  Compass,
  Heart,
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/lib/text";

type Tab = "profile" | "verification" | "photos" | "listing" | "pricing";

interface PricingRule {
  id: string;
  name: string;
  type: "percentage" | "fixed" | "discount";
  value: number;
  startDate: string;
  endDate: string;
  appliesTo: "all" | "weekends" | "weekdays" | "holidays";
}

interface CustomPrice {
  date: string;
  price: number;
  reason?: string;
}

export default function HostDashboard() {
  const { language } = useLanguage();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [verificationPhotos, setVerificationPhotos] = useState<any[]>([]);
  const [listingPhotos, setListingPhotos] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/host/login');
        return;
      }

      setUser(user);
      await loadProfile(user.id);
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/host/login');
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      // Load host profile
      const { data: profileData, error: profileError } = await supabase
        .from('host_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Load verification photos
      const { data: verPhotos } = await supabase
        .from('property_photos')
        .select('*')
        .eq('host_id', userId)
        .order('created_at', { ascending: true });

      setVerificationPhotos(verPhotos || []);

      // Load listing photos
      const { data: listPhotos } = await supabase
        .from('listing_photos')
        .select('*')
        .eq('host_id', userId)
        .order('display_order', { ascending: true });

      setListingPhotos(listPhotos || []);

    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sptc-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sptc-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 shadow-2xl rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: '"DM Serif Display", serif' }}>
                Host Dashboard
              </h1>
              <p className="text-red-100 text-lg md:text-xl">
                Welcome back, {profile?.first_name || 'Host'}!
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                profile?.verification_status === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : profile?.verification_status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {profile?.verification_status === 'approved' ? '✓ Verified' :
                 profile?.verification_status === 'pending' ? '⏳ Pending' :
                 '⚠ Not Verified'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 p-1.5 border border-gray-100">
          <div className="flex space-x-1 overflow-x-auto">
            <TabButton
              active={activeTab === 'profile'}
              onClick={() => handleTabChange('profile')}
              icon={<User className="w-5 h-5" />}
              label="Profile"
            />
            <TabButton
              active={activeTab === 'verification'}
              onClick={() => handleTabChange('verification')}
              icon={<MapPin className="w-5 h-5" />}
              label="Verification"
            />
            <TabButton
              active={activeTab === 'photos'}
              onClick={() => handleTabChange('photos')}
              icon={<ImageIcon className="w-5 h-5" />}
              label="Gallery"
            />
            <TabButton
              active={activeTab === 'listing'}
              onClick={() => handleTabChange('listing')}
              icon={<FileText className="w-5 h-5" />}
              label="Listing"
            />
            <TabButton
              active={activeTab === 'pricing'}
              onClick={() => handleTabChange('pricing')}
              icon={<DollarSign className="w-5 h-5" />}
              label="Pricing"
            />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <ProfileSection profile={profile} user={user} supabase={supabase} onUpdate={() => loadProfile(user.id)} />
        )}
        {activeTab === "verification" && (
          <VerificationSection photos={verificationPhotos} profile={profile} />
        )}
        {activeTab === "photos" && (
          <PhotosTabEnhanced photos={listingPhotos} userId={user?.id} supabase={supabase} onUpdate={() => loadProfile(user.id)} />
        )}
        {activeTab === "listing" && (
          <ListingSection profile={profile} userId={user?.id} supabase={supabase} onUpdate={() => loadProfile(user.id)} />
        )}
        {activeTab === "pricing" && <PricingTab profile={profile} userId={user?.id} supabase={supabase} />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
        active
          ? "bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white shadow-lg shadow-red-200"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ProfileSection({ profile, user, supabase, onUpdate }: any) {
  const [hostType, setHostType] = useState(profile?.host_type || '');
  const [saving, setSaving] = useState(false);

  const handleSaveHostType = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('host_profiles')
        .update({ host_type: hostType })
        .eq('user_id', user?.id);

      if (error) throw error;

      alert('Host type updated successfully!');
      onUpdate();
    } catch (error: any) {
      console.error('Error saving:', error);
      alert('Failed to save: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Calculate verification progress
  const hasIdVerified = profile?.id_verified;
  const hasFaceVerified = profile?.face_verified;
  const hasHostType = !!profile?.host_type;
  const isApproved = profile?.verification_status === 'approved';

  return (
    <div className="space-y-8">
      {/* Verification Status Card */}
      <div className={`rounded-3xl shadow-xl p-8 border-2 ${
        isApproved
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
          : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200'
      }`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Status</h2>
            <p className="text-gray-600">Complete all steps to get your profile approved</p>
          </div>
          <div className={`px-6 py-3 rounded-full text-lg font-bold ${
            isApproved
              ? 'bg-green-500 text-white'
              : 'bg-amber-500 text-white'
          }`}>
            {isApproved ? '✓ Approved' : '⏳ Pending'}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-5 rounded-2xl border-2 ${hasIdVerified ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasIdVerified ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {hasIdVerified ? '✓' : '1'}
              </div>
              <h4 className="font-bold text-gray-900">ID Verified</h4>
            </div>
            <p className="text-sm text-gray-600 ml-13">
              {hasIdVerified ? 'Completed via MetaMap' : 'Verify your identity'}
            </p>
          </div>

          <div className={`p-5 rounded-2xl border-2 ${hasFaceVerified ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasFaceVerified ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {hasFaceVerified ? '✓' : '2'}
              </div>
              <h4 className="font-bold text-gray-900">Face Verified</h4>
            </div>
            <p className="text-sm text-gray-600 ml-13">
              {hasFaceVerified ? 'Selfie verification passed' : 'Complete face scan'}
            </p>
          </div>

          <div className={`p-5 rounded-2xl border-2 ${hasHostType ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasHostType ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {hasHostType ? '✓' : '3'}
              </div>
              <h4 className="font-bold text-gray-900">Host Type</h4>
            </div>
            <p className="text-sm text-gray-600 ml-13">
              {hasHostType ? `Selected: ${profile.host_type}` : 'Choose your host type'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Profile Information</h2>
          <p className="text-gray-300">Your personal details</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumInfoField label="First Name" value={profile?.first_name} icon="👤" />
            <PremiumInfoField label="Last Name" value={profile?.last_name} icon="👤" />
            <PremiumInfoField label="Email" value={user?.email} icon="✉️" />
            <PremiumInfoField label="Phone" value={profile?.phone} icon="📱" />
            <PremiumInfoField label="Country" value={profile?.country} icon="🌍" />
            <PremiumInfoField label="City" value={profile?.city} icon="🏙️" />
            <PremiumInfoField label="Date of Birth" value={profile?.date_of_birth} icon="🎂" />
            <PremiumInfoField label="Member Since" value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'} icon="📅" />
          </div>
        </div>
      </div>

      {/* Host Type Selection Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Choose Your Host Type</h2>
          <p className="text-red-100">Select what type of experience you want to offer</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <PremiumHostTypeCard
              icon={<Home className="w-10 h-10" />}
              title="Accommodation"
              description="Offer a cozy place for travelers to stay and experience local life"
              type="accommodation"
              currentType={hostType}
              onClick={() => setHostType('accommodation')}
            />
            <PremiumHostTypeCard
              icon={<Compass className="w-10 h-10" />}
              title="Excursion"
              description="Share your local knowledge through guided tours & activities"
              type="excursion"
              currentType={hostType}
              onClick={() => setHostType('excursion')}
            />
            <PremiumHostTypeCard
              icon={<Heart className="w-10 h-10" />}
              title="Volunteer Farm"
              description="Connect with volunteers who want to help on your farm"
              type="volunteer"
              currentType={hostType}
              onClick={() => setHostType('volunteer')}
            />
          </div>

          {hostType && hostType !== profile?.host_type && (
            <div className="flex justify-end">
              <button
                onClick={handleSaveHostType}
                disabled={saving}
                className="px-10 py-4 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold text-lg rounded-2xl hover:from-sptc-red-700 hover:to-sptc-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
              >
                {saving ? 'Saving...' : 'Save Host Type'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PremiumInfoField({ label, value, icon }: { label: string; value: any; icon: string }) {
  return (
    <div className="group">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
        <span>{icon}</span>
        {label}
      </label>
      <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-gray-900 font-medium border border-gray-200 group-hover:border-sptc-red-200 transition-all">
        {value || <span className="text-gray-400 italic">Not set</span>}
      </div>
    </div>
  );
}

function PremiumHostTypeCard({ icon, title, description, type, currentType, onClick }: any) {
  const isSelected = currentType === type;

  return (
    <div
      onClick={onClick}
      className={`relative p-8 rounded-3xl border-3 cursor-pointer transition-all transform hover:scale-[1.02] ${
        isSelected
          ? 'border-sptc-red-500 bg-gradient-to-br from-sptc-red-50 to-orange-50 shadow-xl'
          : 'border-gray-200 hover:border-sptc-red-200 bg-white hover:shadow-lg'
      }`}
    >
      {isSelected && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-sptc-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
          ✓
        </div>
      )}
      <div className={`mb-4 ${isSelected ? 'text-sptc-red-600' : 'text-gray-600'}`}>
        {icon}
      </div>
      <h4 className="font-bold text-xl text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function HostTypeCard({ icon, title, description, type, currentType, onClick }: any) {
  const isSelected = currentType === type;

  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
      isSelected
        ? 'border-sptc-red-600 bg-sptc-red-50'
        : 'border-gray-200 hover:border-gray-300 bg-white'
    }`}>
      <div className={`mb-3 ${isSelected ? 'text-sptc-red-600' : 'text-gray-600'}`}>
        {icon}
      </div>
      <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
      {isSelected && (
        <div className="mt-3 text-sptc-red-600 font-semibold text-sm">✓ Selected</div>
      )}
    </div>
  );
}

function InfoField({ label, value }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
        {value || 'Not set'}
      </div>
    </div>
  );
}

function VerificationSection({ photos, profile }: any) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Verification Photos</h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-blue-900 font-semibold mb-1">GPS-Verified Property Photos</p>
        <p className="text-blue-700 text-sm">
          These photos were taken with GPS location verification during your onboarding.
        </p>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No verification photos uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {photos.map((photo: any, index: number) => (
            <div key={photo.id} className="bg-gray-50 rounded-2xl p-4">
              <img
                src={photo.photo_url}
                alt={`Verification photo ${index + 1}`}
                className="w-full h-64 object-cover rounded-xl mb-3"
              />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>
                  {photo.latitude?.toFixed(6)}, {photo.longitude?.toFixed(6)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Uploaded {new Date(photo.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ListingSection({ profile, userId, supabase, onUpdate }: any) {
  const [hostType, setHostType] = useState(profile?.host_type || '');
  const [title, setTitle] = useState(profile?.listing_title || '');
  const [description, setDescription] = useState(profile?.listing_description || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('host_profiles')
        .update({
          host_type: hostType,
          listing_title: title,
          listing_description: description,
        })
        .eq('user_id', userId);

      if (error) throw error;

      alert('Listing updated successfully!');
      onUpdate();
    } catch (error: any) {
      console.error('Error saving:', error);
      alert('Failed to save: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Listing Details</h2>

      <div className="space-y-6">
        {/* Host Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Host Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setHostType('accommodation')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                hostType === 'accommodation'
                  ? 'border-sptc-red-600 bg-sptc-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Home className={`w-6 h-6 mb-2 ${hostType === 'accommodation' ? 'text-sptc-red-600' : 'text-gray-600'}`} />
              <div className="font-semibold text-gray-900">Accommodation</div>
              <div className="text-sm text-gray-600">Offer lodging</div>
            </button>

            <button
              onClick={() => setHostType('excursion')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                hostType === 'excursion'
                  ? 'border-sptc-red-600 bg-sptc-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Compass className={`w-6 h-6 mb-2 ${hostType === 'excursion' ? 'text-sptc-red-600' : 'text-gray-600'}`} />
              <div className="font-semibold text-gray-900">Excursion</div>
              <div className="text-sm text-gray-600">Tours & activities</div>
            </button>

            <button
              onClick={() => setHostType('volunteer')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                hostType === 'volunteer'
                  ? 'border-sptc-red-600 bg-sptc-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Heart className={`w-6 h-6 mb-2 ${hostType === 'volunteer' ? 'text-sptc-red-600' : 'text-gray-600'}`} />
              <div className="font-semibold text-gray-900">Volunteer Farm</div>
              <div className="text-sm text-gray-600">Seek volunteers</div>
            </button>
          </div>
        </div>

        {/* Listing Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Listing Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Cozy Mountain Cabin with Amazing Views"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sptc-red-500 focus:border-transparent"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
        </div>

        {/* Listing Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your property, what makes it special, what guests can expect..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sptc-red-500 focus:border-transparent h-48 resize-none"
            maxLength={2000}
          />
          <p className="text-xs text-gray-500 mt-1">{description.length}/2000 characters</p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={saving || !hostType || !title || !description}
            className="px-8 py-3 bg-sptc-red-600 text-white font-bold rounded-xl hover:bg-sptc-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function PricingTab({ profile, userId, supabase }: any) {
  const { language } = useLanguage();
  const [basePrice, setBasePrice] = useState(profile?.default_price_per_night || 50);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [customPrices, setCustomPrices] = useState<CustomPrice[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showDatePriceForm, setShowDatePriceForm] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);


  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  const getPriceForDate = (date: string): number => {
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Check for custom price first
    const customPrice = customPrices.find(cp => cp.date === date);
    if (customPrice) {
      return customPrice.price;
    }

    // Apply rules
    let price = basePrice;
    for (const rule of pricingRules) {
      const ruleStart = new Date(rule.startDate);
      const ruleEnd = new Date(rule.endDate);
      ruleEnd.setHours(23, 59, 59, 999);

      if (dateObj >= ruleStart && dateObj <= ruleEnd) {
        if (rule.appliesTo === "all") {
          if (rule.type === "percentage") {
            price = price * (1 + rule.value / 100);
          } else if (rule.type === "fixed") {
            price = rule.value;
          } else if (rule.type === "discount") {
            price = price * (1 - rule.value / 100);
          }
        } else if (rule.appliesTo === "weekends" && isWeekend) {
          if (rule.type === "percentage") {
            price = price * (1 + rule.value / 100);
          } else if (rule.type === "fixed") {
            price = rule.value;
          } else if (rule.type === "discount") {
            price = price * (1 - rule.value / 100);
          }
        } else if (rule.appliesTo === "weekdays" && !isWeekend) {
          if (rule.type === "percentage") {
            price = price * (1 + rule.value / 100);
          } else if (rule.type === "fixed") {
            price = rule.value;
          } else if (rule.type === "discount") {
            price = price * (1 - rule.value / 100);
          }
        }
      }
    }

    return Math.round(price * 100) / 100;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const formatDate = (day: number): string => {
    const date = new Date(selectedYear, selectedMonth, day);
    return date.toISOString().split('T')[0];
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowDatePriceForm(true);
  };

  const handleSaveCustomPrice = (price: number, reason?: string) => {
    if (!selectedDate) return;
    const existingIndex = customPrices.findIndex(cp => cp.date === selectedDate);
    if (existingIndex >= 0) {
      const updated = [...customPrices];
      updated[existingIndex] = { date: selectedDate, price, reason };
      setCustomPrices(updated);
    } else {
      setCustomPrices([...customPrices, { date: selectedDate, price, reason }]);
    }
    setShowDatePriceForm(false);
    setSelectedDate(null);
  };

  const handleDeleteCustomPrice = (date: string) => {
    setCustomPrices(customPrices.filter(cp => cp.date !== date));
  };

  const handleSaveRule = (rule: Omit<PricingRule, "id">) => {
    if (editingRule) {
      setPricingRules(pricingRules.map(r => r.id === editingRule.id ? { ...rule, id: editingRule.id } : r));
      setEditingRule(null);
    } else {
      setPricingRules([...pricingRules, { ...rule, id: Date.now().toString() }]);
    }
    setShowRuleForm(false);
  };

  const handleDeleteRule = (id: string) => {
    setPricingRules(pricingRules.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Base Price Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Base Rate</h3>
              <p className="text-sm text-gray-600">Set your default nightly price</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Base Price per Night</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setBasePrice(isNaN(val) ? 0 : val);
                }}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sptc-red-600 focus:ring-2 focus:ring-red-200 outline-none font-bold text-lg"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-sptc-red-600" />
              Calendar Pricing
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="font-bold text-gray-900 min-w-[150px] text-center">
                {months[selectedMonth]} {selectedYear}
              </span>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-bold text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array(firstDayOfMonth)
              .fill(null)
              .map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
            {Array(daysInMonth)
              .fill(null)
              .map((_, i) => {
                const day = i + 1;
                const date = formatDate(day);
                const price = getPriceForDate(date);
                const isCustomPrice = customPrices.some(cp => cp.date === date);
                const isToday = date === new Date().toISOString().split('T')[0];
                const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(date)}
                    className={`aspect-square rounded-xl border-2 transition-all relative group ${
                      isToday
                        ? "border-sptc-red-600 bg-red-50 shadow-lg"
                        : isCustomPrice
                        ? "border-green-500 bg-green-50 hover:bg-green-100"
                        : isWeekend
                        ? "border-blue-200 bg-blue-50 hover:bg-blue-100"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="absolute top-1 left-1 text-xs font-bold text-gray-700">{day}</div>
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className={`text-xs font-bold ${
                        price > basePrice ? "text-green-600" : price < basePrice ? "text-blue-600" : "text-gray-700"
                      }`}>
                        ${price.toFixed(0)}
                      </div>
                    </div>
                    {isCustomPrice && (
                      <div className="absolute top-1 right-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Pricing Rules Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <Settings className="w-6 h-6 text-sptc-red-600" />
              Pricing Rules
            </h3>
            <button
              onClick={() => {
                setEditingRule(null);
                setShowRuleForm(true);
              }}
              className="p-2 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {pricingRules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No pricing rules yet</p>
                <p className="text-xs text-gray-400 mt-1">Click + to add a rule</p>
              </div>
            ) : (
              pricingRules.map((rule) => (
                <div
                  key={rule.id}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-sptc-red-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{rule.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {rule.type === "percentage" && rule.value > 0 && (
                          <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{rule.value}%
                          </span>
                        )}
                        {rule.type === "percentage" && rule.value < 0 && (
                          <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            {rule.value}%
                          </span>
                        )}
                        {rule.type === "fixed" && (
                          <span className="text-xs font-semibold text-purple-600">${rule.value}</span>
                        )}
                        {rule.type === "discount" && (
                          <span className="text-xs font-semibold text-blue-600">-{rule.value}%</span>
                        )}
                        <span className="text-xs text-gray-500">• {rule.appliesTo}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(rule.startDate).toLocaleDateString()} - {new Date(rule.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingRule(rule);
                          setShowRuleForm(true);
                        }}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Custom Prices Summary */}
      {customPrices.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-sptc-red-600" />
            Custom Prices ({customPrices.length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {customPrices.map((cp) => (
              <div
                key={cp.date}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl"
              >
                <div>
                  <p className="font-bold text-gray-900">{new Date(cp.date).toLocaleDateString()}</p>
                  <p className="text-sm font-semibold text-green-600">${cp.price}</p>
                  {cp.reason && <p className="text-xs text-gray-500">{cp.reason}</p>}
                </div>
                <button
                  onClick={() => handleDeleteCustomPrice(cp.date)}
                  className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rule Form Modal */}
      {showRuleForm && (
        <RuleFormModal
          basePrice={basePrice}
          editingRule={editingRule}
          onSave={handleSaveRule}
          onClose={() => {
            setShowRuleForm(false);
            setEditingRule(null);
          }}
        />
      )}

      {/* Date Price Form Modal */}
      {showDatePriceForm && selectedDate && (
        <DatePriceFormModal
          date={selectedDate}
          currentPrice={getPriceForDate(selectedDate)}
          basePrice={basePrice}
          onSave={handleSaveCustomPrice}
          onClose={() => {
            setShowDatePriceForm(false);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}

function RuleFormModal({
  basePrice,
  editingRule,
  onSave,
  onClose,
}: {
  basePrice: number;
  editingRule: PricingRule | null;
  onSave: (rule: Omit<PricingRule, "id">) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(editingRule?.name || "");
  const [type, setType] = useState<"percentage" | "fixed" | "discount">(
    editingRule?.type || "percentage"
  );
  const [value, setValue] = useState(editingRule?.value || 0);
  const [startDate, setStartDate] = useState(editingRule?.startDate || "");
  const [endDate, setEndDate] = useState(editingRule?.endDate || "");
  const [appliesTo, setAppliesTo] = useState<"all" | "weekends" | "weekdays" | "holidays">(
    editingRule?.appliesTo || "all"
  );


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, type, value, startDate, endDate, appliesTo });
  };

  const calculatePreview = () => {
    if (type === "percentage") {
      return basePrice * (1 + value / 100);
    } else if (type === "fixed") {
      return value;
    } else if (type === "discount") {
      return basePrice * (1 - value / 100);
    }
    return basePrice;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">
            {editingRule ? "Edit Pricing Rule" : "Add Pricing Rule"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rule Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Peak Season"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sptc-red-600 focus:ring-2 focus:ring-red-200 outline-none"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "percentage" | "fixed" | "discount")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sptc-red-600 focus:ring-2 focus:ring-red-200 outline-none"
              >
                <option value="percentage">Percentage Increase/Decrease</option>
                <option value="fixed">Fixed Price</option>
                <option value="discount">Discount (%)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Value {type === "percentage" ? "(%)" : type === "fixed" ? "($)" : "(%)"}
              </label>
              <div className="relative">
                {type !== "fixed" && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>}
                {type === "fixed" && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>}
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                  className={`w-full ${type !== "fixed" ? "pl-10" : "pl-10"} pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sptc-red-600 focus:ring-2 focus:ring-red-200 outline-none`}
                  required
                  min={type === "discount" ? 0 : undefined}
                  max={type === "discount" ? 100 : undefined}
                  step={type === "fixed" ? "0.01" : "1"}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sptc-red-600 focus:ring-2 focus:ring-red-200 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sptc-red-600 focus:ring-2 focus:ring-red-200 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Applies To</label>
            <select
              value={appliesTo}
              onChange={(e) => setAppliesTo(e.target.value as "all" | "weekends" | "weekdays" | "holidays")}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sptc-red-600 focus:ring-2 focus:ring-red-200 outline-none"
            >
              <option value="all">All Days</option>
              <option value="weekends">Weekends Only</option>
              <option value="weekdays">Weekdays Only</option>
              <option value="holidays">Holidays Only</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-blue-900 mb-1">Preview:</p>
            <p className="text-lg font-bold text-blue-700">
              Base: ${basePrice.toFixed(2)} → After Rule: ${calculatePreview().toFixed(2)}/night
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {editingRule ? "Update Rule" : "Add Rule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DatePriceFormModal({
  date,
  currentPrice,
  basePrice,
  onSave,
  onClose,
}: {
  date: string;
  currentPrice: number;
  basePrice: number;
  onSave: (price: number, reason?: string) => void;
  onClose: () => void;
}) {
  const [price, setPrice] = useState(currentPrice);
  const [reason, setReason] = useState("");


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(price, reason || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Set Custom Price</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Date: <span className="font-bold text-gray-900">{new Date(date).toLocaleDateString()}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Base Price: <span className="font-bold text-gray-900">${basePrice.toFixed(2)}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Current Price: <span className="font-bold text-gray-900">${currentPrice.toFixed(2)}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Price ($)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sptc-red-600 focus:ring-2 focus:ring-red-200 outline-none font-bold text-lg"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reason (Optional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Special event, Holiday"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sptc-red-600 focus:ring-2 focus:ring-red-200 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Price
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PhotosTabEnhanced({ photos, userId, supabase, onUpdate }: any) {
  const { language } = useLanguage();
  const [localPhotos, setLocalPhotos] = useState<Array<{ id: string; photo_url: string; caption?: string; display_order: number }>>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState<"carousel" | "advert">("carousel");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLocalPhotos(photos || []);
  }, [photos]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) {
        try {
          // Convert to base64
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onload = (event) => {
              resolve(event.target?.result as string);
            };
            reader.readAsDataURL(file);
          });

          const photoData = await base64Promise;
          const displayOrder = localPhotos.length;

          // Save to Supabase
          const { data, error } = await supabase
            .from('listing_photos')
            .insert({
              host_id: userId,
              photo_url: photoData,
              display_order: displayOrder,
            })
            .select()
            .single();

          if (error) throw error;

          setLocalPhotos(prev => [...prev, data]);
        } catch (error: any) {
          console.error('Error uploading photo:', error);
          alert('Failed to upload photo: ' + error.message);
        }
      }
    }

    setUploading(false);
    onUpdate();
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('listing_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      setLocalPhotos(prev => prev.filter(p => p.id !== photoId));
      if (currentPhotoIndex >= localPhotos.length - 1 && currentPhotoIndex > 0) {
        setCurrentPhotoIndex(currentPhotoIndex - 1);
      }
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo: ' + error.message);
    }
  };

  const navigatePhoto = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentPhotoIndex(currentPhotoIndex > 0 ? currentPhotoIndex - 1 : localPhotos.length - 1);
    } else {
      setCurrentPhotoIndex(currentPhotoIndex < localPhotos.length - 1 ? currentPhotoIndex + 1 : 0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 border border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Listing Photos</h3>
            <p className="text-gray-700 mb-4">
              Upload high-quality images of your property. Supported formats: JPG, PNG, WebP (max 10MB each)
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
              <span className="text-sm text-gray-600">
                {localPhotos.length} {localPhotos.length === 1 ? "photo" : "photos"} uploaded
              </span>
              {uploading && (
                <div className="flex items-center gap-2 text-sptc-red-600">
                  <div className="w-4 h-4 border-2 border-sptc-red-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-semibold">Uploading...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-sptc-red-600" />
            Photo Gallery
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPreviewMode("carousel");
              }}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                previewMode === "carousel"
                  ? "bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Carousel
              </div>
            </button>
            <button
              onClick={() => {
                setPreviewMode("advert");
              }}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                previewMode === "advert"
                  ? "bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Advert
              </div>
            </button>
          </div>
        </div>

        {localPhotos.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-semibold mb-2">No photos uploaded yet</p>
            <p className="text-sm text-gray-400">Upload photos to see them here</p>
          </div>
        ) : previewMode === "carousel" ? (
          <div className="space-y-6">
            {/* Main Carousel */}
            <div className="relative bg-gray-100 rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
              {localPhotos[currentPhotoIndex] && (
                <img
                  src={localPhotos[currentPhotoIndex].photo_url}
                  alt={`Photo ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              )}

              {localPhotos.length > 1 && (
                <>
                  <button
                    onClick={() => navigatePhoto("prev")}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-900" />
                  </button>
                  <button
                    onClick={() => navigatePhoto("next")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 shadow-lg transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-900" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {currentPhotoIndex + 1} / {localPhotos.length}
                </div>
              </div>

              <button
                onClick={() => handleDeletePhoto(localPhotos[currentPhotoIndex].id)}
                className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {localPhotos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => {
                    setCurrentPhotoIndex(index);
                  }}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    index === currentPhotoIndex
                      ? "border-sptc-red-600 shadow-lg scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={photo.photo_url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Advert Preview */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xl">
              {/* Main Image */}
              {localPhotos[0] && (
                <div className="relative" style={{ aspectRatio: "16/9" }}>
                  <img
                    src={localPhotos[0].photo_url}
                    alt="Main listing image"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: '"DM Serif Display", serif' }}>
                  Your Property Listing
                </h3>
                <p className="text-gray-600 mb-4">
                  This is how your listing will appear on the website
                </p>

                {/* Image Grid */}
                {localPhotos.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {localPhotos.slice(1, 5).map((photo, index) => (
                      <div
                        key={photo.id}
                        className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200"
                      >
                        <img
                          src={photo.photo_url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Property Details Preview */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Price per night</p>
                      <p className="text-3xl font-bold text-gray-900">$50</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="text-2xl font-bold text-gray-900">4.8 ★</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

