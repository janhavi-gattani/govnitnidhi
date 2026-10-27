import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { AuthenticatedUser } from "@/lib/api";
import { login as apiLogin, logout as apiLogout, getCurrentUser } from "@/lib/api";

interface AuthContextValue {
  user: AuthenticatedUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify token and get current user from API
    const verifyAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          // Token invalid or expired, clear user
          setUser(null);
        }
      } else {
        // No token, try to load from localStorage as fallback
        const stored = localStorage.getItem("currentUser");
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const { user } = await apiLogin(username, password);
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}


