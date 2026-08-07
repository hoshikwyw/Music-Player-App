import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminReady, setAdminReady] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setSessionReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null);
      setSessionReady(true);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Admin status is resolved server-side. The client never decides this — the
  // RLS policies enforce it regardless of what this flag says.
  useEffect(() => {
    if (!sessionReady) return undefined;

    if (!session) {
      setIsAdmin(false);
      setAdminReady(true);
      return undefined;
    }

    let active = true;
    setAdminReady(false);

    supabase.rpc("is_admin").then(({ data, error }) => {
      if (!active) return;
      if (error) console.error("Failed to resolve admin status:", error.message);
      setIsAdmin(data === true);
      setAdminReady(true);
    });

    return () => {
      active = false;
    };
  }, [session, sessionReady]);

  const signIn = useCallback(
    (email, password) => supabase.auth.signInWithPassword({ email, password }),
    []
  );

  const signOut = useCallback(() => supabase.auth.signOut(), []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAdmin,
      loading: !sessionReady || !adminReady,
      signIn,
      signOut,
    }),
    [session, isAdmin, sessionReady, adminReady, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
