import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "superadmin" | "admin" | "manager" | "agent" | "viewer";

interface AuthContextValue {
  user: (User & { role?: UserRole }) | null;
  session: Session | null;
  workspaceId: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  workspaceId: null,
  loading: true,
  signOut: async () => {},
  hasPermission: () => false,
});

// Simple permission map for our roles
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  superadmin: ["*"],
  admin: ["inbox.*", "knowledge.*", "settings.*", "users.*", "analytics.view"],
  manager: ["inbox.*", "knowledge.*", "analytics.view"],
  agent: ["inbox.view", "inbox.reply", "knowledge.view"],
  viewer: ["inbox.view", "knowledge.view", "analytics.view"],
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<(User & { role?: UserRole }) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (uid: string): Promise<UserRole> => {
    // In a real app, you'd fetch this from a 'profiles' or 'roles' table
    // For now, let's treat the first user as superadmin, others as admin
    // Or you can use user_metadata if you set it during signup
    return "superadmin"; 
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.role) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role];
    if (userPermissions.includes("*")) return true;
    
    return userPermissions.some(p => {
      if (p === permission) return true;
      if (p.endsWith(".*")) {
        const prefix = p.split(".")[0];
        return permission.startsWith(prefix + ".");
      }
      return false;
    });
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, s) => {
      setSession(s);
      if (s?.user) {
        const role = await fetchUserRole(s.user.id);
        setUser({ ...s.user, role });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        const role = await fetchUserRole(s.user.id);
        setUser({ ...s.user, role });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, workspaceId, loading, signOut, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
