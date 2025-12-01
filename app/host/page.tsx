"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/lib/text";

export default function HostPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { language } = useLanguage();
  const t = (key: string) => getText(key, language);

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // User is logged in, check if they're a host
        const { data: profile } = await supabase
          .from('host_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          // They're a host - go to dashboard
          router.push('/host/dashboard');
        } else {
          // Logged in but not a host - send to register
          router.push('/host/register');
        }
      } else {
        // Not logged in - send to login
        router.push('/host/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/host/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sptc-red-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-sptc-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{t("hostPage.loading")}</p>
      </div>
    </div>
  );
}
