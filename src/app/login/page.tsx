/** @format */

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Logo from "@/components/logo";
import { useAuth } from "@/context/AuthContext";

type Erros = { email?: string; senha?: string };
type Mensagem = { tipo: "sucesso" | "erro"; texto: string };

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState<Erros>({});
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);

  function validar() {
    const novos: Erros = {};
    const emailLimpo = email.trim();

    if (!emailLimpo) novos.email = "Informe seu e-mail corporativo.";
    else if (!/^\S+@\S+\.\S+$/.test(emailLimpo))
      novos.email = "Digite um e-mail válido.";

    if (!senha) novos.senha = "Informe a senha única.";

    setErros(novos);
    return Object.keys(novos).length === 0;
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    setMensagem(null);
    if (!validar()) return;

    if (login(email.trim(), senha, lembrar)) {
      setMensagem({
        tipo: "sucesso",
        texto: "Login realizado! Redirecionando...",
      });
      router.push("/dashboard");
    } else {
      setMensagem({ tipo: "erro", texto: "E-mail ou senha única incorretos." });
    }
  }

  const campo = (temErro: boolean) =>
    `w-full rounded-lg border bg-white py-3.5 pl-11 pr-11 text-sm outline-none focus:ring-2 focus:ring-brand/30 ${
      temErro ? "border-red-500" : "border-gray-300 focus:border-brand"
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <Logo />
        <p className="mb-8 mt-3 text-sm text-gray-500">
          Corporate Logistics Governance
        </p>

        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-semibold">Acesse sua conta</h1>
          <p className="mb-6 mt-1 text-sm text-gray-500">
            Sua operação, conectada e sob controle.
          </p>

          <form onSubmit={enviar} noValidate className="space-y-5">
            {mensagem && (
              <div
                role="alert"
                className={`rounded-lg px-4 py-3 text-sm ${
                  mensagem.tipo === "sucesso"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {mensagem.texto}
              </div>
            )}

            {/* E-mail */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                E-mail corporativo
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  id="email"
                  type="email"
                  placeholder="voce@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!erros.email}
                  className={campo(!!erros.email)}
                />
              </div>
              {erros.email && (
                <p className="mt-1 text-sm text-red-600">{erros.email}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="mb-2 block text-sm font-medium">
                Senha única
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite a senha única"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  aria-invalid={!!erros.senha}
                  className={campo(!!erros.senha)}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {erros.senha && (
                <p className="mt-1 text-sm text-red-600">{erros.senha}</p>
              )}
            </div>

            {/* Lembrar / Esqueceu */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={(e) => setLembrar(e.target.checked)}
                  className="h-4 w-4 accent-[#2d5b49]"
                />
                Lembrar deste dispositivo
              </label>
              <button
                type="button"
                onClick={() => alert("Fluxo de recuperação de senha (mock).")}
                className="font-semibold text-brand hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Entrar na plataforma <ArrowRight size={18} />
            </button>

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="h-px flex-1 bg-gray-200" /> ou{" "}
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={() => alert("Login via SSO (mock).")}
              className="relative flex w-full items-center justify-center rounded-lg border border-gray-300 py-3.5 text-sm text-brand hover:bg-gray-50"
            >
              <Building2 size={18} className="absolute left-4" />
              Login corporativo via SSO (SAML / Microsoft)
            </button>
          </form>
        </div>

        <p className="mt-6 flex items-center gap-1.5 text-xs text-gray-500">
          <ShieldCheck size={14} /> Acesso seguro ao seu ambiente corporativo
        </p>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 text-xs text-gray-500">
        <span>© 2026 LogMagna. Todos os direitos reservados.</span>
        <span className="flex gap-6">
          <a href="#" className="hover:underline">
            Privacidade
          </a>
          <a href="#" className="font-medium text-brand hover:underline">
            Precisa de ajuda?
          </a>
        </span>
      </footer>
    </div>
  );
}
