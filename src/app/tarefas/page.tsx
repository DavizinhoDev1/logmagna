/** @format */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/logo";
import { useAuth } from "@/context/AuthContext";

type StatusTarefa = "Pendente" | "Em Trânsito" | "Concluída";
type PrioridadeTarefa = "Baixa" | "Média" | "Alta" | "Normal";

export interface TarefaItem {
  id: string;
  titulo: string;
  subtitulo: string;
  categoria: string;
  responsavel: string;
  prazo: string;
  slaDetalhe: string;
  prioridade: PrioridadeTarefa;
  status: StatusTarefa;
}

const CHAVE_TAREFAS = "logmagna_tarefas";

const TAREFAS_INICIAIS: TarefaItem[] = [
  {
    id: "#TRK-8921",
    titulo: "Emitir CTe da carga para Curitiba",
    subtitulo: "CRG-0842 · Pendente",
    categoria: "Emissão de CTe",
    responsavel: "Rafael Lima",
    prazo: "14 out. 2026 · 10h30",
    slaDetalhe: "30 min em atraso",
    prioridade: "Alta",
    status: "Pendente",
  },
  {
    id: "#TRK-8920",
    titulo: "Liberar carga no CD Guarulhos",
    subtitulo: "CRG-0856 · Pendente",
    categoria: "Liberação de Carga",
    responsavel: "Ana Ribeiro",
    prazo: "14 out. 2026 · 11h30",
    slaDetalhe: "Vence em 30 min",
    prioridade: "Alta",
    status: "Pendente",
  },
  {
    id: "#TRK-8919",
    titulo: "Revisar sistema de freios · ABC-1D23",
    subtitulo: "Frota própria · Pendente",
    categoria: "Manutenção",
    responsavel: "Carlos Souza",
    prazo: "14 out. 2026 · 12h00",
    slaDetalhe: "Vence em 1 hora",
    prioridade: "Alta",
    status: "Pendente",
  },
  {
    id: "#TRK-8918",
    titulo: "Monitorar entrega em Belo Horizonte",
    subtitulo: "CRG-0861 · Em Trânsito",
    categoria: "Monitoramento",
    responsavel: "Lucas Santos",
    prazo: "14 out. 2026 · 14h00",
    slaDetalhe: "Dentro do prazo",
    prioridade: "Normal",
    status: "Em Trânsito",
  },
  {
    id: "#TRK-8913",
    titulo: "Confirmar recebimento em Sorocaba",
    subtitulo: "CRG-0839 · Concluída",
    categoria: "Comprovação",
    responsavel: "Juliana Alves",
    prazo: "14 out. 2026 · 17h30",
    slaDetalhe: "Concluída às 10h45",
    prioridade: "Normal",
    status: "Concluída",
  },
];

export default function TarefasPage() {
  const { logado, carregando, logout } = useAuth();
  const router = useRouter();

  const [tarefas, setTarefas] = useState<TarefaItem[]>(() => {
    if (typeof window === "undefined") return TAREFAS_INICIAIS;
    const salvas = localStorage.getItem(CHAVE_TAREFAS);
    if (salvas) {
      return JSON.parse(salvas);
    }
    localStorage.setItem(CHAVE_TAREFAS, JSON.stringify(TAREFAS_INICIAIS));
    return TAREFAS_INICIAIS;
  });

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroPrioridade, setFiltroPrioridade] = useState("todas");
  const [abaAtiva, setAbaAtiva] = useState<"todas" | StatusTarefa>("todas");

  useEffect(() => {
    if (!carregando && !logado) {
      router.replace("/login");
    }
  }, [carregando, logado, router]);

  function salvarTarefas(novaLista: TarefaItem[]) {
    setTarefas(novaLista);
    localStorage.setItem(CHAVE_TAREFAS, JSON.stringify(novaLista));
  }

  function alternarConcluida(id: string) {
    const atualizadas = tarefas.map((t) => {
      if (t.id !== id) return t;
      const novaStatus: StatusTarefa =
        t.status === "Concluída" ? "Pendente" : "Concluída";
      return {
        ...t,
        status: novaStatus,
        slaDetalhe:
          novaStatus === "Concluída" ? "Concluída agora" : "Dentro do prazo",
      };
    });
    salvarTarefas(atualizadas);
  }

  function excluirTarefa(id: string) {
    salvarTarefas(tarefas.filter((t) => t.id !== id));
  }

  if (carregando || !logado) return null;

  const tarefasFiltradas = tarefas.filter((t) => {
    const matchBusca =
      !busca.trim() ||
      t.id.toLowerCase().includes(busca.toLowerCase()) ||
      t.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      t.responsavel.toLowerCase().includes(busca.toLowerCase());

    const matchAba = abaAtiva === "todas" || t.status === abaAtiva;
    const matchStatus = filtroStatus === "todos" || t.status === filtroStatus;
    const matchPrioridade =
      filtroPrioridade === "todas" || t.prioridade === filtroPrioridade;

    return matchBusca && matchAba && matchStatus && matchPrioridade;
  });

  const pendentesCount = tarefas.filter((t) => t.status === "Pendente").length;
  const transitoCount = tarefas.filter(
    (t) => t.status === "Em Trânsito",
  ).length;
  const concluidasCount = tarefas.filter(
    (t) => t.status === "Concluída",
  ).length;

  return (
    <div className="flex min-h-screen bg-[#F8F9F8] text-neutral-900">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col justify-between bg-[#153123] px-4 py-5 text-white md:flex">
        <div>
          <div className="px-2">
            <Logo pequeno escuro />
            <p className="mt-1.5 text-[10px] tracking-wider text-emerald-200/75">
              GOVERNANÇA LOGÍSTICA CORPORATIVA
            </p>
          </div>

          <p className="mt-7 px-2 text-[11px] font-semibold tracking-wider text-emerald-200/60">
            PRINCIPAL
          </p>

          <nav className="mt-2 space-y-1 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-emerald-100/80 hover:bg-white/5"
            >
              <span>▦</span>
              <span>Dashboard</span>
            </Link>
            <Link
              href="/tarefas"
              className="flex items-center justify-between rounded-lg bg-[#244B38] px-3 py-2 font-medium text-white"
            >
              <span className="flex items-center gap-2.5">
                <span>☰</span>
                <span>Tarefas</span>
              </span>
              <span className="rounded bg-[#2A5842] px-1.5 py-0.5 text-xs">
                {pendentesCount}
              </span>
            </Link>
            <Link
              href="/unidades"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-emerald-100/80 hover:bg-white/5"
            >
              <span>🏢</span>
              <span>Unidades</span>
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

      {/* Conteúdo */}
      <main className="flex-1 space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Gestão de Tarefas Logísticas</h1>
            <p className="text-sm text-neutral-500">
              Organize as demandas da operação e acompanhe responsáveis,
              prioridades e prazos.
            </p>
          </div>

          <Link
            href="/tarefas/nova"
            className="rounded-lg bg-[#234E39] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#183728]"
          >
            + Cadastrar Nova Tarefa
          </Link>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600">
              ID / Código da tarefa
            </label>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por ID ou código..."
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600">
              Status
            </label>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm"
            >
              <option value="todos">Todos os status</option>
              <option value="Pendente">Pendente</option>
              <option value="Em Trânsito">Em Trânsito</option>
              <option value="Concluída">Concluída</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600">
              Prioridade
            </label>
            <select
              value={filtroPrioridade}
              onChange={(e) => setFiltroPrioridade(e.target.value)}
              className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm"
            >
              <option value="todas">Todas as prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Normal">Normal</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600">
              Data
            </label>
            <div className="mt-1 rounded-lg border bg-[#F8F9F8] px-3 py-2 text-sm text-neutral-600">
              Todos os períodos
            </div>
          </div>
        </div>

        {/* Abas */}
        <div className="flex flex-wrap gap-4 border-b text-sm">
          <button
            type="button"
            onClick={() => setAbaAtiva("todas")}
            className={`pb-2 font-medium ${
              abaAtiva === "todas"
                ? "border-b-2 border-[#234E39] text-[#234E39]"
                : "text-neutral-500"
            }`}
          >
            Todas as tarefas ({tarefas.length})
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("Pendente")}
            className={`pb-2 font-medium ${
              abaAtiva === "Pendente"
                ? "border-b-2 border-[#234E39] text-[#234E39]"
                : "text-neutral-500"
            }`}
          >
            Pendente ({pendentesCount})
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("Em Trânsito")}
            className={`pb-2 font-medium ${
              abaAtiva === "Em Trânsito"
                ? "border-b-2 border-[#234E39] text-[#234E39]"
                : "text-neutral-500"
            }`}
          >
            Em Trânsito ({transitoCount})
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("Concluída")}
            className={`pb-2 font-medium ${
              abaAtiva === "Concluída"
                ? "border-b-2 border-[#234E39] text-[#234E39]"
                : "text-neutral-500"
            }`}
          >
            Concluída ({concluidasCount})
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="bg-[#153123] text-[11px] uppercase text-white">
              <tr>
                <th className="px-4 py-3">ID da Tarefa</th>
                <th className="px-4 py-3">Descrição / Título da Tarefa</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Responsável</th>
                <th className="px-4 py-3">Prazo / SLA</th>
                <th className="px-4 py-3">Prioridade</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tarefasFiltradas.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3.5 font-bold text-[#234E39]">
                    {t.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-neutral-900">{t.titulo}</p>
                    <p className="text-[11px] text-neutral-500">
                      {t.subtitulo}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-neutral-600">
                    {t.categoria}
                  </td>
                  <td className="px-4 py-3.5 font-medium">{t.responsavel}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium">{t.prazo}</p>
                    <p className="text-[11px] text-amber-700">{t.slaDetalhe}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-md bg-neutral-100 px-2.5 py-1 font-medium">
                      • {t.prioridade}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 space-x-2">
                    <button
                      type="button"
                      onClick={() => alternarConcluida(t.id)}
                      title="Marcar concluída"
                      className="rounded border px-2 py-1 text-emerald-700 hover:bg-emerald-50"
                    >
                      ✓
                    </button>
                    <button
                      type="button"
                      onClick={() => excluirTarefa(t.id)}
                      title="Excluir tarefa"
                      className="rounded border px-2 py-1 text-red-600 hover:bg-red-50"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
