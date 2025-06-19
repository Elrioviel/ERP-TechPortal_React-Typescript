import Cookies from "js-cookie";
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { setAuthToken, setLogoutCallback } from "@/store/authStore";

interface AuthContextType {
  token: string | null;
  lastName: string | null;
  isNotDealer: boolean;
  showPowerPlan: boolean;
  showKTU: boolean;
  login: (token: string, lastName: string, isNotDealer: boolean, showPowerPlan: boolean, showKTU: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isTokenExpired = (token: string): boolean => {
    try {
        const decoded: { exp: number } = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
    } catch (error) {
        return true;
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [showPowerPlan, setShowPowerPlan] = useState<boolean>(Cookies.get("showPowerPlan") === "true");
  const [showKTU, setShowKTU] = useState<boolean>(Cookies.get("showKTU") === "true");
  const [token, setToken] = useState<string | null>(Cookies.get("token") || null);
  const [lastName, setLastName] = useState<string | null>(Cookies.get("lastName") || null);
  const [isNotDealer, setIsNotDealer] = useState<boolean>(
    Cookies.get("isNotDealer") === "true"
  );

  // Синхронизируем токен с нашим глобальным хранилищем
  useEffect(() => {
    const storedToken = Cookies.get("token") || null;
    const storedLastName = Cookies.get("lastName") || null;
    const storedIsNotDealer = Cookies.get("isNotDealer") === "true" || false;
    const storedShowPowerPlan = Cookies.get("showPowerPlan") === "true" || false;
    const storedShowKTU = Cookies.get("showKTU") === "true" || false;
  
    if (storedToken) {
      setToken(storedToken);
      setAuthToken(storedToken);
    }
    if (storedLastName) {
      setLastName(storedLastName);
    }
    if (storedIsNotDealer !== undefined) {
      setIsNotDealer(storedIsNotDealer);
    }
    if (storedShowPowerPlan !== undefined) {
      setShowPowerPlan(storedShowPowerPlan)
    }
    if (storedShowKTU !== undefined) {
      setShowKTU(storedShowKTU)
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        setAuthToken(token); // Устанавливаем токен в глобальный store
      }
    }
    setLogoutCallback(logout);
  }, []);

  const login = (newToken: string, newLastName: string, newIsNotDealer: boolean, newShowPowerPlan: boolean, newShowKTU: boolean) => {
    setToken(newToken); 
    setLastName(newLastName);
    setIsNotDealer(newIsNotDealer);
    setShowPowerPlan(newShowPowerPlan);
    setShowKTU(newShowKTU);

    const decoded: { exp: number } = jwtDecode(newToken);
    const expires = new Date(decoded.exp * 1000);

    Cookies.set("token", newToken, { expires });
    Cookies.set("lastName", newLastName, { expires });
    Cookies.set("isNotDealer", String(newIsNotDealer), { expires });
    Cookies.set("showPowerPlan", String(newShowPowerPlan), { expires });
    Cookies.set("showKTU", String(newShowKTU), { expires });
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setLastName(null);
    setIsNotDealer(false);
    setShowPowerPlan(false);
    setShowKTU(false);

    Cookies.remove("token");
    Cookies.remove("lastName");
    Cookies.remove("isNotDealer");
    Cookies.remove("showPowerPlan");
    Cookies.remove("showKTU");
  };

  return (
    <AuthContext.Provider value={{ token, lastName, isNotDealer, showPowerPlan, showKTU, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};