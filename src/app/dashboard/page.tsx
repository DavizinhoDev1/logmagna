/** @format */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/logo";
import { useAuth } from "@/context/AuthContext";

type StatusCarga =
  | "Risco de SLA"
  | "Documentação"
  | "Monitoramento"
  | "No prazo";

interface AlertaItem {
  id: string;
  rota: string;
  descricao: string;
  horario: string;
  badge: "Risco de SLA" | "Documentação" | "Monitoramento";
}

interface CargaItem {
  codigo: string;
  origem: string;
  destino: string;
  transportadora: string;
  dataPrevisao: string;
  horaPrevisao: string;
  status: StatusCarga;
  responsavel: string;
}

const DADOS_GRAFICO = [
  { dia: "07 out.", previsto: 80, realizado: 78 },
  { dia: "08 out.", previsto: 90, realizado: 88 },
  { dia: "09 out.", previsto: 96, realizado: 93 },
  { dia: "10 out.", previsto: 84, realizado: 87 },
  { dia: "11 out.", previsto: 103, realizado: 99 },
  { dia: "12 out.", previsto: 110, realizado: 108 },
  { dia: "13 out.", previsto: 99, realizado: 96 },
];

const ALERTAS_CRITICOS: AlertaItem[] = [
  {
    id: "CRG-0842",
    rota: "São Paulo → Curitiba",
    descricao: "Atraso de 45 min · trânsito na BR-116",
    horario: "Entrega às 14h30",
    badge: "Risco de SLA",
  },
  {
    id: "CRG-0819",
    rota: "Campinas → Rio de Janeiro",
    descricao: "Comprovante de entrega pendente",
    horario: "Há 2 horas",
    badge: "Documentação",
  },
  {
    id: "CRG-0856",
    rota: "São Paulo → Belo Horizonte",
    descricao: "Carga prioritária · janela confirmada",
    horario: "Entrega às 16h00",
    badge: "Monitoramento",
  },
];

const CARGAS_ACOMPANHAMENTO: CargaItem[] = [
  {
    codigo: "CRG-0842",
    origem: "São Paulo, SP",
    destino: "Curitiba, PR",
    transportadora: "TransSul Logística",
    dataPrevisao: "13 out. 2026",
    horaPrevisao: "14h30",
    status: "Risco de SLA",
    responsavel: "Rafael Lima",
  },
  {
    codigo: "CRG-0856",
    origem: "São Paulo, SP",
    destino: "Belo Horizonte, MG",
    transportadora: "ViaMinas Transportes",
    dataPrevisao: "13 out. 2026",
    horaPrevisao: "16h00",
    status: "Monitoramento",
    responsavel: "Ana Ribeiro",
  },
  {
    codigo: "CRG-0861",
    origem: "Campinas, SP",
    destino: "Ribeirão Preto, SP",
    transportadora: "Expresso Paulista",
    dataPrevisao: "13 out. 2026",
    horaPrevisao: "17h15",
    status: "No prazo",
    responsavel: "Lucas Santos",
  },
];

function estiloBadge(status: StatusCarga) {
  switch (status) {
    case "Risco de SLA":
      return "bg-[#FDECE8] text-[#B84A27] border-[#F6CFC5]";
    case "Documentação":
      return "bg-[#FEF6E6] text-[#A86A14] border-[#F8E2B4]";
    case "Monitoramento":
      return "bg-[#F2F5E8] text-[#4E6B24] border-[#DCE5C2]";
    case "No prazo":
      return "bg-[#E9F5EE] text-[#1E6B43] border-[#C5E5D3]";
  }
}

export default function DashboardPage() {
  const { logado, carregando, logout } = useAuth();
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [periodo, setPeriodo] = useState<"Diário" | "Semanal">("Diário");
  const [unidade, setUnidade] = useState("São Paulo · Matriz");

  useEffect(() => {
    if (!carregando && !logado) {
      router.replace("/login");
    }
  }, [carregando, logado, router]);

  if (carregando || !logado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9F8] text-sm text-neutral-600">
        Verificando sessão...
      </div>
    );
  }

  const cargasFiltradas = CARGAS_ACOMPANHAMENTO.filter((c) => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return true;
    return (
      c.codigo.toLowerCase().includes(termo) ||
      c.origem.toLowerCase().includes(termo) ||
      c.destino.toLowerCase().includes(termo) ||
      c.transportadora.toLowerCase().includes(termo) ||
      c.responsavel.toLowerCase().includes(termo)
    );
  });

  const maxValorGrafico = 120;

  return (
    <div className="flex min-h-screen bg-[#F8F9F8] text-neutral-900">
      {/* Sidebar Esquerda */}
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
              className="flex w-full items-center gap-2.5 rounded-lg bg-[#244B38] px-3 py-2 font-medium text-white"
            >
              <span>▦</span>
              <span>Dashboard</span>
            </Link>

            <Link
              href="/tarefas"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-emerald-100/80 transition hover:bg-white/5"
            >
              <span className="flex items-center gap-2.5">
                <span>☰</span>
                <span>Tarefas</span>
              </span>
              <span className="rounded bg-[#2A5842] px-1.5 py-0.5 text-xs font-medium text-emerald-100">
                18
              </span>
            </Link>

            <Link
              href="/unidades"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-emerald-100/80 transition hover:bg-white/5"
            >
              <span>🏢</span>
              <span>Unidades</span>
            </Link>

            <button
              type="button"
              onClick={() => alert("Tela de Cargas em construção")}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-emerald-100/80 transition hover:bg-white/5"
            >
              <span>🚚</span>
              <span>Cargas</span>
            </button>

            <button
              type="button"
              onClick={() => alert("Tela de Relatórios em construção")}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-emerald-100/80 transition hover:bg-white/5"
            >
              <span>📈</span>
              <span>Relatórios</span>
            </button>
          </nav>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-[#1D3E2E] p-3">
            <p className="text-xs font-semibold text-white">
              🛡 Ambiente corporativo
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-emerald-100/70">
              Dados integrados. Decisões seguras.
            </p>
          </div>

          <button
            type="button"
            className="flex w-full items-center gap-2 px-2 text-xs text-emerald-100/80 hover:text-white"
          >
            <span>?</span>
            <span>Central de ajuda</span>
          </button>

          <div className="flex items-center justify-between border-t border-white/10 pt-3 px-2 text-[11px] text-emerald-200/60">
            <span>LogMagna © 2026 · v2.4</span>
            <button
              type="button"
              onClick={logout}
              className="text-emerald-200 hover:underline"
            >
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200/80 bg-white px-6 py-3">
          <div className="flex w-full max-w-md items-center justify-between rounded-lg border border-neutral-200 bg-[#F8F9F8] px-3 py-2 text-sm">
            <div className="flex flex-1 items-center gap-2">
              <span className="text-neutral-400">🔍</span>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar cargas, tarefas ou documentos..."
                className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
            <span className="ml-2 rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[11px] text-neutral-400">
              ⌘ K
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                UNIDADE / FILIAL
              </p>
              <select
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="bg-transparent text-xs font-semibold text-neutral-800 focus:outline-none"
              >
                <option>São Paulo · Matriz</option>
                <option>Campinas · Filial SP</option>
                <option>Curitiba · Filial PR</option>
              </select>
            </div>

            <button
              type="button"
              aria-label="Notificações"
              className="relative rounded-lg p-2 text-neutral-600 hover:bg-neutral-100"
            >
              <span>🔔</span>
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-600" />
            </button>

            <div className="flex items-center gap-2.5 border-l border-neutral-200 pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#26533D] text-xs font-semibold text-white">
                MC
              </div>
              <div className="hidden text-left lg:block">
                <p className="text-xs font-semibold text-neutral-900">
                  Marina Costa
                </p>
                <p className="text-[11px] text-neutral-500">
                  Gestora de logística
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 space-y-5 p-6">
          {/* Cabeçalho da página */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                Dashboard
              </h1>
              <p className="text-sm text-neutral-500">
                Sua operação, conectada e sob controle. Veja os indicadores da
                sua unidade.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-700">
                📅 01–13 out. 2026
              </div>
              <button
                type="button"
                className="rounded-lg bg-[#234E39] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#193A2A]"
              >
                ↓ Exportar relatório
              </button>
            </div>
          </div>

          {/* 4 Cards de KPIs */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-neutral-200/90 bg-white p-5">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Total de Cargas em Trânsito</span>
                <span>🚚</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-neutral-900">248</p>
              <p className="mt-2 text-xs text-neutral-500">
                <span className="font-semibold text-emerald-700">+12,7%</span>{" "}
                vs. semana anterior
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200/90 bg-white p-5">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Entregas no Prazo (SLA %)</span>
                <span>✓</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-neutral-900">96,8%</p>
              <p className="mt-2 text-xs text-neutral-500">
                <span className="font-semibold text-emerald-700">
                  +1,4 p.p.
                </span>{" "}
                meta de 95,0%
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200/90 bg-white p-5">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Custos do Mês</span>
                <span>👛</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-neutral-900">
                R$ 842.560
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                <span className="font-semibold text-emerald-700">-4,2%</span>{" "}
                vs. orçamento mensal
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200/90 bg-white p-5">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Tarefas Pendentes</span>
                <span>📋</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-neutral-900">18</p>
              <p className="mt-2 text-xs text-neutral-500">
                <span className="font-semibold text-amber-700">
                  5 prioritárias
                </span>{" "}
                exigem atenção hoje
              </p>
            </div>
          </section>

          {/* Gráfico + Alertas Críticos */}
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Previsto vs Realizado */}
            <div className="flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-white p-5 lg:col-span-7">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-neutral-900">
                      Previsto vs Realizado
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Entregas por dia · 07–13 out. 2026
                    </p>
                  </div>

                  <select
                    value={periodo}
                    onChange={(e) =>
                      setPeriodo(e.target.value as "Diário" | "Semanal")
                    }
                    className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700"
                  >
                    <option value="Diário">Diário</option>
                    <option value="Semanal">Semanal</option>
                  </select>
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-neutral-600">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-xs bg-neutral-200" />
                    Previsto
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-xs bg-[#234E39]" />
                    Realizado
                  </span>
                </div>

                {/* Barras */}
                <div className="mt-6 grid grid-cols-12 gap-2">
                  <div className="col-span-1 flex h-44 flex-col justify-between text-[11px] text-neutral-400">
                    <span>120</span>
                    <span>80</span>
                    <span>40</span>
                    <span>0</span>
                  </div>

                  <div className="col-span-11 flex h-44 items-end justify-between gap-2 border-b border-neutral-100 pb-2">
                    {DADOS_GRAFICO.map((item) => {
                      const fator = periodo === "Semanal" ? 0.92 : 1;
                      const hPrev = Math.min(
                        100,
                        Math.round(
                          ((item.previsto * fator) / maxValorGrafico) * 100,
                        ),
                      );
                      const hReal = Math.min(
                        100,
                        Math.round(
                          ((item.realizado * fator) / maxValorGrafico) * 100,
                        ),
                      );

                      return (
                        <div
                          key={item.dia}
                          className="flex h-full flex-1 flex-col items-center justify-end"
                        >
                          <div className="flex h-36 w-full items-end justify-center gap-1">
                            <div
                              style={{ height: `${hPrev}%` }}
                              title={`Previsto: ${item.previsto}`}
                              className="w-3 rounded-t-sm bg-neutral-200/90 transition-all"
                            />
                            <div
                              style={{ height: `${hReal}%` }}
                              title={`Realizado: ${item.realizado}`}
                              className="w-3 rounded-t-sm bg-[#234E39] transition-all"
                            />
                          </div>
                          <span className="mt-2 text-[11px] text-neutral-500">
                            {item.dia}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-3 text-xs">
                <span className="text-neutral-500">
                  646 entregas realizadas de 664 previstas
                </span>
                <span className="font-semibold text-neutral-900">
                  97,3% de aderência
                </span>
              </div>
            </div>

            {/* Alertas e Entregas Críticas */}
            <div className="flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-white p-5 lg:col-span-5">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-neutral-900">
                    Alertas e Entregas Críticas
                  </h2>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-700">
                    3
                  </span>
                </div>

                <div className="mt-4 divide-y divide-neutral-100">
                  {ALERTAS_CRITICOS.map((alerta) => (
                    <div key={alerta.id} className="py-3.5 first:pt-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-neutral-900">
                          {alerta.id}
                        </span>
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${estiloBadge(
                            alerta.badge,
                          )}`}
                        >
                          {alerta.badge}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-neutral-800">
                        {alerta.rota}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {alerta.descricao}
                      </p>
                      <p className="mt-1.5 text-[11px] text-neutral-400">
                        🕒 {alerta.horario}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="mt-2 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs font-semibold text-neutral-800 hover:text-[#234E39]"
              >
                <span>Ver todos os alertas</span>
                <span>→</span>
              </button>
            </div>
          </section>

          {/* Tabela Inferior: Cargas em acompanhamento */}
          <section className="rounded-xl border border-neutral-200/90 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-baseline gap-2.5">
                <h2 className="text-base font-semibold text-neutral-900">
                  Cargas em acompanhamento
                </h2>
                <span className="text-xs text-neutral-400">
                  Próximas entregas de hoje
                </span>
              </div>

              <button
                type="button"
                className="text-xs font-semibold text-neutral-800 hover:text-[#234E39]"
              >
                Ver todas as cargas →
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                    <th className="py-3 pr-4">CARGA</th>
                    <th className="py-3 px-4">ORIGEM → DESTINO</th>
                    <th className="py-3 px-4">TRANSPORTADORA</th>
                    <th className="py-3 px-4">PREVISÃO</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 pl-4">RESPONSÁVEL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {cargasFiltradas.map((carga) => (
                    <tr
                      key={carga.codigo}
                      className="transition hover:bg-neutral-50/70"
                    >
                      <td className="py-3.5 pr-4 font-bold text-[#234E39]">
                        {carga.codigo}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-neutral-500">{carga.origem}</p>
                        <p className="font-semibold text-neutral-900">
                          ↳ {carga.destino}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-neutral-800">
                        {carga.transportadora}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-neutral-800">
                          {carga.dataPrevisao}
                        </p>
                        <p className="text-neutral-400">{carga.horaPrevisao}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block rounded-md border px-2.5 py-1 text-[11px] font-medium ${estiloBadge(
                            carga.status,
                          )}`}
                        >
                          {carga.status}
                        </span>
                      </td>
                      <td className="py-3.5 pl-4">
                        <div className="flex items-center justify-between text-neutral-800">
                          <span>{carga.responsavel}</span>
                          <span className="text-neutral-400">›</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Rodapé do sistema */}
          <footer className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Dados sincronizados há 2 min · Integração TMS / ERP ativa
            </span>
            <span>Última atualização: 13 out. 2026, 10h42</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
