"use client";

import { useState, useEffect } from "react";
import {
  Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Shield,
  CheckCircle, AlertCircle, ArrowRight, FileText, Camera, Crown
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function HostRegister() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "Spain",
    city: "",
    dateOfBirth: "",
    agreeTerms: false,
    agreeBackgroundCheck: false,
    agreeDataProcessing: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    else {
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
      if (age < 18) newErrors.dateOfBirth = "You must be at least 18 years old";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the Terms & Conditions";
    if (!formData.agreeBackgroundCheck) newErrors.agreeBackgroundCheck = "Background check consent is required";
    if (!formData.agreeDataProcessing) newErrors.agreeDataProcessing = "Data processing consent is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/host/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
          dateOfBirth: formData.dateOfBirth,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      router.push('/host/onboarding');
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message || "Registration failed. Please try again." });
      setIsSubmitting(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'text-red-400 bg-red-500/20' };
    if (strength <= 3) return { strength, label: 'Fair', color: 'text-yellow-400 bg-yellow-500/20' };
    if (strength <= 4) return { strength, label: 'Good', color: 'text-blue-400 bg-blue-500/20' };
    return { strength, label: 'Strong', color: 'text-green-400 bg-green-500/20' };
  };

  const pwdStrength = passwordStrength();

  return (
    <div className="min-h-screen bg-ibiza-night-500 py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-ibiza-pink-500 to-ibiza-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            Become a <span className="text-gradient-party">Host</span>
          </h1>
          <p className="text-base sm:text-lg text-white/60">
            Join the Ibiza legends and share unforgettable experiences
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                num === step
                  ? 'bg-gradient-to-br from-ibiza-pink-500 to-ibiza-purple-500 text-white scale-110'
                  : num < step
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-white/50'
              }`}>
                {num < step ? <CheckCircle className="w-5 h-5" /> : num}
              </div>
              {num < 3 && (
                <div className={`w-8 sm:w-12 h-1 mx-1 sm:mx-2 rounded-full transition-all ${
                  num < step ? 'bg-green-500' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Basic Information</h2>
                  <p className="text-white/50 text-sm">Let's start with the basics</p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-ibiza-pink-500 transition-all ${
                        errors.firstName ? 'border-red-500' : 'border-white/10'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-ibiza-pink-500 transition-all ${
                        errors.lastName ? 'border-red-500' : 'border-white/10'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-ibiza-pink-500 transition-all ${
                      errors.email ? 'border-red-500' : 'border-white/10'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-ibiza-pink-500 transition-all ${
                        errors.password ? 'border-red-500' : 'border-white/10'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            pwdStrength.strength <= 2 ? 'bg-red-500' :
                            pwdStrength.strength <= 3 ? 'bg-yellow-500' :
                            pwdStrength.strength <= 4 ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(pwdStrength.strength / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${pwdStrength.color}`}>
                        {pwdStrength.label}
                      </span>
                    </div>
                  )}
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-ibiza-pink-500 transition-all ${
                        errors.confirmPassword ? 'border-red-500' : 'border-white/10'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="bg-ibiza-blue-500/10 border border-ibiza-blue-500/20 rounded-xl p-4 flex gap-3">
                  <Shield className="w-5 h-5 text-ibiza-blue-400 flex-shrink-0" />
                  <p className="text-sm text-white/60">
                    Password should be at least 8 characters with uppercase, lowercase, numbers, and special characters.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Contact Details</h2>
                  <p className="text-white/50 text-sm">How can we reach you?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-ibiza-pink-500 transition-all ${
                      errors.phone ? 'border-red-500' : 'border-white/10'
                    }`}
                    placeholder="+34 600 123 456"
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Country *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ibiza-pink-500 transition-all appearance-none"
                    >
                      <option value="Spain">Spain</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-ibiza-pink-500 transition-all ${
                        errors.city ? 'border-red-500' : 'border-white/10'
                      }`}
                      placeholder="Ibiza Town"
                    />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ibiza-pink-500 transition-all ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div className="bg-ibiza-purple-500/10 border border-ibiza-purple-500/20 rounded-xl p-4 flex gap-3">
                  <Shield className="w-5 h-5 text-ibiza-purple-400 flex-shrink-0" />
                  <p className="text-sm text-white/60">
                    You must be at least 18 years old to become a host.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Terms & Verification</h2>
                  <p className="text-white/50 text-sm">Please review and accept</p>
                </div>

                <div className="space-y-3">
                  <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    errors.agreeTerms ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}>
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="w-5 h-5 mt-0.5 rounded border-white/30 bg-white/10 text-ibiza-pink-500 focus:ring-ibiza-pink-500"
                    />
                    <div>
                      <span className="font-medium text-white text-sm">Terms & Conditions *</span>
                      <p className="text-white/50 text-xs mt-1">I agree to Ibiza Unlocked's Terms of Service and Privacy Policy</p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    errors.agreeBackgroundCheck ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}>
                    <input
                      type="checkbox"
                      name="agreeBackgroundCheck"
                      checked={formData.agreeBackgroundCheck}
                      onChange={handleChange}
                      className="w-5 h-5 mt-0.5 rounded border-white/30 bg-white/10 text-ibiza-pink-500 focus:ring-ibiza-pink-500"
                    />
                    <div>
                      <span className="font-medium text-white text-sm">Background Check Consent *</span>
                      <p className="text-white/50 text-xs mt-1">I consent to identity verification and property ownership verification</p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    errors.agreeDataProcessing ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}>
                    <input
                      type="checkbox"
                      name="agreeDataProcessing"
                      checked={formData.agreeDataProcessing}
                      onChange={handleChange}
                      className="w-5 h-5 mt-0.5 rounded border-white/30 bg-white/10 text-ibiza-pink-500 focus:ring-ibiza-pink-500"
                    />
                    <div>
                      <span className="font-medium text-white text-sm">Biometric Data Processing *</span>
                      <p className="text-white/50 text-xs mt-1">I consent to facial recognition and ID document scanning for verification</p>
                    </div>
                  </label>
                </div>

                {errors.submit && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-400">{errors.submit}</p>
                  </div>
                )}

                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <h4 className="font-medium text-white text-sm mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Next Steps After Registration
                  </h4>
                  <ul className="space-y-1 text-xs text-white/50">
                    <li>• Upload your government-issued ID</li>
                    <li>• Complete facial recognition verification</li>
                    <li>• Upload property photos with GPS verification</li>
                    <li>• Wait 24-48 hours for approval</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => { setStep(step - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-5 py-2.5 border border-white/20 text-white/70 font-medium rounded-xl hover:bg-white/10 transition-all text-sm"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="px-5 py-2.5 border border-white/20 text-white/70 font-medium rounded-xl hover:bg-white/10 transition-all text-sm"
                >
                  Cancel
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-ibiza-pink-500 to-ibiza-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-all text-sm"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Account
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Trust */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-white/40">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>256-bit encryption</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>ID verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Camera className="w-4 h-4" />
            <span>Biometric security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
