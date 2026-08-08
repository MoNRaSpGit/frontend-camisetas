import { createContext, useContext, useState, type ReactNode } from "react";
import { loginAdmin } from "./camisetas.api";

export const ADMIN_TOKEN_STORAGE_KEY = "camisetas-admin-token";

type AuthContextValue = {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  async function login(username: string, password: string) {
    const result = await loginAdmin(username, password);
    localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, result.token);
    setToken(result.token);
    setIsLoginModalOpen(false);
  }

  function logout() {
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    setToken(null);
  }

  const value: AuthContextValue = {
    isLoggedIn: token !== null,
    login,
    logout,
    isLoginModalOpen,
    openLoginModal: () => setIsLoginModalOpen(true),
    closeLoginModal: () => setIsLoginModalOpen(false)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider.");
  }
  return context;
}
