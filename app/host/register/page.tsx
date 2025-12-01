"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/lib/text";
import {
  Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Shield,
  CheckCircle, AlertCircle, ArrowRight, FileText, Camera
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function HostRegister() {
  const { language } = useLanguage();
  const t = (key: string) => getText(key, language);
  const router = useRouter();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [step, setStep] = useState(1); // 1: Basic Info, 2: Contact Details, 3: Agreement
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "Colombia",
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

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("hostRegister.firstNameRequired");
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t("hostRegister.lastNameRequired");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("hostRegister.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("hostRegister.emailInvalid");
    }
    if (!formData.password) {
      newErrors.password = t("hostRegister.passwordRequired");
    } else if (formData.password.length < 8) {
      newErrors.password = t("hostRegister.passwordMinLength");
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("hostRegister.passwordsNoMatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.phone.trim()) {
      newErrors.phone = t("hostRegister.phoneRequired");
    }
    if (!formData.city.trim()) {
      newErrors.city = t("hostRegister.cityRequired");
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t("hostRegister.dobRequired");
    } else {
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = t("hostRegister.mustBe18");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = t("hostRegister.mustAgreeTerms");
    }
    if (!formData.agreeBackgroundCheck) {
      newErrors.agreeBackgroundCheck = t("hostRegister.mustAgreeBackground");
    }
    if (!formData.agreeDataProcessing) {
      newErrors.agreeDataProcessing = t("hostRegister.mustAgreeData");
    }

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
      // Call API route to create user and profile
      const response = await fetch('/api/host/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to onboarding for identity verification
      router.push('/host/onboarding');

    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message || t("hostRegister.registrationFailed") });
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

    if (strength <= 2) return { strength, label: t("hostRegister.weak"), color: 'text-red-600 bg-red-100' };
    if (strength <= 3) return { strength, label: t("hostRegister.fair"), color: 'text-yellow-600 bg-yellow-100' };
    if (strength <= 4) return { strength, label: t("hostRegister.good"), color: 'text-blue-600 bg-blue-100' };
    return { strength, label: t("hostRegister.strong"), color: 'text-green-600 bg-green-100' };
  };

  const pwdStrength = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {t("hostRegister.title")}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t("hostRegister.subtitle")}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                num === step
                  ? 'bg-gradient-to-br from-sptc-red-600 to-sptc-red-700 text-white scale-110 shadow-lg'
                  : num < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {num < step ? <CheckCircle className="w-5 h-5" /> : num}
              </div>
              {num < 3 && (
                <div className={`w-12 h-1 mx-2 rounded-full transition-all ${
                  num < step ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: '"DM Serif Display", serif' }}>
                    {t("hostRegister.basicInformation")}
                  </h2>
                  <p className="text-gray-600">{t("hostRegister.letsStart")}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {t("hostRegister.firstName")} *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sptc-red-500 transition-all ${
                          errors.firstName ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="John"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {t("hostRegister.lastName")} *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sptc-red-500 transition-all ${
                          errors.lastName ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Doe"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t("hostRegister.emailAddress")} *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sptc-red-500 transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t("hostRegister.password")} *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-[4rem] pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sptc-red-500 transition-all ${
                        errors.password ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              pwdStrength.strength <= 2 ? 'bg-red-500' :
                              pwdStrength.strength <= 3 ? 'bg-yellow-500' :
                              pwdStrength.strength <= 4 ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(pwdStrength.strength / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${pwdStrength.color}`}>
                          {pwdStrength.label}
                        </span>
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t("hostRegister.confirmPassword")} *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-[4rem] pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sptc-red-500 transition-all ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    {t("hostRegister.passwordTip")}
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: '"DM Serif Display", serif' }}>
                    {t("hostRegister.contactDetails")}
                  </h2>
                  <p className="text-gray-600">{t("hostRegister.howCanWeReach")}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t("hostRegister.phoneNumber")} *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-[4rem] pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sptc-red-500 transition-all ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {t("hostRegister.country")} *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full pl-[4rem] pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sptc-red-500 transition-all appearance-none bg-white"
                      >
                        <option value="Colombia">Colombia</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {t("hostRegister.city")} *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sptc-red-500 transition-all ${
                        errors.city ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Fusagasugá"
                    />
                    {errors.city && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.city}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t("hostRegister.dateOfBirth")} *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sptc-red-500 transition-all ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-3">
                  <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-purple-800">
                    {t("hostRegister.ageTip")}
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Agreements */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: '"DM Serif Display", serif' }}>
                    {t("hostRegister.termsVerification")}
                  </h2>
                  <p className="text-gray-600">{t("hostRegister.pleaseReviewAccept")}</p>
                </div>

                <div className="space-y-4">
                  <div className={`border-2 rounded-xl p-5 transition-all ${
                    errors.agreeTerms ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}>
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="w-5 h-5 mt-0.5 text-sptc-red-600 border-gray-300 rounded focus:ring-sptc-red-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-5 h-5 text-gray-600" />
                          <span className="font-bold text-gray-900">{t("hostRegister.termsConditions")} *</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {t("hostRegister.agreeToTerms")}
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className={`border-2 rounded-xl p-5 transition-all ${
                    errors.agreeBackgroundCheck ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}>
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeBackgroundCheck"
                        checked={formData.agreeBackgroundCheck}
                        onChange={handleChange}
                        className="w-5 h-5 mt-0.5 text-sptc-red-600 border-gray-300 rounded focus:ring-sptc-red-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="w-5 h-5 text-gray-600" />
                          <span className="font-bold text-gray-900">{t("hostRegister.backgroundCheckConsent")} *</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {t("hostRegister.backgroundCheckText")}
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className={`border-2 rounded-xl p-5 transition-all ${
                    errors.agreeDataProcessing ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}>
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeDataProcessing"
                        checked={formData.agreeDataProcessing}
                        onChange={handleChange}
                        className="w-5 h-5 mt-0.5 text-sptc-red-600 border-gray-300 rounded focus:ring-sptc-red-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Camera className="w-5 h-5 text-gray-600" />
                          <span className="font-bold text-gray-900">{t("hostRegister.biometricDataProcessing")} *</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {t("hostRegister.biometricDataText")}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-800">{errors.submit}</p>
                  </div>
                )}

                <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    {t("hostRegister.nextStepsTitle")}
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      {t("hostRegister.nextStep1")}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      {t("hostRegister.nextStep2")}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      {t("hostRegister.nextStep3")}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      {t("hostRegister.nextStep4")}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t-2 border-gray-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setStep(step - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  {t("hostRegister.back")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  {t("hostRegister.cancel")}
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-sptc-red-600 to-sptc-red-700 text-white font-bold rounded-xl hover:from-sptc-red-700 hover:to-sptc-red-800 transition-all shadow-lg transform hover:scale-105"
                >
                  {t("hostRegister.continue")}
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t("hostRegister.creatingAccount")}
                    </>
                  ) : (
                    <>
                      {t("hostRegister.createAccount")}
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>{t("hostRegister.encryption")}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{t("hostRegister.idVerified")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            <span>{t("hostRegister.biometricSecurity")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
