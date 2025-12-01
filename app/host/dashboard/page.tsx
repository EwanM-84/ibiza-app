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
          <p className="text-gray-600">{getText("hostDashboard.loadingDashboard", language)}</p>
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
                {getText("hostDashboard.dashboardTitle", language)}
              </h1>
              <p className="text-red-100 text-lg md:text-xl">
                {getText("hostDashboard.welcome", language)}, {profile?.first_name || 'Host'}!
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
                {profile?.verification_status === 'approved' ? `✓ ${getText("hostDashboard.verified", language)}` :
                 profile?.verification_status === 'pending' ? `⏳ ${getText("hostDashboard.pending", language)}` :
                 `⚠ ${getText("hostDashboard.notVerified", language)}`}
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
              label={getText("hostDashboard.profile", language)}
            />
            <TabButton
              active={activeTab === 'verification'}
              onClick={() => handleTabChange('verification')}
              icon={<MapPin className="w-5 h-5" />}
              label={getText("hostDashboard.verification", language)}
            />
            <TabButton
              active={activeTab === 'photos'}
              onClick={() => handleTabChange('photos')}
              icon={<ImageIcon className="w-5 h-5" />}
              label={getText("hostDashboard.gallery", language)}
            />
            <TabButton
              active={activeTab === 'listing'}
              onClick={() => handleTabChange('listing')}
              icon={<FileText className="w-5 h-5" />}
              label={getText("hostDashboard.listing", language)}
            />
            <TabButton
              active={activeTab === 'pricing'}
              onClick={() => handleTabChange('pricing')}
              icon={<DollarSign className="w-5 h-5" />}
              label={getText("hostDashboard.pricing", language)}
            />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <ProfileSection profile={profile} user={user} supabase={supabase} onUpdate={() => loadProfile(user.id)} language={language} />
        )}
        {activeTab === "verification" && (
          <VerificationSection photos={verificationPhotos} profile={profile} language={language} />
        )}
        {activeTab === "photos" && (
          <PhotosTabEnhanced photos={listingPhotos} userId={user?.id} supabase={supabase} onUpdate={() => loadProfile(user.id)} language={language} />
        )}
        {activeTab === "listing" && (
          <ListingSection profile={profile} userId={user?.id} supabase={supabase} onUpdate={() => loadProfile(user.id)} availablePhotos={listingPhotos} language={language} />
        )}
        {activeTab === "pricing" && <PricingTab profile={profile} userId={user?.id} supabase={supabase} language={language} />}
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

function ProfileSection({ profile, user, supabase, onUpdate, language }: any) {
  const t = (key: string) => getText(key, language);
  // Support both old string format and new array format
  const parseHostTypes = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      // Handle JSON string or comma-separated
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return value.includes(',') ? value.split(',').map((s: string) => s.trim()) : [value];
      }
    }
    return [];
  };

  const [hostTypes, setHostTypes] = useState<string[]>(parseHostTypes(profile?.host_type));
  const [saving, setSaving] = useState(false);

  const toggleHostType = (type: string) => {
    setHostTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSaveHostType = async () => {
    if (hostTypes.length === 0) {
      alert(t("hostDashboard.selectAtLeastOne"));
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('host_profiles')
        .update({ host_type: hostTypes })
        .eq('user_id', user?.id);

      if (error) throw error;

      alert(t("hostDashboard.hostTypesUpdated"));
      onUpdate();
    } catch (error: any) {
      console.error('Error saving:', error);
      alert(t("hostDashboard.failedToSave") + ': ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Check if selection has changed from saved value
  const savedTypes = parseHostTypes(profile?.host_type);
  const hasChanges = JSON.stringify([...hostTypes].sort()) !== JSON.stringify([...savedTypes].sort());

  // Calculate verification progress
  const hasIdVerified = profile?.id_verified;
  const hasFaceVerified = profile?.face_verified;
  const hasHostType = hostTypes.length > 0 || savedTypes.length > 0;
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("hostDashboard.verificationStatus")}</h2>
            <p className="text-gray-600">{t("hostDashboard.completeAllSteps")}</p>
          </div>
          <div className={`px-6 py-3 rounded-full text-lg font-bold ${
            isApproved
              ? 'bg-green-500 text-white'
              : 'bg-amber-500 text-white'
          }`}>
            {isApproved ? `✓ ${t("hostDashboard.approved")}` : `⏳ ${t("hostDashboard.pending")}`}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-5 rounded-2xl border-2 ${hasIdVerified ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasIdVerified ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {hasIdVerified ? '✓' : '1'}
              </div>
              <h4 className="font-bold text-gray-900">{t("hostDashboard.idVerified")}</h4>
            </div>
            <p className="text-sm text-gray-600 ml-13">
              {hasIdVerified ? t("hostDashboard.completedViaMetamap") : t("hostDashboard.verifyYourIdentity")}
            </p>
          </div>

          <div className={`p-5 rounded-2xl border-2 ${hasFaceVerified ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasFaceVerified ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {hasFaceVerified ? '✓' : '2'}
              </div>
              <h4 className="font-bold text-gray-900">{t("hostDashboard.faceVerified")}</h4>
            </div>
            <p className="text-sm text-gray-600 ml-13">
              {hasFaceVerified ? t("hostDashboard.selfieVerificationPassed") : t("hostDashboard.completeFaceScan")}
            </p>
          </div>

          <div className={`p-5 rounded-2xl border-2 ${hasHostType ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasHostType ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {hasHostType ? '✓' : '3'}
              </div>
              <h4 className="font-bold text-gray-900">{t("hostDashboard.hostType")}</h4>
            </div>
            <p className="text-sm text-gray-600 ml-13">
              {hasHostType ? `${t("hostDashboard.selected")}: ${savedTypes.map((type: string) => t(`hostDashboard.${type}`) || type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}` : t("hostDashboard.chooseYourHostType")}
            </p>
          </div>
        </div>
      </div>

      {/* Host Type Selection Card - First, as it's part of setup */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">{t("hostDashboard.chooseHostTypes")}</h2>
          <p className="text-red-100">{t("hostDashboard.selectExperienceTypes")}</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <PremiumHostTypeCard
              icon={<Home className="w-10 h-10" />}
              title={t("hostDashboard.accommodation")}
              description={t("hostDashboard.accommodationDesc")}
              type="accommodation"
              selectedTypes={hostTypes}
              onClick={() => toggleHostType('accommodation')}
              clickToAdd={t("hostDashboard.clickToAdd")}
              clickToRemove={t("hostDashboard.clickToRemove")}
            />
            <PremiumHostTypeCard
              icon={<Compass className="w-10 h-10" />}
              title={t("hostDashboard.excursion")}
              description={t("hostDashboard.excursionDesc")}
              type="excursion"
              selectedTypes={hostTypes}
              onClick={() => toggleHostType('excursion')}
              clickToAdd={t("hostDashboard.clickToAdd")}
              clickToRemove={t("hostDashboard.clickToRemove")}
            />
            <PremiumHostTypeCard
              icon={<Heart className="w-10 h-10" />}
              title={t("hostDashboard.volunteerFarm")}
              description={t("hostDashboard.volunteerFarmDesc")}
              type="volunteer"
              selectedTypes={hostTypes}
              onClick={() => toggleHostType('volunteer')}
              clickToAdd={t("hostDashboard.clickToAdd")}
              clickToRemove={t("hostDashboard.clickToRemove")}
            />
          </div>

          {/* Selected types summary */}
          {hostTypes.length > 0 && (
            <div className="mb-6 p-4 bg-sptc-red-50 rounded-xl border border-sptc-red-200">
              <p className="text-sptc-red-800 font-semibold">
                {t("hostDashboard.selected")}: {hostTypes.map((type: string) => t(`hostDashboard.${type}`) || type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}
              </p>
            </div>
          )}

          {hasChanges && (
            <div className="flex justify-end">
              <button
                onClick={handleSaveHostType}
                disabled={saving}
                className="px-10 py-4 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold text-lg rounded-2xl hover:from-sptc-red-700 hover:to-sptc-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
              >
                {saving ? t("hostDashboard.saving") : t("hostDashboard.saveHostTypes")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">{t("hostDashboard.profileInformation")}</h2>
          <p className="text-gray-300">{t("hostDashboard.yourPersonalDetails")}</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumInfoField label={t("hostDashboard.firstName")} value={profile?.first_name} icon="👤" notSetText={t("hostDashboard.notSet")} />
            <PremiumInfoField label={t("hostDashboard.lastName")} value={profile?.last_name} icon="👤" notSetText={t("hostDashboard.notSet")} />
            <PremiumInfoField label={t("hostDashboard.email")} value={user?.email} icon="✉️" notSetText={t("hostDashboard.notSet")} />
            <PremiumInfoField label={t("hostDashboard.phone")} value={profile?.phone} icon="📱" notSetText={t("hostDashboard.notSet")} />
            <PremiumInfoField label={t("hostDashboard.country")} value={profile?.country} icon="🌍" notSetText={t("hostDashboard.notSet")} />
            <PremiumInfoField label={t("hostDashboard.city")} value={profile?.city} icon="🏙️" notSetText={t("hostDashboard.notSet")} />
            <PremiumInfoField label={t("hostDashboard.dateOfBirth")} value={profile?.date_of_birth} icon="🎂" notSetText={t("hostDashboard.notSet")} />
            <PremiumInfoField label={t("hostDashboard.memberSince")} value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'} icon="📅" notSetText={t("hostDashboard.notSet")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PremiumInfoField({ label, value, icon, notSetText = "Not set" }: { label: string; value: any; icon: string; notSetText?: string }) {
  return (
    <div className="group">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
        <span>{icon}</span>
        {label}
      </label>
      <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-gray-900 font-medium border border-gray-200 group-hover:border-sptc-red-200 transition-all">
        {value || <span className="text-gray-400 italic">{notSetText}</span>}
      </div>
    </div>
  );
}

function PremiumHostTypeCard({ icon, title, description, type, selectedTypes = [], onClick, clickToAdd = "Click to add", clickToRemove = "Click to remove" }: any) {
  const isSelected = selectedTypes.includes(type);

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
      <p className="mt-3 text-sm font-medium text-sptc-red-600">
        {isSelected ? clickToRemove : clickToAdd}
      </p>
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

function VerificationSection({ photos, profile, language }: any) {
  const t = (key: string) => getText(key, language);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("hostDashboard.verificationPhotos")}</h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-blue-900 font-semibold mb-1">{t("hostDashboard.gpsVerifiedPhotos")}</p>
        <p className="text-blue-700 text-sm">
          {t("hostDashboard.gpsVerifiedDesc")}
        </p>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t("hostDashboard.noVerificationPhotos")}</p>
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
                {t("hostDashboard.uploaded")} {new Date(photo.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ListingSection({ profile, userId, supabase, onUpdate, availablePhotos = [], language }: any) {
  const t = (key: string) => getText(key, language);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [fullAddress, setFullAddress] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [pricePerNight, setPricePerNight] = useState(50);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [maxGuests, setMaxGuests] = useState(2);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Available amenities/features that match search filters
  const AMENITY_OPTIONS = [
    { id: 'coffee-farm', labelKey: 'coffeeFarmExperience', icon: '☕' },
    { id: 'mountain-view', labelKey: 'mountainViews', icon: '🏔️' },
    { id: 'eco-friendly', labelKey: 'ecoFriendly', icon: '🌿' },
    { id: 'traditional', labelKey: 'traditionalArchitecture', icon: '🏡' },
    { id: 'wifi', labelKey: 'wifiAvailable', icon: '📶' },
    { id: 'meals', labelKey: 'mealsIncluded', icon: '🍽️' },
    { id: 'parking', labelKey: 'freeParking', icon: '🚗' },
    { id: 'nature', labelKey: 'natureTrails', icon: '🌲' },
  ];

  // Property types that match search filters
  const PROPERTY_TYPES = [
    { value: 'country_house', labelKey: 'countryHouse' },
    { value: 'traditional_home', labelKey: 'traditionalHome' },
    { value: 'coffee_farm', labelKey: 'coffeeFarm' },
    { value: 'mountain_cabin', labelKey: 'mountainCabin' },
    { value: 'eco_lodge', labelKey: 'ecoLodge' },
    { value: 'farm', labelKey: 'farmStay' },
    { value: 'villa', labelKey: 'villa' },
    { value: 'cabin', labelKey: 'cabin' },
    { value: 'cottage', labelKey: 'cottage' },
    { value: 'apartment', labelKey: 'apartment' },
  ];

  // Default test data for Fusagasugá, Colombia
  const DEFAULT_GPS = { lat: 4.3369, lng: -74.3644 };
  const DEFAULT_ADDRESS = {
    street: 'Calle 6 #8-45, Barrio Centro',
    city: 'Fusagasugá',
    region: 'Cundinamarca',
    country: 'Colombia',
    postalCode: '252211'
  };

  // Get GPS coordinates from verification photos or use default
  const getGPSFromVerificationPhotos = () => {
    if (availablePhotos && availablePhotos.length > 0) {
      const photoWithGPS = availablePhotos.find((p: any) => p.latitude && p.longitude);
      if (photoWithGPS) {
        return { lat: photoWithGPS.latitude, lng: photoWithGPS.longitude };
      }
    }
    // Return default Fusagasugá coordinates if no GPS in photos
    return DEFAULT_GPS;
  };

  // Auto-populate GPS and address when form opens (for testing)
  useEffect(() => {
    if (showForm && !editingListing) {
      const gps = getGPSFromVerificationPhotos();
      setLatitude(gps.lat);
      setLongitude(gps.lng);

      // Pre-fill with test address if empty
      if (!streetAddress) setStreetAddress(DEFAULT_ADDRESS.street);
      if (!city) setCity(DEFAULT_ADDRESS.city);
      if (!region) setRegion(DEFAULT_ADDRESS.region);
      if (!country) setCountry(DEFAULT_ADDRESS.country);
      if (!postalCode) setPostalCode(DEFAULT_ADDRESS.postalCode);
    }
  }, [showForm, availablePhotos]);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('host_profile_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error: any) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPropertyTypes([]);
    setFullAddress('');
    setStreetAddress('');
    setCity('');
    setRegion('');
    setCountry('');
    setPostalCode('');
    setLatitude(null);
    setLongitude(null);
    setPricePerNight(50);
    setBedrooms(1);
    setBathrooms(1);
    setMaxGuests(2);
    setSelectedImages([]);
    setSelectedAmenities([]);
    setEditingListing(null);
  };

  const handleEdit = (listing: any) => {
    setTitle(listing.title || '');
    setDescription(listing.description || '');
    // Handle property_type - could be string or array
    const existingTypes = listing.property_types || (listing.property_type ? [listing.property_type] : []);
    setPropertyTypes(Array.isArray(existingTypes) ? existingTypes : [existingTypes]);
    // Set address fields
    setFullAddress(listing.address || listing.location || '');
    setStreetAddress(listing.street_address || '');
    setCity(listing.city || '');
    setRegion(listing.region || '');
    setCountry(listing.country || 'Colombia');
    setPostalCode(listing.postal_code || '');
    setLatitude(listing.latitude || null);
    setLongitude(listing.longitude || null);
    setPricePerNight(listing.price_per_night || 50);
    setBedrooms(listing.bedrooms || 1);
    setBathrooms(listing.bathrooms || 1);
    setMaxGuests(listing.max_guests || 2);
    setSelectedImages(listing.images || []);
    setSelectedAmenities(listing.amenities || []);
    setEditingListing(listing);
    setShowForm(true);
  };

  const toggleImageSelection = (photoUrl: string) => {
    setSelectedImages(prev => {
      if (prev.includes(photoUrl)) {
        return prev.filter(url => url !== photoUrl);
      } else {
        return [...prev, photoUrl];
      }
    });
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    setSelectedImages(prev => {
      const newImages = [...prev];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      return newImages;
    });
  };

  const moveImageDown = (index: number) => {
    if (index === selectedImages.length - 1) return;
    setSelectedImages(prev => {
      const newImages = [...prev];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      return newImages;
    });
  };

  const handleSave = async () => {
    if (profile?.verification_status !== 'approved') {
      alert(t("hostDashboard.mustBeApproved"));
      return;
    }

    if (selectedImages.length === 0) {
      alert(t("hostDashboard.selectAtLeastOneImage"));
      return;
    }

    setSaving(true);
    try {
      // Build full address from components
      const addressParts = [streetAddress, city, region, postalCode, country].filter(Boolean);
      const computedFullAddress = addressParts.join(', ');

      const listingData = {
        host_profile_id: profile.id,
        title,
        description,
        property_type: propertyTypes[0] || 'country_house', // Primary type for backwards compatibility
        property_types: propertyTypes, // All selected types
        address: computedFullAddress,
        location: streetAddress,
        street_address: streetAddress,
        city,
        region,
        country: country || 'Colombia',
        postal_code: postalCode,
        latitude,
        longitude,
        price_per_night: pricePerNight,
        bedrooms,
        bathrooms,
        max_guests: maxGuests,
        images: selectedImages,
        amenities: selectedAmenities,
        status: 'active',
        available: true,
      };

      if (editingListing) {
        // Update existing listing
        const { error } = await supabase
          .from('listings')
          .update(listingData)
          .eq('id', editingListing.id);

        if (error) throw error;
        alert(t("hostDashboard.listingUpdated"));
      } else {
        // Create new listing
        const { error } = await supabase
          .from('listings')
          .insert(listingData);

        if (error) throw error;
        alert(t("hostDashboard.listingCreated"));
      }

      resetForm();
      setShowForm(false);
      loadListings();
      onUpdate();
    } catch (error: any) {
      console.error('Error saving listing:', error);
      alert('Failed to save: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm(t("hostDashboard.confirmDelete"))) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;
      alert(t("hostDashboard.listingDeleted"));
      loadListings();
    } catch (error: any) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete: ' + error.message);
    }
  };

  const toggleAvailability = async (listing: any) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ available: !listing.available })
        .eq('id', listing.id);

      if (error) throw error;
      loadListings();
    } catch (error: any) {
      console.error('Error toggling availability:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="w-12 h-12 border-4 border-sptc-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{t("hostDashboard.loadingListings")}</p>
      </div>
    );
  }

  // Check if host is approved
  const isApproved = profile?.verification_status === 'approved';

  return (
    <div className="space-y-6">
      {/* Not Approved Warning */}
      {!isApproved && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-2">{t("hostDashboard.verificationRequired")}</h3>
              <p className="text-amber-700">
                {t("hostDashboard.verificationRequiredDesc")}
                {" "}{t("hostDashboard.currentStatusIs")} <span className="font-bold">{profile?.verification_status || t("hostDashboard.pending")}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Listings Header */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{t("hostDashboard.yourListings")}</h2>
            <p className="text-red-100">{t("hostDashboard.manageListings")}</p>
          </div>
          {isApproved && !showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-6 py-3 bg-white text-sptc-red-600 font-bold rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {t("hostDashboard.addListing")}
            </button>
          )}
        </div>

        <div className="p-8">
          {/* Listing Form */}
          {showForm && (
            <div className="mb-8 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {editingListing ? t("hostDashboard.editListing") : t("hostDashboard.createNewListing")}
              </h3>

              <div className="space-y-6">
                {/* Title */}
                <div className={`bg-white rounded-2xl p-6 border-2 ${title ? 'border-green-300' : 'border-amber-300'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">✏️</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{t("hostDashboard.listingTitle")} *</h4>
                      <p className="text-sm text-gray-500">{t("hostDashboard.listingTitleHelp")}</p>
                    </div>
                    {title && <span className="ml-auto text-green-500 text-xl">✓</span>}
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Cozy Mountain Cabin with Amazing Views"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sptc-red-500 focus:border-transparent"
                    maxLength={100}
                  />
                </div>

                {/* Property Type - Multi-select */}
                <div className={`bg-white rounded-2xl p-6 border-2 ${propertyTypes.length > 0 ? 'border-green-300' : 'border-amber-300'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🏠</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{t("hostDashboard.propertyType")} *</h4>
                      <p className="text-sm text-gray-500">{t("hostDashboard.propertyTypeHelp")}</p>
                    </div>
                    {propertyTypes.length > 0 && <span className="ml-auto text-green-500 text-xl">✓</span>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {PROPERTY_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setPropertyTypes(prev =>
                            prev.includes(type.value)
                              ? prev.filter(t => t !== type.value)
                              : [...prev, type.value]
                          );
                        }}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          propertyTypes.includes(type.value)
                            ? 'border-sptc-red-500 bg-sptc-red-50 text-sptc-red-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-sm font-medium">{t(`hostDashboard.${type.labelKey}`)}</span>
                      </button>
                    ))}
                  </div>
                  {propertyTypes.length > 0 && (
                    <p className="text-sm text-green-600 mt-3">
                      ✓ {propertyTypes.length} {t("hostDashboard.typesSelected")}
                    </p>
                  )}
                </div>

                {/* Property Address Section */}
                <div className={`bg-white rounded-2xl p-6 border-2 ${streetAddress && city && country ? 'border-green-300' : 'border-amber-300'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-sptc-red-600" />
                    <div>
                      <h4 className="font-semibold text-gray-800">{t("hostDashboard.propertyAddress")} *</h4>
                      <p className="text-sm text-gray-500">{t("hostDashboard.propertyAddressHelp")}</p>
                    </div>
                    {streetAddress && city && country && <span className="ml-auto text-green-500 text-xl">✓</span>}
                  </div>

                  {/* Street Address - Full Width */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("hostDashboard.streetAddress")} *
                    </label>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g., Calle 10 #5-23, Vereda La Palma"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sptc-red-500 focus:border-transparent"
                    />
                  </div>

                  {/* City and Region - Two Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("hostDashboard.cityTown")} *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g., Fusagasugá"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sptc-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("hostDashboard.stateRegionProvince")}
                      </label>
                      <input
                        type="text"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        placeholder="e.g., Cundinamarca"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sptc-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Country and Postal Code - Two Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("hostDashboard.country")} *
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g., Colombia"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sptc-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("hostDashboard.postalZipCode")}
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g., 252211"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sptc-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* GPS Coordinates Display */}
                  {(latitude && longitude) ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-800 text-sm">
                          {latitude === 4.3369 && longitude === -74.3644 ? t("hostDashboard.gpsLocationDefault") : t("hostDashboard.gpsLocationVerification")}
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        {t("hostDashboard.coordinates")}: {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {t("hostDashboard.listingMapLocation")}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="font-semibold text-amber-800 text-sm">{t("hostDashboard.noGpsLocation")}</span>
                      </div>
                      <p className="text-xs text-amber-700">
                        {t("hostDashboard.gpsFromPhotos")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className={`bg-white rounded-2xl p-6 border-2 ${pricePerNight > 0 && bedrooms >= 0 && bathrooms >= 0 && maxGuests > 0 ? 'border-green-300' : 'border-amber-300'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🛏️</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{t("hostDashboard.propertyDetails")} *</h4>
                      <p className="text-sm text-gray-500">{t("hostDashboard.propertyDetailsHelp")}</p>
                    </div>
                    {pricePerNight > 0 && maxGuests > 0 && <span className="ml-auto text-green-500 text-xl">✓</span>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("hostDashboard.priceNight")}
                      </label>
                      <input
                        type="number"
                        value={pricePerNight}
                        onChange={(e) => setPricePerNight(parseInt(e.target.value) || 0)}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sptc-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("hostDashboard.bedrooms")}
                      </label>
                      <input
                        type="number"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(parseInt(e.target.value) || 1)}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sptc-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("hostDashboard.bathrooms")}
                      </label>
                      <input
                        type="number"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(parseInt(e.target.value) || 1)}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sptc-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("hostDashboard.maxGuests")}
                      </label>
                      <input
                        type="number"
                        value={maxGuests}
                        onChange={(e) => setMaxGuests(parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sptc-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Rural Experience / Amenities */}
                <div className={`bg-white rounded-2xl p-6 border-2 ${selectedAmenities.length > 0 ? 'border-green-300' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🌿</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{t("hostDashboard.ruralExperience")}</h4>
                      <p className="text-sm text-gray-500">{t("hostDashboard.ruralExperienceHelp")}</p>
                    </div>
                    {selectedAmenities.length > 0 && <span className="ml-auto text-green-500 text-xl">✓</span>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {AMENITY_OPTIONS.map((amenity) => (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => {
                          setSelectedAmenities(prev =>
                            prev.includes(amenity.id)
                              ? prev.filter(a => a !== amenity.id)
                              : [...prev, amenity.id]
                          );
                        }}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                          selectedAmenities.includes(amenity.id)
                            ? 'border-sptc-red-500 bg-sptc-red-50 text-sptc-red-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xl">{amenity.icon}</span>
                        <span className="text-sm font-medium">{t(`hostDashboard.${amenity.labelKey}`)}</span>
                      </button>
                    ))}
                  </div>
                  {selectedAmenities.length > 0 && (
                    <p className="text-sm text-green-600 mt-3">
                      ✓ {selectedAmenities.length} {t("hostDashboard.featuresSelected")}
                    </p>
                  )}
                </div>

                {/* Image Selection */}
                <div className={`bg-white rounded-2xl p-6 border-2 ${selectedImages.length > 0 ? 'border-green-300' : 'border-amber-300'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">📷</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{t("hostDashboard.propertyPhotos")} *</h4>
                      <p className="text-sm text-gray-500">{t("hostDashboard.propertyPhotosHelp")}</p>
                    </div>
                    {selectedImages.length > 0 && <span className="ml-auto text-green-500 text-xl">✓</span>}
                  </div>

                  {availablePhotos.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">{t("hostDashboard.noPhotosAvailable")}</p>
                      <p className="text-sm text-gray-500">{t("hostDashboard.goToGalleryFirst")}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Selected Images Preview */}
                      {selectedImages.length > 0 && (
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                          <p className="text-sm font-semibold text-green-800 mb-3">
                            {t("hostDashboard.selectedPhotos")} ({selectedImages.length}) - {t("hostDashboard.dragToReorder")}
                          </p>
                          <div className="flex gap-3 overflow-x-auto pb-2">
                            {selectedImages.map((imgUrl, index) => (
                              <div key={imgUrl} className="relative flex-shrink-0">
                                <img
                                  src={imgUrl}
                                  alt={`Selected ${index + 1}`}
                                  className={`w-24 h-24 object-cover rounded-lg ${index === 0 ? 'ring-4 ring-sptc-red-500' : ''}`}
                                />
                                {index === 0 && (
                                  <span className="absolute -top-2 -left-2 bg-sptc-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                    {t("hostDashboard.mainPhoto")}
                                  </span>
                                )}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                                  {index > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => moveImageUp(index)}
                                      className="w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 text-xs"
                                    >
                                      ←
                                    </button>
                                  )}
                                  {index < selectedImages.length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => moveImageDown(index)}
                                      className="w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 text-xs"
                                    >
                                      →
                                    </button>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toggleImageSelection(imgUrl)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Available Photos Grid */}
                      <div className="border-2 border-gray-200 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-3">{t("hostDashboard.clickToSelectPhotos")}</p>
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                          {availablePhotos.map((photo: any) => {
                            const isSelected = selectedImages.includes(photo.photo_url);
                            return (
                              <button
                                key={photo.id}
                                type="button"
                                onClick={() => toggleImageSelection(photo.photo_url)}
                                className={`relative aspect-square rounded-lg overflow-hidden border-3 transition-all ${
                                  isSelected
                                    ? 'border-green-500 ring-2 ring-green-300'
                                    : 'border-gray-200 hover:border-gray-400'
                                }`}
                              >
                                <img
                                  src={photo.photo_url}
                                  alt="Property"
                                  className="w-full h-full object-cover"
                                />
                                {isSelected && (
                                  <div className="absolute inset-0 bg-green-500 bg-opacity-30 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                      <span className="text-white font-bold">✓</span>
                                    </div>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className={`p-4 rounded-xl border-2 ${description.trim() ? 'border-green-500 bg-green-50/30' : 'border-amber-400 bg-amber-50/30'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t("hostDashboard.description")} *
                    </label>
                    {description.trim() && <span className="text-green-600 text-sm font-medium">✓</span>}
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("hostDashboard.descriptionPlaceholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sptc-red-500 focus:border-transparent h-32 resize-none"
                    maxLength={2000}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    {t("hostDashboard.cancel")}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !title || !streetAddress || !city || !country || !description || selectedImages.length === 0 || propertyTypes.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold rounded-xl hover:from-sptc-red-700 hover:to-sptc-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t("hostDashboard.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingListing ? t("hostDashboard.updateListing") : t("hostDashboard.createListing")}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Listings Grid */}
          {listings.length === 0 && !showForm ? (
            <div className="text-center py-12">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t("hostDashboard.noListingsYet")}</h3>
              <p className="text-gray-600 mb-6">
                {isApproved
                  ? t("hostDashboard.createFirstListing")
                  : t("hostDashboard.completeVerificationFirst")
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listings.map((listing) => {
                const listingImages = listing.images || [];
                const mainImage = listingImages[0];
                return (
                  <div
                    key={listing.id}
                    className={`border-2 rounded-2xl overflow-hidden transition-all ${
                      listing.available
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    {/* Image Preview */}
                    {mainImage && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={mainImage}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                        {listingImages.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                            +{listingImages.length - 1} {t("hostDashboard.morePhotos")}
                          </div>
                        )}
                        <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold ${
                          listing.available
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-400 text-white'
                        }`}>
                          {listing.available ? t("hostDashboard.active") : t("hostDashboard.paused")}
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-1">{listing.title}</h4>
                          <p className="text-gray-600 text-sm flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {listing.city}{listing.region ? `, ${listing.region}` : ''}
                          </p>
                        </div>
                        {!mainImage && (
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            listing.available
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-400 text-white'
                          }`}>
                            {listing.available ? t("hostDashboard.active") : t("hostDashboard.paused")}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div className="bg-white rounded-xl p-3">
                          <p className="text-2xl font-bold text-sptc-red-600">${listing.price_per_night}</p>
                          <p className="text-xs text-gray-600">{t("hostDashboard.perNight")}</p>
                        </div>
                        <div className="bg-white rounded-xl p-3">
                          <p className="text-2xl font-bold text-gray-900">{listing.bedrooms}</p>
                          <p className="text-xs text-gray-600">{t("hostDashboard.bedrooms")}</p>
                        </div>
                        <div className="bg-white rounded-xl p-3">
                          <p className="text-2xl font-bold text-gray-900">{listing.max_guests}</p>
                          <p className="text-xs text-gray-600">{t("hostDashboard.guests")}</p>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(listing)}
                          className="flex-1 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-sptc-red-300 transition-all text-sm"
                        >
                          {t("hostDashboard.edit")}
                        </button>
                        <button
                          onClick={() => toggleAvailability(listing)}
                          className={`flex-1 px-4 py-2 font-semibold rounded-xl transition-all text-sm ${
                            listing.available
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {listing.available ? t("hostDashboard.pause") : t("hostDashboard.activate")}
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-all text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PricingTab({ profile, userId, supabase, language }: any) {
  const t = (key: string) => getText(key, language);
  const [basePrice, setBasePrice] = useState(profile?.default_price_per_night || 50);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [customPrices, setCustomPrices] = useState<CustomPrice[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showDatePriceForm, setShowDatePriceForm] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Load pricing data from database
  useEffect(() => {
    loadPricingData();
  }, []);

  // Track changes
  useEffect(() => {
    setHasChanges(true);
  }, [basePrice, pricingRules, customPrices]);

  const loadPricingData = async () => {
    try {
      // Load pricing rules
      const { data: rulesData, error: rulesError } = await supabase
        .from('pricing_rules')
        .select('*')
        .eq('host_id', userId)
        .order('created_at', { ascending: true });

      if (rulesError) {
        console.error('Error loading rules:', rulesError);
      } else if (rulesData) {
        const formattedRules: PricingRule[] = rulesData.map((r: any) => ({
          id: r.id,
          name: r.rule_name,
          type: r.rule_type as "percentage" | "fixed" | "discount",
          value: parseFloat(r.value),
          startDate: r.start_date,
          endDate: r.end_date,
          appliesTo: r.applies_to as "all" | "weekends" | "weekdays" | "holidays"
        }));
        setPricingRules(formattedRules);
      }

      // Load custom prices from pricing_calendar
      const { data: calendarData, error: calendarError } = await supabase
        .from('pricing_calendar')
        .select('*')
        .eq('host_id', userId)
        .order('date', { ascending: true });

      if (calendarError) {
        console.error('Error loading calendar:', calendarError);
      } else if (calendarData) {
        const formattedPrices: CustomPrice[] = calendarData.map((cp: any) => ({
          date: cp.date,
          price: parseFloat(cp.price),
          reason: cp.notes
        }));
        setCustomPrices(formattedPrices);
      }

      setHasChanges(false);
    } catch (error) {
      console.error('Error loading pricing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAllPricing = async () => {
    setSaving(true);
    try {
      // 1. Save base price to host_profiles
      const { error: profileError } = await supabase
        .from('host_profiles')
        .update({ default_price_per_night: basePrice })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // 1b. Get host_profile id to update listings
      const { data: hostProfile } = await supabase
        .from('host_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      // 1c. Sync base price to all host's listings
      if (hostProfile?.id) {
        const { error: listingsError } = await supabase
          .from('listings')
          .update({ price_per_night: basePrice })
          .eq('host_profile_id', hostProfile.id);

        if (listingsError) {
          console.error('Error updating listings price:', listingsError);
        }
      }

      // 2. Delete existing pricing rules and insert new ones
      await supabase
        .from('pricing_rules')
        .delete()
        .eq('host_id', userId);

      if (pricingRules.length > 0) {
        const rulesToInsert = pricingRules.map(rule => ({
          host_id: userId,
          rule_name: rule.name,
          rule_type: rule.type,
          value: rule.value,
          start_date: rule.startDate,
          end_date: rule.endDate,
          applies_to: rule.appliesTo
        }));

        const { error: rulesError } = await supabase
          .from('pricing_rules')
          .insert(rulesToInsert);

        if (rulesError) throw rulesError;
      }

      // 3. Delete existing custom prices and insert new ones
      await supabase
        .from('pricing_calendar')
        .delete()
        .eq('host_id', userId);

      if (customPrices.length > 0) {
        const pricesToInsert = customPrices.map(cp => ({
          host_id: userId,
          date: cp.date,
          price: cp.price,
          notes: cp.reason || null,
          pricing_type: 'daily'
        }));

        const { error: calendarError } = await supabase
          .from('pricing_calendar')
          .insert(pricesToInsert);

        if (calendarError) throw calendarError;
      }

      setHasChanges(false);
      alert(t("hostDashboard.pricingSavedSuccess"));
    } catch (error: any) {
      console.error('Error saving pricing:', error);
      alert(t("hostDashboard.failedToSavePricing") + ' ' + error.message);
    } finally {
      setSaving(false);
    }
  };

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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-12 h-12 border-4 border-sptc-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{t("hostDashboard.loadingPricing")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Save Button - Fixed at top */}
      <div className="bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{t("hostDashboard.pricingSettings")}</h2>
            <p className="text-red-100">
              {hasChanges ? t("hostDashboard.unsavedChanges") : t("hostDashboard.allChangesSaved")}
            </p>
          </div>
          <button
            onClick={handleSaveAllPricing}
            disabled={saving || !hasChanges}
            className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all shadow-xl ${
              hasChanges
                ? 'bg-white text-sptc-red-600 hover:bg-gray-100 hover:shadow-2xl transform hover:scale-[1.02]'
                : 'bg-white/50 text-sptc-red-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-6 h-6" />
            {saving ? t("hostDashboard.saving") : t("hostDashboard.saveAllPricing")}
          </button>
        </div>
      </div>

      {/* Base Price Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-400 hover:border-green-500 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-100 to-transparent rounded-bl-full opacity-50"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-amber-100">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{t("hostDashboard.baseRate")}</h3>
                <p className="text-sm text-gray-600">{t("hostDashboard.baseRateDesc")}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">{t("hostDashboard.required")}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">{t("hostDashboard.pricePerNightUsd")}</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-600 font-bold text-xl">$</span>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setBasePrice(isNaN(val) ? 0 : val);
                  }}
                  className="w-full pl-12 pr-6 py-4 border-2 border-amber-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none font-bold text-2xl text-gray-900 bg-amber-50/50 hover:bg-white transition-colors"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="hidden md:flex flex-col items-center justify-center px-6 py-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">{t("hostDashboard.preview")}</span>
              <span className="text-3xl font-bold text-green-600">${basePrice}</span>
              <span className="text-xs text-green-600">/{t("hostDashboard.night")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-400 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg ring-4 ring-blue-100">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{t("hostDashboard.calendarPricing")}</h3>
                <p className="text-sm text-gray-600">{t("hostDashboard.clickDateCustomPrice")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <span className="font-bold text-gray-900 min-w-[150px] text-center px-2">
                {months[selectedMonth]} {selectedYear}
              </span>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {[t("hostDashboard.sun"), t("hostDashboard.mon"), t("hostDashboard.tue"), t("hostDashboard.wed"), t("hostDashboard.thu"), t("hostDashboard.fri"), t("hostDashboard.sat")].map((day) => (
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
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-400 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg ring-4 ring-purple-100">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{t("hostDashboard.pricingRules")}</h3>
                <p className="text-xs text-gray-600">{t("hostDashboard.automateYourPricing")}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingRule(null);
                setShowRuleForm(true);
              }}
              className="p-2.5 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {pricingRules.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-purple-50/50 rounded-xl border-2 border-dashed border-purple-200">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-purple-300" />
                <p className="text-sm font-semibold text-purple-600">{t("hostDashboard.noPricingRulesYet")}</p>
                <p className="text-xs text-purple-400 mt-1">{t("hostDashboard.clickToAddRule")}</p>
              </div>
            ) : (
              pricingRules.map((rule) => (
                <div
                  key={rule.id}
                  className="border-2 border-purple-200 rounded-xl p-4 hover:border-purple-400 hover:shadow-md transition-all bg-gradient-to-r from-white to-purple-50/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{rule.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {rule.type === "percentage" && rule.value > 0 && (
                          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{rule.value}%
                          </span>
                        )}
                        {rule.type === "percentage" && rule.value < 0 && (
                          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            {rule.value}%
                          </span>
                        )}
                        {rule.type === "fixed" && (
                          <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">${rule.value}</span>
                        )}
                        {rule.type === "discount" && (
                          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">-{rule.value}%</span>
                        )}
                        <span className="text-xs text-gray-500 font-medium">{rule.appliesTo}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(rule.startDate).toLocaleDateString()} - {new Date(rule.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingRule(rule);
                          setShowRuleForm(true);
                        }}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-400 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg ring-4 ring-green-100">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{t("hostDashboard.customPrices")}</h3>
              <p className="text-sm text-gray-600">{customPrices.length} {t("hostDashboard.datesWithCustomPricing")}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {customPrices.map((cp) => (
              <div
                key={cp.date}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all"
              >
                <div>
                  <p className="font-bold text-gray-900">{new Date(cp.date).toLocaleDateString()}</p>
                  <p className="text-lg font-bold text-green-600">${cp.price}</p>
                  {cp.reason && <p className="text-xs text-gray-500 mt-1">{cp.reason}</p>}
                </div>
                <button
                  onClick={() => handleDeleteCustomPrice(cp.date)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
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

      {/* Bottom Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveAllPricing}
          disabled={saving || !hasChanges}
          className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all shadow-xl ${
            hasChanges
              ? 'bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white hover:from-sptc-red-700 hover:to-sptc-red-800 hover:shadow-2xl transform hover:scale-[1.02]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Save className="w-6 h-6" />
          {saving ? t("hostDashboard.saving") : t("hostDashboard.saveAllPricing")}
        </button>
      </div>
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

interface Gallery {
  id: string;
  name: string;
  host_id: string;
  photos: Array<{ id: string; photo_url: string; gallery_id: string; display_order: number }>;
}

const MAX_PHOTOS_PER_GALLERY = 15;

function PhotosTabEnhanced({ photos, userId, supabase, onUpdate, language }: any) {
  const t = (key: string) => getText(key, language);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null); // gallery id being uploaded to
  const [showNewGalleryForm, setShowNewGalleryForm] = useState(false);
  const [newGalleryName, setNewGalleryName] = useState('');
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [editingGalleryName, setEditingGalleryName] = useState('');

  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
    try {
      // Load galleries
      const { data: galleriesData, error: galleriesError } = await supabase
        .from('photo_galleries')
        .select('*')
        .eq('host_id', userId)
        .order('created_at', { ascending: true });

      if (galleriesError) throw galleriesError;

      // Load photos for each gallery
      const { data: photosData, error: photosError } = await supabase
        .from('listing_photos')
        .select('*')
        .eq('host_id', userId)
        .order('display_order', { ascending: true });

      if (photosError) throw photosError;

      // Group photos by gallery
      const galleriesWithPhotos = (galleriesData || []).map((gallery: any) => ({
        ...gallery,
        photos: (photosData || []).filter((p: any) => p.gallery_id === gallery.id)
      }));

      setGalleries(galleriesWithPhotos);
    } catch (error: any) {
      console.error('Error loading galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGallery = async () => {
    if (!newGalleryName.trim()) {
      alert('Please enter a gallery name');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('photo_galleries')
        .insert({
          host_id: userId,
          name: newGalleryName.trim()
        })
        .select()
        .single();

      if (error) throw error;

      setGalleries(prev => [...prev, { ...data, photos: [] }]);
      setNewGalleryName('');
      setShowNewGalleryForm(false);
    } catch (error: any) {
      console.error('Error creating gallery:', error);
      alert(t("hostDashboard.failedToCreateGallery") + ' ' + error.message);
    }
  };

  const handleRenameGallery = async (galleryId: string) => {
    if (!editingGalleryName.trim()) return;

    try {
      const { error } = await supabase
        .from('photo_galleries')
        .update({ name: editingGalleryName.trim() })
        .eq('id', galleryId);

      if (error) throw error;

      setGalleries(prev => prev.map(g =>
        g.id === galleryId ? { ...g, name: editingGalleryName.trim() } : g
      ));
      setEditingGalleryId(null);
      setEditingGalleryName('');
    } catch (error: any) {
      console.error('Error renaming gallery:', error);
      alert(t("hostDashboard.failedToRenameGallery") + ' ' + error.message);
    }
  };

  const handleDeleteGallery = async (galleryId: string) => {
    if (!confirm(t("hostDashboard.deleteGalleryConfirm"))) return;

    try {
      const { error } = await supabase
        .from('photo_galleries')
        .delete()
        .eq('id', galleryId);

      if (error) throw error;

      setGalleries(prev => prev.filter(g => g.id !== galleryId));
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting gallery:', error);
      alert(t("hostDashboard.failedToDeleteGallery") + ' ' + error.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, galleryId: string) => {
    const files = e.target.files;
    if (!files) return;

    const gallery = galleries.find(g => g.id === galleryId);
    if (!gallery) return;

    const currentPhotoCount = gallery.photos.length;
    const remainingSlots = MAX_PHOTOS_PER_GALLERY - currentPhotoCount;

    if (remainingSlots <= 0) {
      alert(t("hostDashboard.galleryFull"));
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    if (filesToUpload.length < files.length) {
      alert(t("hostDashboard.onlyUploadingDueToLimit").replace('{count}', filesToUpload.length.toString()).replace('{total}', files.length.toString()).replace('{max}', MAX_PHOTOS_PER_GALLERY.toString()));
    }

    setUploading(galleryId);

    for (const file of filesToUpload) {
      if (file.type.startsWith("image/")) {
        try {
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onload = (event) => {
              resolve(event.target?.result as string);
            };
            reader.readAsDataURL(file);
          });

          const photoData = await base64Promise;
          const displayOrder = gallery.photos.length;

          const { data, error } = await supabase
            .from('listing_photos')
            .insert({
              host_id: userId,
              gallery_id: galleryId,
              photo_url: photoData,
              display_order: displayOrder,
            })
            .select()
            .single();

          if (error) throw error;

          setGalleries(prev => prev.map(g =>
            g.id === galleryId
              ? { ...g, photos: [...g.photos, data] }
              : g
          ));
        } catch (error: any) {
          console.error('Error uploading photo:', error);
          alert(t("hostDashboard.failedToUploadPhoto") + ' ' + error.message);
        }
      }
    }

    setUploading(null);
    onUpdate();
  };

  const handleDeletePhoto = async (galleryId: string, photoId: string) => {
    try {
      const { error } = await supabase
        .from('listing_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      setGalleries(prev => prev.map(g =>
        g.id === galleryId
          ? { ...g, photos: g.photos.filter(p => p.id !== photoId) }
          : g
      ));
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting photo:', error);
      alert(t("hostDashboard.failedToDeletePhoto") + ' ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-12 h-12 border-4 border-sptc-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{t("hostDashboard.loadingGalleries")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Gallery Button */}
      <div className="bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{t("hostDashboard.photoGalleries")}</h2>
            <p className="text-red-100">{t("hostDashboard.organizePhotos")} ({t("hostDashboard.maxPhotosPerGallery").replace('{max}', MAX_PHOTOS_PER_GALLERY.toString())})</p>
          </div>
          <button
            onClick={() => setShowNewGalleryForm(true)}
            className="px-6 py-3 bg-white text-sptc-red-600 font-bold rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {t("hostDashboard.addGallery")}
          </button>
        </div>
      </div>

      {/* New Gallery Form */}
      {showNewGalleryForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-sptc-red-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t("hostDashboard.createNewGallery")}</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={newGalleryName}
              onChange={(e) => setNewGalleryName(e.target.value)}
              placeholder={t("hostDashboard.galleryNamePlaceholder")}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sptc-red-600 focus:ring-2 focus:ring-red-200 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateGallery()}
            />
            <button
              onClick={handleCreateGallery}
              className="px-6 py-3 bg-sptc-red-600 text-white font-bold rounded-xl hover:bg-sptc-red-700 transition-all"
            >
              {t("hostDashboard.create")}
            </button>
            <button
              onClick={() => {
                setShowNewGalleryForm(false);
                setNewGalleryName('');
              }}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              {t("hostDashboard.cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {galleries.length === 0 && !showNewGalleryForm && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <ImageIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t("hostDashboard.noGalleriesYet")}</h3>
          <p className="text-gray-600 mb-6">{t("hostDashboard.createGalleryDesc")}</p>
          <button
            onClick={() => setShowNewGalleryForm(true)}
            className="px-8 py-4 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {t("hostDashboard.createFirstGallery")}
          </button>
        </div>
      )}

      {/* Galleries List */}
      {galleries.map((gallery) => (
        <div key={gallery.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Gallery Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
            <div className="flex items-center justify-between">
              {editingGalleryId === gallery.id ? (
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="text"
                    value={editingGalleryName}
                    onChange={(e) => setEditingGalleryName(e.target.value)}
                    className="flex-1 max-w-md px-4 py-2 rounded-lg text-gray-900"
                    onKeyDown={(e) => e.key === 'Enter' && handleRenameGallery(gallery.id)}
                    autoFocus
                  />
                  <button
                    onClick={() => handleRenameGallery(gallery.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    {t("hostDashboard.save")}
                  </button>
                  <button
                    onClick={() => {
                      setEditingGalleryId(null);
                      setEditingGalleryName('');
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    {t("hostDashboard.cancel")}
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-white">{gallery.name}</h3>
                    <p className="text-gray-400 text-sm">{gallery.photos.length} / {MAX_PHOTOS_PER_GALLERY} {t("hostDashboard.photos")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingGalleryId(gallery.id);
                        setEditingGalleryName(gallery.name);
                      }}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                      title={t("hostDashboard.renameGallery")}
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGallery(gallery.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-all"
                      title={t("hostDashboard.deleteGallery")}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Gallery Content */}
          <div className="p-6">
            {/* Upload Button */}
            <div className="mb-6">
              <label className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer ${
                gallery.photos.length >= MAX_PHOTOS_PER_GALLERY
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-xl'
              }`}>
                <Upload className="w-5 h-5" />
                {gallery.photos.length >= MAX_PHOTOS_PER_GALLERY ? t("hostDashboard.galleryFull") : t("hostDashboard.addPhotos")}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, gallery.id)}
                  className="hidden"
                  disabled={gallery.photos.length >= MAX_PHOTOS_PER_GALLERY}
                />
              </label>
              {uploading === gallery.id && (
                <span className="ml-4 text-sptc-red-600 font-semibold animate-pulse">
                  {t("hostDashboard.uploading")}
                </span>
              )}
            </div>

            {/* Photos Grid */}
            {gallery.photos.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">{t("hostDashboard.noPhotosInGallery")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {gallery.photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-sptc-red-300 transition-all group"
                  >
                    <img
                      src={photo.photo_url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <button
                      onClick={() => handleDeletePhoto(gallery.id, photo.id)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 shadow-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


