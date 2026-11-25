/** @format */

"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/logo";
import { useAuth } from "@/context/AuthContext";

interface UnidadeItem {
  id: string;
  regiao: "Sudeste" | "Sul" | "Nordeste";
  nome: string;
  codigo: string;
  cnpj: string;
  status: "Ativa" | "Manutenção" | "Inativa";
  responsavel: string;
  telefone: string;
  ocupacaoPct: number;
  posicoesTexto: string;
  frota: number;
}

const CHAVE_UNIDADES = "logmagna_unidades";

const UNIDADES_INICIAIS: UnidadeItem[] = [
  {
    id: "hub-01-sp",
    regiao: "Sudeste",
    nome: "Hub Central - São Paulo/SP",
    codigo: "HUB-01-SP",
    cnpj: "CNPJ 12.345.678/0001-90",
    status: "Ativa",
    responsavel: "Rafael Lima",
    telefone: "(11) 99845-2210",
    ocupacaoPct: 85,
    posicoesTexto: "10.200 / 12.000 posições",
    frota: 24,
  },
  {
    id: "dep-02-pr",
    regiao: "Sul",
    nome: "Depósito Sul - Curitiba/PR",
    codigo: "DEP-02-PR",
    cnpj: "CNPJ 12.345.678/0002-70",
    status: "Ativa",
    responsavel: "Juliana Martins",
    telefone: "(41) 99720-1540",
    ocupacaoPct: 62,
    posicoesTexto: "4.960 / 8.000 posições",
    frota: 18,
  },
  {
    id: "hub-03-pe",
    regiao: "Nordeste",
    nome: "Hub Nordeste - Recife/PE",
    codigo: "HUB-03-PE",
    cnpj: "CNPJ 12.345.678/0003-51",
    status: "Ativa",
    responsavel: "Bruno Ferreira",
    telefone: "(81) 99218-6400",
    ocupacaoPct: 54,
    posicoesTexto: "3.240 / 6.000 posições",
    frota: 16,
  },
  {
    id: "hub-04-mg",
    regiao: "Sudeste",
    nome: "Hub Minas - Belo Horizonte/MG",
    codigo: "HUB-04-MG",
    cnpj: "CNPJ 12.345.678/0004-32",
    status: "Ativa",
    responsavel: "Ana Ribeiro",
    telefone: "(31) 99810-3320",
    ocupacaoPct: 71,
    posicoesTexto: "4.260 / 6.000 posições",
    frota: 12,
  },
  {
    id: "dep-05-sp",
    regiao: "Sudeste",
    nome: "Depósito - Campinas/SP",
    codigo: "DEP-05-SP",
    cnpj: "CNPJ 12.345.678/0005-13",
    status: "Manutenção",
    responsavel: "Lucas Santos",
    telefone: "(19) 99765-1080",
    ocupacaoPct: 48,
    posicoesTexto: "2.400 / 5.000 posições",
    frota: 7,
  },
  {
    id: "dep-06-ba",
    regiao: "Nordeste",
    nome: "Depósito - Salvador/BA",
    codigo: "DEP-06-BA",
    cnpj: "CNPJ 12.345.678/0006-02",
    status: "Inativa",
    responsavel: "Camila Rocha",
    telefone: "(71) 99146-5470",
    ocupacaoPct: 0,
    posicoesTexto: "0 / 3.000 posições",
    frota: 5,
  },
];

export default function UnidadesPage() {
  const { logado, carregando, logout } = useAuth();
  const router = useRouter();

  const [unidades, setUnidades] = useState<UnidadeItem[]>(UNIDADES_INICIAIS);
  const [busca, setBusca] = useState("");
  const [regiao, setRegiao] = useState("todas");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [mostrarForm, setMostrarForm] = useState(false);

  const [novoNome, setNovoNome] = useState("");
  const [novoCodigo, setNovoCodigo] = useState("");
  const [novaRegiao, setNovaRegiao] = useState<"Sudeste" | "Sul" | "Nordeste">(
    "Sudeste",
  );
  const [novoResponsavel, setNovoResponsavel] = useState("");

  useEffect(() => {
    if (!carregando && !logado) {
      router.replace("/login");
      return;
    }

    const salvas = localStorage.getItem(CHAVE_UNIDADES);
    if (salvas) {
      setUnidades(JSON.parse(salvas));
    } else {
      localStorage.setItem(CHAVE_UNIDADES, JSON.stringify(UNIDADES_INICIAIS));
    }
  }, [carregando, logado, router]);

  function adicionarUnidade(e: FormEvent) {
    e.preventDefault();
    if (!novoNome.trim() || !novoCodigo.trim()) return;

    const nova: UnidadeItem = {
      id: novoCodigo.trim().toLowerCase(),
      regiao: novaRegiao,
      nome: novoNome.trim(),
      codigo: novoCodigo.trim().toUpperCase(),
      cnpj: "CNPJ 12.345.678/0009-00",
      status: "Ativa",
      responsavel: novoResponsavel.trim() || "Rafael Lima",
      telefone: "(11) 99000-0000",
      ocupacaoPct: 40,
      posicoesTexto: "2.000 / 5.000 posições",
      frota: 10,
    };

    const atualizada = [...unidades, nova];
    setUnidades(atualizada);
    localStorage.setItem(CHAVE_UNIDADES, JSON.stringify(atualizada));
    setNovoNome("");
    setNovoCodigo("");
    setNovoResponsavel("");
    setMostrarForm(false);
  }

  if (carregando || !logado) return null;

  const filtradas = unidades.filter((u) => {
    const matchBusca =
      !busca.trim() ||
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      u.cnpj.toLowerCase().includes(busca.toLowerCase());
    const matchRegiao = regiao === "todas" || u.regiao === regiao;
    const matchStatus = statusFiltro === "todos" || u.status === statusFiltro;
    return matchBusca && matchRegiao && matchStatus;
  });

  const ativasCount = unidades.filter((u) => u.status === "Ativa").length;
  const frotaTotal = unidades.reduce((acc, u) => acc + u.frota, 0);

  return (
    <div className="flex min-h-screen bg-[#F8F9F8] text-neutral-900">
      <aside className="hidden w-60 shrink-0 flex-col justify-between bg-[#153123] px-4 py-5 text-white md:flex">
        <div>
          <Logo pequeno escuro />
          <p className="mt-1.5 text-[10px] tracking-wider text-emerald-200/75">
            GOVERNANÇA LOGÍSTICA CORPORATIVA
          </p>
          <nav className="mt-7 space-y-1 text-sm">
            <Link
              href="/dashboard"
              className="block rounded-lg px-3 py-2 text-emerald-100/80 hover:bg-white/5"
            >
              ▦ Dashboard
            </Link>
            <Link
              href="/tarefas"
              className="block rounded-lg px-3 py-2 text-emerald-100/80 hover:bg-white/5"
            >
              ☰ Tarefas
            </Link>
            <Link
              href="/unidades"
              className="block rounded-lg bg-[#244B38] px-3 py-2 font-medium"
            >
              🏢 Unidades
            </Link>
          </nav>
        </div>

        <button
          type="button"
          onClick={logout}
          className="rounded-lg bg-white/10 px-3 py-2 text-xs hover:bg-white/20"
        >
          Sair
        </button>
      </aside>

      <main className="flex-1 space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Gestão de Unidades e Hubs</h1>
            <p className="text-sm text-neutral-500">
              Gerencie depósitos, capacidade de armazenagem e a operação de cada
              filial.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMostrarForm(!mostrarForm)}
            className="rounded-lg bg-[#234E39] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#183728]"
          >
            + Nova Unidade
          </button>
        </div>

        {mostrarForm && (
          <form
            onSubmit={adicionarUnidade}
            className="grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 sm:grid-cols-5"
          >
            <input
              type="text"
              required
              placeholder="Nome (ex: Hub Sul - Porto Alegre/RS)"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
            />
            <input
              type="text"
              required
              placeholder="Código (ex: HUB-07-RS)"
              value={novoCodigo}
              onChange={(e) => setNovoCodigo(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
            />
            <select
              value={novaRegiao}
              onChange={(e) =>
                setNovaRegiao(e.target.value as "Sudeste" | "Sul" | "Nordeste")
              }
              className="rounded-lg border bg-white px-3 py-2 text-sm"
            >
              <option value="Sudeste">Sudeste</option>
              <option value="Sul">Sul</option>
              <option value="Nordeste">Nordeste</option>
            </select>
            <input
              type="text"
              placeholder="Responsável"
              value={novoResponsavel}
              onChange={(e) => setNovoResponsavel(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#234E39] px-4 py-2 text-xs font-semibold text-white"
            >
              Salvar Unidade
            </button>
          </form>
        )}

        {/* 4 KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-neutral-500">Unidades cadastradas</p>
            <p className="mt-2 text-3xl font-bold">0{unidades.length}</p>
            <p className="mt-1 text-xs text-neutral-500">
              Em 3 regiões do Brasil
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-neutral-500">Unidades em operação</p>
            <p className="mt-2 text-3xl font-bold">0{ativasCount}</p>
            <p className="mt-1 text-xs text-neutral-500">
              1 em manutenção · 1 inativa
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-neutral-500">Ocupação consolidada</p>
            <p className="mt-2 text-3xl font-bold">68%</p>
            <p className="mt-1 text-xs text-neutral-500">
              27.200 / 40.000 posições operacionais
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-neutral-500">Frota ativa alocada</p>
            <p className="mt-2 text-3xl font-bold">{frotaTotal}</p>
            <p className="mt-1 text-xs text-neutral-500">
              Veículos distribuídos na rede
            </p>
          </div>
        </div>

        {/* Busca e Filtros */}
        <div className="grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium">Buscar unidade</label>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, cidade ou CNPJ..."
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium">Região</label>
            <select
              value={regiao}
              onChange={(e) => setRegiao(e.target.value)}
              className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm"
            >
              <option value="todas">Todas as regiões</option>
              <option value="Sudeste">Sudeste</option>
              <option value="Sul">Sul</option>
              <option value="Nordeste">Nordeste</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium">Status</label>
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm"
            >
              <option value="todos">Todos os status</option>
              <option value="Ativa">Ativa</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Inativa">Inativa</option>
            </select>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtradas.map((u) => (
            <div
              key={u.id}
              className="space-y-3 rounded-xl border bg-white p-5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">{u.regiao}</span>
                <span className="rounded bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800">
                  • {u.status}
                </span>
              </div>

              <h2 className="text-base font-bold text-neutral-900">{u.nome}</h2>

              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#234E39]">{u.codigo}</span>
                <span className="text-neutral-400">{u.cnpj}</span>
              </div>

              <div className="border-t pt-2 text-xs">
                <p className="text-[10px] uppercase text-neutral-400">
                  Responsável operacional
                </p>
                <div className="mt-0.5 flex justify-between font-medium">
                  <span>{u.responsavel}</span>
                  <span className="text-neutral-500">{u.telefone}</span>
                </div>
              </div>

              <div className="text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">
                    Ocupação de armazenagem
                  </span>
                  <span className="font-bold">{u.ocupacaoPct}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-neutral-100">
                  <div
                    style={{ width: `${u.ocupacaoPct}%` }}
                    className="h-1.5 rounded-full bg-[#234E39]"
                  />
                </div>
                <p className="mt-1 text-[11px] text-neutral-400">
                  {u.posicoesTexto}
                </p>
              </div>

              <div className="flex items-center justify-between border-t pt-3 text-xs">
                <span className="text-neutral-600">
                  🚚 Frota ativa alocada: <strong>{u.frota} veículos</strong>
                </span>
                <Link
                  href={`/unidades/${u.id}`}
                  className="font-semibold text-[#234E39] hover:underline"
                >
                  Ver Detalhes →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
