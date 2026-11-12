/** @format */

"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const CHAVE = "logmagna_auth";

type AuthContextType = {
  logado: boolean;
  carregando: boolean;
  login: (email: string, senha: string, lembrar: boolean) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [logado, setLogado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Ao abrir o site, verifica se já existe login salvo no navegador
  useEffect(() => {
    const salvo =
      localStorage.getItem(CHAVE) === "true" ||
      sessionStorage.getItem(CHAVE) === "true";
    setLogado(salvo);
    setCarregando(false);
  }, []);

  function login(email: string, senha: string, lembrar: boolean) {
    // Login de demonstração (mock)
    if (email === "admin@empresa.com" && senha === "123456") {
      (lembrar ? localStorage : sessionStorage).setItem(CHAVE, "true");
      setLogado(true);
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(CHAVE);
    sessionStorage.removeItem(CHAVE);
    setLogado(false);
  }

  return (
    <AuthContext.Provider value={{ logado, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
