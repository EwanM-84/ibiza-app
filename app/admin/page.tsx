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
  Edit,
  MapPin,
  Bed,
  Bath,
  User,
  CreditCard,
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  RefreshCw,
  AlertCircle,
  Banknote,
} from "lucide-react";
import { getText } from "@/lib/text";
import { useLanguage } from "@/contexts/LanguageContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Tab = "listings" | "bookings" | "users" | "funds" | "payments" | "images" | "content";

export default function AdminDashboard() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("listings");

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)' }}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                {getText("admin.title", language)}
              </h1>
              <p className="text-red-100 mt-2 text-lg">
                {getText("admin.subtitle", language)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 p-1.5 border border-gray-100">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { key: "listings", icon: Home, labelKey: "admin.listings" },
              { key: "bookings", icon: Calendar, labelKey: "admin.bookings" },
              { key: "users", icon: Users, labelKey: "admin.users" },
              { key: "funds", icon: DollarSign, labelKey: "admin.funds" },
              { key: "payments", icon: CreditCard, labelKey: "admin.payments" },
              { key: "images", icon: ImageIcon, labelKey: "admin.images" },
              { key: "content", icon: FileEdit, labelKey: "admin.homepage" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as Tab)}
                className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{getText(tab.labelKey, language)}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === "listings" && <ListingsTab />}
        {activeTab === "bookings" && <BookingsTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "funds" && <FundsTab />}
        {activeTab === "payments" && <PaymentsTab />}
        {activeTab === "images" && <ImagesTab />}
        {activeTab === "content" && <HomepageContentTab />}
      </div>
    </div>
  );
}

// ============================================================================
// LISTINGS TAB - Create, View, Edit Listings
// ============================================================================
function ListingsTab() {
  const supabase = createClientComponentClient();
  const [listings, setListings] = useState<any[]>([]);
  const [hosts, setHosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    property_type: "house",
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    location: "",
    city: "",
    region: "",
    price_per_night: 50,
    cleaning_fee: 0,
    amenities: [] as string[],
    images: [] as string[],
    status: "active",
    host_profile_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch listings and hosts separately (no joins to avoid relationship errors)
      const [listingsRes, hostsRes] = await Promise.all([
        supabase.from('listings').select('*').order('created_at', { ascending: false }),
        supabase.from('host_profiles').select('id, first_name, last_name')
      ]);

      if (listingsRes.error) {
        console.error('Listings error:', listingsRes.error);
        setError(`Listings: ${listingsRes.error.message}`);
      }
      if (hostsRes.error) {
        console.error('Hosts error:', hostsRes.error);
        setError(prev => prev ? `${prev}, Hosts: ${hostsRes.error.message}` : `Hosts: ${hostsRes.error.message}`);
      }

      // Manually attach host info to listings
      const hostsMap = new Map((hostsRes.data || []).map(h => [h.id, h]));
      const listingsWithHosts = (listingsRes.data || []).map(listing => ({
        ...listing,
        host_profiles: hostsMap.get(listing.host_profile_id) || null
      }));

      setListings(listingsWithHosts);
      setHosts(hostsRes.data || []);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({
      title: "", description: "", property_type: "house", bedrooms: 1, bathrooms: 1,
      max_guests: 2, location: "", city: "", region: "", price_per_night: 50,
      cleaning_fee: 0, amenities: [], images: [], status: "active", host_profile_id: ""
    });
    setEditingListing(null);
  };

  const handleEdit = (listing: any) => {
    setForm({
      title: listing.title || "",
      description: listing.description || "",
      property_type: listing.property_type || "house",
      bedrooms: listing.bedrooms || 1,
      bathrooms: listing.bathrooms || 1,
      max_guests: listing.max_guests || 2,
      location: listing.location || "",
      city: listing.city || "",
      region: listing.region || "",
      price_per_night: listing.price_per_night || 50,
      cleaning_fee: listing.cleaning_fee || 0,
      amenities: listing.amenities || [],
      images: listing.images || [],
      status: listing.status || "active",
      host_profile_id: listing.host_profile_id || "",
    });
    setEditingListing(listing);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.location || !form.host_profile_id) {
      alert("Please fill in title, location, and select a host");
      return;
    }
    setSaving(true);

    const data = {
      ...form,
      amenities: form.amenities,
      images: form.images,
    };

    if (editingListing) {
      await supabase.from('listings').update(data).eq('id', editingListing.id);
    } else {
      await supabase.from('listings').insert(data);
    }

    setSaving(false);
    setShowForm(false);
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    await supabase.from('listings').delete().eq('id', id);
    fetchData();
  };

  const addImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url) setForm({ ...form, images: [...form.images, url] });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 font-semibold">Database Error</p>
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-red-500 text-xs mt-2">Run FIX_ADMIN_RLS.sql in Supabase SQL Editor to fix permissions.</p>
        </div>
      )}

      {/* Add New Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Listings ({listings.length})</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add New Listing
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">{editingListing ? "Edit Listing" : "Create New Listing"}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Host *</label>
                <select
                  value={form.host_profile_id}
                  onChange={(e) => setForm({ ...form, host_profile_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  <option value="">Select a host...</option>
                  {hosts.map((h) => (
                    <option key={h.id} value={h.id}>{h.first_name} {h.last_name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                  placeholder="Beautiful Mountain Cabin"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                  rows={3}
                  placeholder="Describe the property..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Property Type</label>
                <select
                  value={form.property_type}
                  onChange={(e) => setForm({ ...form, property_type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  {["house", "apartment", "cabin", "farm", "room", "villa", "cottage", "other"].map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  {["active", "pending", "inactive", "suspended"].map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Bedrooms</label>
                <input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-xl" min="0" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Bathrooms</label>
                <input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-xl" min="0" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Max Guests</label>
                <input type="number" value={form.max_guests} onChange={(e) => setForm({ ...form, max_guests: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-xl" min="1" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Price per Night ($)</label>
                <input type="number" value={form.price_per_night} onChange={(e) => setForm({ ...form, price_per_night: parseFloat(e.target.value) })} className="w-full px-4 py-2 border rounded-xl" min="0" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Location *</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2 border rounded-xl" placeholder="San Agustin" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">City</label>
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-2 border rounded-xl" placeholder="Huila" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Region</label>
                <input type="text" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full px-4 py-2 border rounded-xl" placeholder="Coffee Region" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Cleaning Fee ($)</label>
                <input type="number" value={form.cleaning_fee} onChange={(e) => setForm({ ...form, cleaning_fee: parseFloat(e.target.value) })} className="w-full px-4 py-2 border rounded-xl" min="0" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative">
                      <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >×</button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addImageUrl} className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
                  + Add Image URL
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowForm(false); resetForm(); }} className="px-6 py-2 bg-gray-200 rounded-xl font-semibold">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold disabled:opacity-50">
                {saving ? "Saving..." : editingListing ? "Update Listing" : "Create Listing"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <EmptyState icon={Home} title="No listings yet" description="Click 'Add New Listing' to create your first property listing" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="h-40 bg-gray-200 relative">
                {listing.images?.[0] ? (
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Home className="w-12 h-12 text-gray-400" /></div>
                )}
                <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                  listing.status === "active" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                }`}>{listing.status}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg truncate">{listing.title}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-4 h-4" />{listing.location || listing.city}</p>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{listing.bedrooms}</span>
                  <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{listing.bathrooms}</span>
                  <span className="flex items-center gap-1"><User className="w-4 h-4" />{listing.max_guests}</span>
                </div>
                <p className="text-xl font-bold text-red-600 mt-2">${listing.price_per_night}<span className="text-sm font-normal text-gray-500">/night</span></p>
                <p className="text-xs text-gray-400 mt-1">Host: {listing.host_profiles?.first_name} {listing.host_profiles?.last_name}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleEdit(listing)} className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-1">
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => handleDelete(listing.id)} className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BOOKINGS TAB
// ============================================================================
function BookingsTab() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    listing_id: "",
    check_in: "",
    check_out: "",
    number_of_guests: 1,
    total_price: 0,
    status: "confirmed",
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch bookings and listings separately (no joins to avoid relationship errors)
      const [bookingsRes, listingsRes] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('listings').select('id, title, price_per_night')
      ]);
      if (bookingsRes.error) setError(`Bookings: ${bookingsRes.error.message}`);
      if (listingsRes.error) setError(prev => prev ? `${prev}, Listings: ${listingsRes.error.message}` : `Listings: ${listingsRes.error.message}`);

      // Manually attach listing info to bookings
      const listingsMap = new Map((listingsRes.data || []).map(l => [l.id, l]));
      const bookingsWithListings = (bookingsRes.data || []).map(booking => ({
        ...booking,
        listings: listingsMap.get(booking.listing_id) || null
      }));

      setBookings(bookingsWithListings);
      setListings(listingsRes.data || []);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.listing_id || !form.check_in || !form.check_out) {
      alert("Please fill all required fields");
      return;
    }
    setSaving(true);
    await supabase.from('bookings').insert(form);
    setSaving(false);
    setShowForm(false);
    setForm({ listing_id: "", check_in: "", check_out: "", number_of_guests: 1, total_price: 0, status: "confirmed" });
    fetchData();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    fetchData();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 font-semibold">Database Error</p>
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-red-500 text-xs mt-2">Run FIX_ADMIN_RLS.sql in Supabase SQL Editor to fix permissions.</p>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Bookings ({bookings.length})</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold">
          <Plus className="w-5 h-5" /> Add Booking
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Create Booking</h3>
              <button onClick={() => setShowForm(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Listing *</label>
                <select value={form.listing_id} onChange={(e) => setForm({ ...form, listing_id: e.target.value })} className="w-full px-4 py-2 border rounded-xl">
                  <option value="">Select listing...</option>
                  {listings.map((l) => <option key={l.id} value={l.id}>{l.title} - ${l.price_per_night}/night</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Check-in *</label>
                  <input type="date" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Check-out *</label>
                  <input type="date" value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Guests</label>
                  <input type="number" value={form.number_of_guests} onChange={(e) => setForm({ ...form, number_of_guests: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-xl" min="1" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Total Price ($)</label>
                  <input type="number" value={form.total_price} onChange={(e) => setForm({ ...form, total_price: parseFloat(e.target.value) })} className="w-full px-4 py-2 border rounded-xl" min="0" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 rounded-xl">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-red-600 text-white rounded-xl disabled:opacity-50">
                {saving ? "Saving..." : "Create Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <EmptyState icon={Calendar} title="No bookings yet" description="Bookings will appear here when guests make reservations" />
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Listing</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Dates</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Guests</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{b.listings?.title || "Unknown"}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(b.check_in)} - {formatDate(b.check_out)}</td>
                  <td className="px-4 py-3">{b.number_of_guests}</td>
                  <td className="px-4 py-3 font-bold">${b.total_price}</td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        b.status === "confirmed" ? "bg-green-100 text-green-700" :
                        b.status === "completed" ? "bg-blue-100 text-blue-700" :
                        b.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// USERS TAB
// ============================================================================
function UsersTab() {
  const supabase = createClientComponentClient();
  const [hosts, setHosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    city: "",
    verification_status: "approved",
  });

  useEffect(() => { fetchHosts(); }, []);

  const fetchHosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('host_profiles').select('*').order('created_at', { ascending: false });
      if (err) setError(`Host profiles: ${err.message}`);
      setHosts(data || []);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.first_name || !form.last_name) {
      alert("Please fill first and last name");
      return;
    }
    setSaving(true);
    await supabase.from('host_profiles').insert(form);
    setSaving(false);
    setShowForm(false);
    setForm({ first_name: "", last_name: "", phone: "", city: "", verification_status: "approved" });
    fetchHosts();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('host_profiles').update({ verification_status: status }).eq('id', id);
    fetchHosts();
  };

  if (loading) return <LoadingSpinner />;

  const pending = hosts.filter(h => h.verification_status === 'pending');
  const approved = hosts.filter(h => h.verification_status === 'approved');

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 font-semibold">Database Error</p>
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-red-500 text-xs mt-2">Run FIX_ADMIN_RLS.sql in Supabase SQL Editor to fix permissions.</p>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Hosts ({hosts.length})</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold">
          <Plus className="w-5 h-5" /> Add Host
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add New Host</h3>
              <button onClick={() => setShowForm(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">First Name *</label>
                  <input type="text" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Last Name *</label>
                  <input type="text" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Phone</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">City</label>
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select value={form.verification_status} onChange={(e) => setForm({ ...form, verification_status: e.target.value })} className="w-full px-4 py-2 border rounded-xl">
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 rounded-xl">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-red-600 text-white rounded-xl disabled:opacity-50">
                {saving ? "Saving..." : "Add Host"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" /> Pending Verification ({pending.length})
          </h3>
          {pending.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending verifications</p>
          ) : (
            <div className="space-y-3">
              {pending.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{h.first_name} {h.last_name}</p>
                    <p className="text-sm text-gray-500">{h.city || "Colombia"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(h.id, 'approved')} className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm">Approve</button>
                    <button onClick={() => updateStatus(h.id, 'rejected')} className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approved */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" /> Verified Hosts ({approved.length})
          </h3>
          {approved.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No verified hosts</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {approved.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{h.first_name} {h.last_name}</p>
                    <p className="text-sm text-gray-500">{h.city || "Colombia"}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Verified</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FUNDS TAB
// ============================================================================
function FundsTab() {
  const supabase = createClientComponentClient();
  const [projects, setProjects] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    goal_amount: 5000,
    current_amount: 0,
    location: "",
    impact_category: "education",
    status: "active",
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsRes, bookingsRes] = await Promise.all([
        supabase.from('community_projects').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('total_price').in('status', ['confirmed', 'completed'])
      ]);
      if (projectsRes.error) setError(`Projects: ${projectsRes.error.message}`);
      if (bookingsRes.error) setError(prev => prev ? `${prev}, Bookings: ${bookingsRes.error.message}` : `Bookings: ${bookingsRes.error.message}`);
      setProjects(projectsRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.name) {
      alert("Please enter project name");
      return;
    }
    setSaving(true);
    await supabase.from('community_projects').insert(form);
    setSaving(false);
    setShowForm(false);
    setForm({ name: "", description: "", goal_amount: 5000, current_amount: 0, location: "", impact_category: "education", status: "active" });
    fetchData();
  };

  const updateProject = async (id: string, updates: any) => {
    await supabase.from('community_projects').update(updates).eq('id', id);
    fetchData();
  };

  if (loading) return <LoadingSpinner />;

  const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);
  const platformFee = totalRevenue * 0.15;
  const communityFund = platformFee * 0.60;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 font-semibold">Database Error</p>
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-red-500 text-xs mt-2">Run FIX_ADMIN_RLS.sql in Supabase SQL Editor to fix permissions.</p>
        </div>
      )}
      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign />} />
        <StatCard title="Platform Fee (15%)" value={`$${platformFee.toFixed(0)}`} icon={<TrendingUp />} />
        <StatCard title="Community Fund" value={`$${communityFund.toFixed(0)}`} icon={<Users />} />
        <StatCard title="Active Projects" value={projects.filter(p => p.status === 'active').length.toString()} icon={<CheckCircle />} />
      </div>

      {/* Community Projects */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Projects</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold">
          <Plus className="w-5 h-5" /> Add Project
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add Community Project</h3>
              <button onClick={() => setShowForm(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Project Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded-xl" placeholder="School Renovation" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border rounded-xl" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Goal Amount ($)</label>
                  <input type="number" value={form.goal_amount} onChange={(e) => setForm({ ...form, goal_amount: parseFloat(e.target.value) })} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Current Amount ($)</label>
                  <input type="number" value={form.current_amount} onChange={(e) => setForm({ ...form, current_amount: parseFloat(e.target.value) })} className="w-full px-4 py-2 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select value={form.impact_category} onChange={(e) => setForm({ ...form, impact_category: e.target.value })} className="w-full px-4 py-2 border rounded-xl">
                  <option value="education">Education</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="environment">Environment</option>
                  <option value="health">Health</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2 border rounded-xl" placeholder="San Agustin, Huila" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 rounded-xl">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-red-600 text-white rounded-xl disabled:opacity-50">
                {saving ? "Saving..." : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <EmptyState icon={DollarSign} title="No community projects" description="Add your first community project to track funding goals" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{p.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{p.status}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{p.description}</p>
              <p className="text-xs text-gray-500 mb-3"><MapPin className="w-3 h-3 inline" /> {p.location}</p>
              <div className="flex justify-between text-sm mb-2">
                <span>${(p.current_amount || 0).toLocaleString()} raised</span>
                <span>${(p.goal_amount || 0).toLocaleString()} goal</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full mb-3">
                <div className="h-full bg-red-600 rounded-full" style={{ width: `${Math.min(100, ((p.current_amount || 0) / (p.goal_amount || 1)) * 100)}%` }} />
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Add funds"
                  className="flex-1 px-3 py-1 border rounded-lg text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseFloat((e.target as HTMLInputElement).value);
                      if (val > 0) {
                        updateProject(p.id, { current_amount: (p.current_amount || 0) + val });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <button
                  onClick={() => updateProject(p.id, { status: p.status === 'active' ? 'completed' : 'active' })}
                  className="px-3 py-1 bg-gray-100 rounded-lg text-sm"
                >
                  {p.status === 'active' ? 'Complete' : 'Reopen'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PAYMENTS TAB - Stripe & Revolut Integration
// ============================================================================
function PaymentsTab() {
  const { language } = useLanguage();
  const t = (key: string) => getText(key, language);
  const supabase = createClientComponentClient();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stripeBalance, setStripeBalance] = useState({ available: 0, pending: 0 });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  // Stripe Dashboard URL - replace with your actual Stripe account
  const STRIPE_DASHBOARD_URL = "https://dashboard.stripe.com";
  const STRIPE_PAYMENTS_URL = "https://dashboard.stripe.com/payments";
  const STRIPE_BALANCE_URL = "https://dashboard.stripe.com/balance/overview";
  const STRIPE_SETTINGS_URL = "https://dashboard.stripe.com/settings";

  // Revolut Business URL
  const REVOLUT_DASHBOARD_URL = "https://business.revolut.com";
  const REVOLUT_TRANSACTIONS_URL = "https://business.revolut.com/transactions";

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch bookings with payment info from Supabase
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (bookingsError) {
        setError(`Bookings: ${bookingsError.message}`);
      }

      // Calculate payment stats from bookings
      const confirmedBookings = (bookingsData || []).filter(b =>
        b.status === 'confirmed' || b.status === 'completed'
      );

      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);
      const pendingPayments = (bookingsData || []).filter(b => b.status === 'pending')
        .reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

      setStripeBalance({
        available: totalRevenue * 0.85, // After 15% platform fee
        pending: pendingPayments
      });

      // Create transaction list from bookings
      const transactions = (bookingsData || []).map(b => ({
        id: b.id,
        type: 'payment',
        amount: parseFloat(b.total_price) || 0,
        status: b.status,
        created_at: b.created_at,
        description: `Booking #${b.id?.slice(0, 8)}...`
      }));

      setRecentTransactions(transactions);
      setPayments(bookingsData || []);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 font-semibold">{t("admin.paymentsTab.errorLoading")}</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Quick Links Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Stripe Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <CreditCard className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{t("admin.paymentsTab.stripe")}</h3>
                <p className="text-indigo-200 text-sm">{t("admin.paymentsTab.paymentProcessing")}</p>
              </div>
            </div>
            <a
              href={STRIPE_DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-indigo-200 text-xs uppercase tracking-wide">{t("admin.paymentsTab.available")}</p>
              <p className="text-2xl font-bold">{formatCurrency(stripeBalance.available)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-indigo-200 text-xs uppercase tracking-wide">{t("admin.paymentsTab.pending")}</p>
              <p className="text-2xl font-bold">{formatCurrency(stripeBalance.pending)}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={STRIPE_PAYMENTS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              <DollarSign className="w-4 h-4" /> {t("admin.paymentsTab.paymentsButton")}
            </a>
            <a
              href={STRIPE_BALANCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              <TrendingUp className="w-4 h-4" /> {t("admin.paymentsTab.balance")}
            </a>
            <a
              href={STRIPE_SETTINGS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              <Edit className="w-4 h-4" /> {t("admin.paymentsTab.settings")}
            </a>
          </div>
        </div>

        {/* Revolut Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{t("admin.paymentsTab.revolut")}</h3>
                <p className="text-gray-400 text-sm">{t("admin.paymentsTab.bankAccount")}</p>
              </div>
            </div>
            <a
              href={REVOLUT_DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <Banknote className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide">{t("admin.paymentsTab.connectedAccount")}</p>
                <p className="font-semibold">{t("admin.paymentsTab.revolutBusinessAccount")}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={REVOLUT_DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              <Building2 className="w-4 h-4" /> {t("admin.paymentsTab.dashboard")}
            </a>
            <a
              href={REVOLUT_TRANSACTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" /> {t("admin.paymentsTab.transactions")}
            </a>
          </div>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{t("admin.paymentsTab.totalPayments")}</p>
              <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{t("admin.paymentsTab.completed")}</p>
              <p className="text-2xl font-bold text-green-600">
                {payments.filter(p => p.status === 'completed' || p.status === 'confirmed').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{t("admin.paymentsTab.pending")}</p>
              <p className="text-2xl font-bold text-yellow-600">
                {payments.filter(p => p.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl text-yellow-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{t("admin.paymentsTab.cancelled")}</p>
              <p className="text-2xl font-bold text-red-600">
                {payments.filter(p => p.status === 'cancelled').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{t("admin.paymentsTab.recentTransactions")}</h3>
          <button
            onClick={fetchPaymentData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> {t("admin.paymentsTab.refresh")}
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h4 className="text-xl font-semibold text-gray-700 mb-2">{t("admin.paymentsTab.noTransactions")}</h4>
            <p className="text-gray-500">{t("admin.paymentsTab.transactionsWillAppear")}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentTransactions.slice(0, 20).map((tx) => (
              <div key={tx.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${
                    tx.status === 'completed' || tx.status === 'confirmed'
                      ? 'bg-green-100 text-green-600'
                      : tx.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                  }`}>
                    {tx.status === 'completed' || tx.status === 'confirmed' ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : tx.status === 'pending' ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{tx.description}</p>
                    <p className="text-sm text-gray-500">{formatDate(tx.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    tx.status === 'completed' || tx.status === 'confirmed'
                      ? 'text-green-600'
                      : tx.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}>
                    {tx.status === 'cancelled' ? '-' : '+'}{formatCurrency(tx.amount)}
                  </p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                    tx.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Setup Instructions */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-bold text-lg text-blue-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {t("admin.paymentsTab.setupInstructions")}
        </h3>
        <div className="space-y-3 text-sm text-blue-800">
          <p><strong>{t("admin.paymentsTab.stripeIntegration")}</strong> {t("admin.paymentsTab.toEnableLive")}</p>
          <code className="block bg-blue-100 p-3 rounded-lg font-mono text-xs">
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...<br/>
            STRIPE_SECRET_KEY=sk_live_...
          </code>
          <p><strong>{t("admin.paymentsTab.revolutLink")}</strong> {t("admin.paymentsTab.linkRevolut")}</p>
          <div className="flex gap-3 mt-4">
            <a
              href="https://dashboard.stripe.com/apikeys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              {t("admin.paymentsTab.getStripeKeys")} <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://dashboard.stripe.com/settings/payouts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              {t("admin.paymentsTab.configurePayouts")} <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// IMAGES TAB
// ============================================================================
function ImagesTab() {
  const supabase = createClientComponentClient();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchImages(); }, []);

  const fetchImages = async () => {
    setLoading(true);
    const { data: listings } = await supabase.from('listings').select('id, title, images');
    const allImages: any[] = [];
    listings?.forEach(l => {
      (l.images || []).forEach((url: string, i: number) => {
        allImages.push({ id: `${l.id}-${i}`, url, title: `${l.title} - Image ${i + 1}`, listing_id: l.id });
      });
    });
    setImages(allImages);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error } = await supabase.storage.from('images').upload(`uploads/${fileName}`, file);
      if (error) console.error('Upload error:', error);
    }

    setUploading(false);
    alert('Images uploaded to storage. Add them to listings via the Listings tab.');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Image Gallery ({images.length})</h2>
      </div>

      {/* Upload Section */}
      <div className="bg-purple-50 rounded-xl p-6 border-2 border-dashed border-purple-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center">
            <Upload className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">Upload Images</h3>
            <p className="text-sm text-gray-600">Upload images to Supabase storage</p>
          </div>
          <label className={`px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold cursor-pointer ${uploading ? 'opacity-50' : 'hover:bg-purple-600'}`}>
            {uploading ? 'Uploading...' : 'Choose Files'}
            <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      {images.length === 0 ? (
        <EmptyState icon={ImageIcon} title="No images yet" description="Images from listings will appear here. Add images when creating or editing listings." />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-xl shadow overflow-hidden">
              <div className="aspect-[4/3] bg-gray-100">
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{img.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// HOMEPAGE CONTENT TAB
// ============================================================================
function HomepageContentTab() {
  const { language } = useLanguage();
  const supabase = createClientComponentClient();
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const defaultSections = [
    {
      section_key: 'community_projects',
      title_en: 'Current community projects',
      title_es: 'Proyectos comunitarios actuales',
      description_en: 'Help us reach our goals and make a lasting difference in rural Colombia',
      description_es: 'Ayúdanos a alcanzar nuestras metas y hacer una diferencia duradera en la Colombia rural',
      items: [
        { id: '1', image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800', title_en: 'School Renovation', title_es: 'Renovación de Escuela', description_en: 'Improving educational facilities', description_es: 'Mejorando instalaciones educativas', goal: 5000, raised: 3200 },
        { id: '2', image_url: 'https://images.unsplash.com/photo-1594708767771-a7502f38b0ff?w=800', title_en: 'Clean Water Initiative', title_es: 'Iniciativa de Agua Limpia', description_en: 'Bringing clean water to communities', description_es: 'Llevando agua limpia a comunidades', goal: 8000, raised: 6500 },
      ],
      is_active: true
    },
    {
      section_key: 'destinations',
      title_en: 'Explore Colombian destinations',
      title_es: 'Explora destinos colombianos',
      description_en: 'Authentic rural experiences across Colombia',
      description_es: 'Experiencias rurales auténticas en toda Colombia',
      items: [
        { id: '1', image_url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800', title_en: 'Coffee Region', title_es: 'Región Cafetera', description_en: 'Experience authentic coffee culture', description_es: 'Experimenta la cultura cafetera', link: '/search?region=Coffee' },
        { id: '2', image_url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800', title_en: 'Andean Mountains', title_es: 'Montañas Andinas', description_en: 'Breathtaking mountain landscapes', description_es: 'Paisajes montañosos impresionantes', link: '/search?region=Andean' },
      ],
      is_active: true
    }
  ];

  useEffect(() => { fetchSections(); }, []);

  const fetchSections = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('homepage_content').select('*').order('display_order');
    if (error || !data?.length) {
      setSections(defaultSections);
    } else {
      setSections(data);
    }
    setLoading(false);
  };

  const saveSection = async (section: any) => {
    setSaving(true);
    const { error } = await supabase.from('homepage_content').upsert({ ...section, updated_at: new Date().toISOString() }, { onConflict: 'section_key' });
    if (error) alert('Error saving. Make sure the homepage_content table exists.');
    else alert('Saved!');
    setSaving(false);
    setEditingSection(null);
    fetchSections();
  };

  const updateItem = (sectionKey: string, itemId: string, field: string, value: any) => {
    setSections(prev => prev.map(s => s.section_key === sectionKey ? {
      ...s, items: s.items.map((item: any) => item.id === itemId ? { ...item, [field]: value } : item)
    } : s));
  };

  const addItem = (sectionKey: string) => {
    const newItem = {
      id: Date.now().toString(),
      image_url: 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800',
      title_en: 'New Item', title_es: 'Nuevo Elemento',
      description_en: 'Description here', description_es: 'Descripción aquí',
      ...(sectionKey === 'community_projects' ? { goal: 1000, raised: 0 } : { link: '/search' })
    };
    setSections(prev => prev.map(s => s.section_key === sectionKey ? { ...s, items: [...s.items, newItem] } : s));
  };

  const removeItem = (sectionKey: string, itemId: string) => {
    if (!confirm('Remove this item?')) return;
    setSections(prev => prev.map(s => s.section_key === sectionKey ? { ...s, items: s.items.filter((i: any) => i.id !== itemId) } : s));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <h3 className="font-bold text-lg mb-2">Homepage Content Manager</h3>
        <p className="text-sm text-gray-600">Edit the Community Projects and Destinations sections that appear on the homepage. Click "Edit Section" to modify content.</p>
      </div>

      {sections.map((section) => (
        <div key={section.section_key} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
            <div>
              <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full font-bold mr-2">{section.section_key.replace('_', ' ')}</span>
              <span className="font-bold text-lg">{language === 'es' ? section.title_es : section.title_en}</span>
            </div>
            {editingSection === section.section_key ? (
              <div className="flex gap-2">
                <button onClick={() => saveSection(section)} disabled={saving} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => { setEditingSection(null); fetchSections(); }} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setEditingSection(section.section_key)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold flex items-center gap-1">
                <Edit className="w-4 h-4" /> Edit Section
              </button>
            )}
          </div>

          <div className="p-4">
            {editingSection === section.section_key && (
              <div className="mb-4 grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-xs font-semibold mb-1">Title (EN)</label>
                  <input type="text" value={section.title_en} onChange={(e) => setSections(prev => prev.map(s => s.section_key === section.section_key ? { ...s, title_en: e.target.value } : s))} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Title (ES)</label>
                  <input type="text" value={section.title_es} onChange={(e) => setSections(prev => prev.map(s => s.section_key === section.section_key ? { ...s, title_es: e.target.value } : s))} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Description (EN)</label>
                  <textarea value={section.description_en} onChange={(e) => setSections(prev => prev.map(s => s.section_key === section.section_key ? { ...s, description_en: e.target.value } : s))} className="w-full px-3 py-2 border rounded-lg" rows={2} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Description (ES)</label>
                  <textarea value={section.description_es} onChange={(e) => setSections(prev => prev.map(s => s.section_key === section.section_key ? { ...s, description_es: e.target.value } : s))} className="w-full px-3 py-2 border rounded-lg" rows={2} />
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Items ({section.items?.length || 0})</h4>
              {editingSection === section.section_key && (
                <button onClick={() => addItem(section.section_key)} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {section.items?.map((item: any) => (
                <div key={item.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    <img src={item.image_url} alt="" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300'} />
                    {editingSection === section.section_key && (
                      <button onClick={() => removeItem(section.section_key, item.id)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="p-3">
                    {editingSection === section.section_key ? (
                      <div className="space-y-2">
                        <input type="text" value={item.image_url} onChange={(e) => updateItem(section.section_key, item.id, 'image_url', e.target.value)} className="w-full px-2 py-1 border rounded text-xs" placeholder="Image URL" />
                        <input type="text" value={item.title_en} onChange={(e) => updateItem(section.section_key, item.id, 'title_en', e.target.value)} className="w-full px-2 py-1 border rounded text-sm" placeholder="Title (EN)" />
                        <input type="text" value={item.title_es} onChange={(e) => updateItem(section.section_key, item.id, 'title_es', e.target.value)} className="w-full px-2 py-1 border rounded text-sm" placeholder="Title (ES)" />
                        <textarea value={item.description_en} onChange={(e) => updateItem(section.section_key, item.id, 'description_en', e.target.value)} className="w-full px-2 py-1 border rounded text-xs" rows={2} placeholder="Description (EN)" />
                        {section.section_key === 'community_projects' && (
                          <div className="grid grid-cols-2 gap-2">
                            <input type="number" value={item.goal || 0} onChange={(e) => updateItem(section.section_key, item.id, 'goal', parseInt(e.target.value))} className="px-2 py-1 border rounded text-xs" placeholder="Goal" />
                            <input type="number" value={item.raised || 0} onChange={(e) => updateItem(section.section_key, item.id, 'raised', parseInt(e.target.value))} className="px-2 py-1 border rounded text-xs" placeholder="Raised" />
                          </div>
                        )}
                        {section.section_key === 'destinations' && (
                          <input type="text" value={item.link || ''} onChange={(e) => updateItem(section.section_key, item.id, 'link', e.target.value)} className="w-full px-2 py-1 border rounded text-xs" placeholder="Link URL" />
                        )}
                      </div>
                    ) : (
                      <>
                        <h5 className="font-semibold text-sm">{language === 'es' ? item.title_es : item.title_en}</h5>
                        <p className="text-xs text-gray-500 line-clamp-2">{language === 'es' ? item.description_es : item.description_en}</p>
                        {section.section_key === 'community_projects' && item.goal && (
                          <div className="mt-2">
                            <div className="h-1.5 bg-gray-200 rounded-full"><div className="h-full bg-red-600 rounded-full" style={{ width: `${Math.min(100, (item.raised / item.goal) * 100)}%` }} /></div>
                            <p className="text-xs text-gray-400 mt-1">${item.raised} / ${item.goal}</p>
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

// ============================================================================
// HELPER COMPONENTS
// ============================================================================
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-lg">
      <Icon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-red-100 rounded-xl text-red-600">{icon}</div>
      </div>
    </div>
  );
}
