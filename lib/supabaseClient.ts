import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("🔍 Supabase Client Initialization:");
console.log("  NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓ Set" : "✗ Missing");
console.log("  NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓ Set" : "✗ Missing");
console.log("  typeof NEXT_PUBLIC_SUPABASE_URL:", typeof supabaseUrl);
console.log("  typeof NEXT_PUBLIC_SUPABASE_ANON_KEY:", typeof supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables are missing!");
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "[REDACTED]" : "undefined");

  // Don't throw - create a dummy client to prevent crashes
  // The registration will fail gracefully instead
  console.error("⚠️ Creating dummy Supabase client - registration will not work!");
}

// Create client even if variables are missing to prevent module load errors
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: "guest" | "host" | "admin";
          created_at: string;
        };
      };
      listings: {
        Row: {
          id: string;
          host_id: string;
          title: string;
          description: string;
          price: number;
          location: string;
          created_at: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          listing_id: string;
          guest_id: string;
          check_in: string;
          check_out: string;
          total_price: number;
          status: "pending" | "confirmed" | "cancelled";
          created_at: string;
        };
      };
      community_projects: {
        Row: {
          id: string;
          name: string;
          description: string;
          goal_amount: number;
          current_amount: number;
          created_at: string;
        };
      };
    };
  };
};
