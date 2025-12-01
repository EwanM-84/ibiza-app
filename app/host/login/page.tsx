"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/lib/text";

export default function HostLogin() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { language } = useLanguage();
  const t = (key: string) => getText(key, language);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Check if already logged in
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      router.push('/host/dashboard');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Check if user is a host
      const { data: profile } = await supabase
        .from('host_profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (!profile) {
        setError(t("hostLogin.notHostError"));
        await supabase.auth.signOut();
        return;
      }

      // Success - redirect to dashboard
      router.push('/host/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || t("hostLogin.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sptc-red-50 to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {t("hostLogin.title")}
          </h1>
          <p className="text-gray-600">
            {t("hostLogin.subtitle")}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-900 text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("hostLogin.emailAddress")}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("hostLogin.emailPlaceholder")}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sptc-red-600 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("hostLogin.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("hostLogin.passwordPlaceholder")}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sptc-red-600 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-sptc-red-600 text-white font-bold rounded-xl hover:bg-sptc-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  {t("hostLogin.loggingIn")}
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {t("hostLogin.logIn")}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">{t("hostLogin.dontHaveAccount")}</span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            href="/host/register"
            className="w-full py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            {t("hostLogin.registerAsHost")}
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
            ← {t("hostLogin.backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
