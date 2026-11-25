/** @format */

"use client";

import { createContext, ReactNode, useContext, useState } from "react";

const SENHA_UNICA = "logmagna2";
const CHAVE = "logmagna_auth";

type AuthContextType = {
  logado: boolean;
  carregando: boolean;
  emailUsuario: string;
  login: (email: string, senha: string, lembrar?: boolean) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [logado, setLogado] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      localStorage.getItem(CHAVE) === "true" ||
      sessionStorage.getItem(CHAVE) === "true"
    );
  });

  const [emailUsuario, setEmailUsuario] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return (
      localStorage.getItem("logmagna_email") ||
      sessionStorage.getItem("logmagna_email") ||
      ""
    );
  });

  const carregando = false;

  function login(email: string, senha: string, lembrar = false) {
    const emailLimpo = email.trim().toLowerCase();

    if (emailLimpo.includes("@") && senha === SENHA_UNICA) {
      setLogado(true);
      setEmailUsuario(emailLimpo);

      if (typeof window !== "undefined") {
        const storage = lembrar ? localStorage : sessionStorage;
        storage.setItem(CHAVE, "true");
        storage.setItem("logmagna_email", emailLimpo);
      }
      return true;
    }

    return false;
  }

  function logout() {
    setLogado(false);
    setEmailUsuario("");

    if (typeof window !== "undefined") {
      localStorage.removeItem(CHAVE);
      localStorage.removeItem("logmagna_email");
      sessionStorage.removeItem(CHAVE);
      sessionStorage.removeItem("logmagna_email");
    }
  }

  return (
    <AuthContext.Provider
      value={{ logado, carregando, emailUsuario, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return ctx;
}
