import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TEST_MODE, GUEST_USER_ID, GUEST_PROFILE } from "@/lib/testMode";
import type { User, Session } from "@supabase/supabase-js";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  credits: number;
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
  const [user, setUser] = useState<User | null>(
    TEST_MODE ? ({ id: GUEST_USER_ID, email: GUEST_PROFILE.email } as unknown as User) : null
  );
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(TEST_MODE ? GUEST_PROFILE : null);
  const [loading, setLoading] = useState(!TEST_MODE);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url, email, credits")
      .eq("user_id", userId)
      .single();
    if (data) setProfile(data);
  };

  const refreshProfile = async () => {
    if (TEST_MODE) return;
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    if (TEST_MODE) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => fetchProfile(session.user.id), 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
