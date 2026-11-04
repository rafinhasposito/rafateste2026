import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  credits: number;
  full_name?: string | null;
  birth_date?: string | null;
  birth_time?: string | null;
  birth_city?: string | null;
  birth_lat?: number | null;
  birth_lon?: number | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const pendingRaw = localStorage.getItem("ps_pending_natal_passport");
      if (pendingRaw) {
        const pending = JSON.parse(pendingRaw);
        if (pending && pending.full_name && pending.birth_date && pending.birth_time && pending.birth_city) {
          const parts = String(pending.birth_city).split(",").map((s: string) => s.trim());
          const country = parts.length > 1 ? parts[parts.length - 1] : null;
          await supabase
            .from("profiles")
            .update({
              full_name: pending.full_name,
              display_name: pending.full_name,
              birth_date: pending.birth_date,
              birth_time: pending.birth_time,
              birth_city: pending.birth_city,
              birth_country: country,
              birth_lat: pending.birth_lat ?? null,
              birth_lon: pending.birth_lon ?? null,
            })
            .eq("user_id", userId);
          localStorage.removeItem("ps_pending_natal_passport");
        }
      }
    } catch (e) {
      console.error("Failed to sync pending natal passport:", e);
    }

    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url, email, credits, full_name, birth_date, birth_time, birth_city, birth_lat, birth_lon")
      .eq("user_id", userId)
      .single();
    if (data) setProfile(data);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (!session?.user) {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    if (user?.id) {
      fetchProfile(user.id).then(() => {
        if (mounted) setLoading(false);
      });
    }
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
