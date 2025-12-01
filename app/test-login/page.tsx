"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestLogin() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page after 1 second
    setTimeout(() => {
      router.push('/host/login');
    }, 1000);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Login...</h1>
        <p className="text-gray-600">You will be redirected to the host login page in 1 second.</p>
        <div className="mt-4">
          <a href="/host/login" className="text-blue-600 underline">
            Click here if not redirected automatically
          </a>
        </div>
      </div>
    </div>
  );
}
