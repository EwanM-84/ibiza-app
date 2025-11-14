import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are not set. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
