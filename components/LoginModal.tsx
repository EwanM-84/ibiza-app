"use client";

import { useState } from "react";
import { X, Mail, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "client" | "host" | "admin";
}

export default function LoginModal({ isOpen, onClose, initialMode = "client" }: LoginModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"client" | "host" | "admin">(initialMode);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check for admin login
    if (email === "ewanmair8@gmail.com" && password === "login1234") {
      // Admin login successful
      console.log("Admin login successful");
      onClose();
      router.push("/admin");
      return;
    }

    // Check for host login
    if (email === "ewanmair8@gmail.com" && password === "login12344") {
      // Host login successful
      console.log("Host login successful");
      onClose();
      // TODO: Redirect to host dashboard when created
      router.push("/");
      return;
    }

    // Check for traveler login
    if (email === "ewanmair8@gmail.com" && password === "login123455") {
      // Traveler login successful
      console.log("Traveler login successful");
      onClose();
      // TODO: Redirect to traveler dashboard when created
      router.push("/");
      return;
    }

    // Regular user authentication would go here
    console.log("Login/Signup:", { mode, isSignup, email, password, name });

    // Show error for invalid credentials
    if (!isSignup && email && password) {
      setError("Invalid email or password");
    }
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login
    console.log("Social login with:", provider);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-lg overflow-hidden animate-scale-in relative"
        style={{
          background: "radial-gradient(circle at top left, #F5EBE0 0%, #E8DDD0 40%, #DED0BD 100%)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center hover:bg-sptc-gray-100 transition-colors group"
        >
          <X className="w-6 h-6 text-sptc-gray-400 group-hover:text-sptc-gray-900 transition-colors" />
        </button>

        {/* Header */}
        <div className="px-12 pt-12 pb-8 border-b border-sptc-gray-200">
          <h2 className="text-3xl font-display font-bold text-sptc-red-500 mb-2">
            {mode === "admin" ? "Admin Access" : isSignup ? "Join SPTC.Rural" : "Welcome Back"}
          </h2>
          <p className="text-sptc-gray-600 text-base">
            {mode === "admin"
              ? "Secure access to administration"
              : isSignup
              ? `Create your ${mode === "host" ? "host" : "traveler"} account`
              : `Sign in to continue your journey`
            }
          </p>
        </div>

        {/* Body */}
        <div className="px-12 py-8">
          {/* Mode Tabs (only show for non-admin) */}
          {mode !== "admin" && (
            <div className="flex gap-0 mb-8 border-b border-sptc-gray-200">
              <button
                onClick={() => setMode("client")}
                className={`flex-1 py-4 px-6 font-semibold text-sm uppercase tracking-wider transition-all relative ${
                  mode === "client"
                    ? "text-sptc-red-600"
                    : "text-sptc-gray-500 hover:text-sptc-gray-700"
                }`}
              >
                Traveler
                {mode === "client" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sptc-red-600"></div>
                )}
              </button>
              <button
                onClick={() => setMode("host")}
                className={`flex-1 py-4 px-6 font-semibold text-sm uppercase tracking-wider transition-all relative ${
                  mode === "host"
                    ? "text-sptc-red-600"
                    : "text-sptc-gray-500 hover:text-sptc-gray-700"
                }`}
              >
                Host
                {mode === "host" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sptc-red-600"></div>
                )}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (only for signup) */}
            {isSignup && (
              <div>
                <label className="block text-xs font-bold text-sptc-red-500 mb-3 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-0 py-3 border-0 border-b-2 border-sptc-gray-300 focus:outline-none focus:border-sptc-red-600 transition-colors bg-transparent text-base"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-xs font-bold text-sptc-red-500 mb-3 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-0 py-3 border-0 border-b-2 border-sptc-gray-300 focus:outline-none focus:border-sptc-red-600 transition-colors bg-transparent text-base"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-bold text-sptc-red-500 mb-3 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-0 py-3 pr-10 border-0 border-b-2 border-sptc-gray-300 focus:outline-none focus:border-sptc-red-600 transition-colors bg-transparent text-base"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-sptc-gray-500 hover:text-sptc-red-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-semibold">{error}</p>
              </div>
            )}

            {/* Forgot password (only for login) */}
            {!isSignup && mode !== "admin" && (
              <div className="text-right -mt-2">
                <button type="button" className="text-xs text-sptc-gray-600 hover:text-sptc-red-600 font-semibold uppercase tracking-wider transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-sptc-red-500 hover:bg-sptc-red-600 text-white font-bold py-4 transition-all duration-300 text-sm uppercase tracking-wider mt-2"
            >
              {isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Social login (not for admin) */}
          {mode !== "admin" && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-sptc-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 text-sptc-gray-500 uppercase tracking-wider font-semibold" style={{ background: "radial-gradient(circle at top left, #F5EBE0 0%, #E8DDD0 40%, #DED0BD 100%)" }}>Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSocialLogin("google")}
                  className="flex items-center justify-center gap-3 px-4 py-4 border-2 border-sptc-gray-200 hover:border-sptc-gray-900 transition-all duration-200 group bg-white"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-xs font-bold text-sptc-gray-700 group-hover:text-sptc-gray-900 uppercase tracking-wider">Google</span>
                </button>

                <button
                  onClick={() => handleSocialLogin("facebook")}
                  className="flex items-center justify-center gap-3 px-4 py-4 border-2 border-sptc-gray-200 hover:border-sptc-gray-900 transition-all duration-200 group bg-white"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-xs font-bold text-sptc-gray-700 group-hover:text-sptc-gray-900 uppercase tracking-wider">Facebook</span>
                </button>
              </div>
            </>
          )}

          {/* Toggle between login and signup (not for admin) */}
          {mode !== "admin" && (
            <div className="mt-8 pt-6 border-t border-sptc-gray-200 text-center text-sm text-sptc-red-500">
              {isSignup ? "Already have an account?" : "New to SPTC.Rural?"}{" "}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-sptc-red-600 hover:text-sptc-red-700 font-bold transition-colors uppercase tracking-wider text-xs"
              >
                {isSignup ? "Sign in" : "Create account"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
