/** @format */

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/logo";

const FLUXO_HORARIO = [
  { hora: "06h", entrando: 8, saindo: 4 },
  { hora: "07h", entrando: 10, saindo: 6 },
  { hora: "08h", entrando: 14, saindo: 9 },
  { hora: "09h", entrando: 12, saindo: 12 },
  { hora: "10h", entrando: 10, saindo: 17 },
];

export default function DetalheUnidadePage() {
  const params = useParams<{ id: string }>();
  const id = (params?.id || "HUB-01-SP").toUpperCase();

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
      </aside>

      <main className="flex-1 space-y-5 p-6">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <Link
            href="/unidades"
            className="font-medium text-neutral-700 hover:underline"
          >
            ← Voltar para Unidades
          </Link>
          <span>Unidades / Detalhamento da Unidade Logística</span>
        </div>

        {/* Banner Verde */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#153123] p-6 text-white">
          <div>
            <p className="text-xs text-emerald-200/80">
              {id} · Sudeste · São Paulo/SP
            </p>
            <div className="mt-1 flex items-center gap-3">
              <h1 className="text-2xl font-bold">Hub Central - SP</h1>
              <span className="rounded-full bg-[#244B38] px-2.5 py-0.5 text-xs text-emerald-200">
                • Operacional
              </span>
            </div>
            <p className="mt-2 text-xs text-emerald-100/75">
              Av. Eng. Billings, 1.200 · Jaguaré, São Paulo/SP · 05321-010
            </p>
          </div>

          <div className="text-right text-xs text-emerald-100/75">
            <Link
              href="/unidades"
              className="inline-block rounded-lg bg-[#244B38] px-4 py-2 font-semibold text-white hover:bg-[#2d5b49]"
            >
              ✎ Editar Unidade
            </Link>
            <p className="mt-2">CNPJ 12.345.678/0001-90 · Operação 24 horas</p>
          </div>
        </div>

        {/* 4 KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-neutral-500">Capacidade Utilizada</p>
            <p className="mt-2 text-3xl font-bold">85%</p>
            <p className="mt-1 text-xs text-neutral-500">25.500 / 30.000 m³</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-neutral-500">
              Entregas Despachadas Hoje
            </p>
            <p className="mt-2 text-3xl font-bold">48</p>
            <p className="mt-1 text-xs text-neutral-500">
              Meta diária: 80 entregas
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-neutral-500">
              Frota Disponível no Pátio
            </p>
            <p className="mt-2 text-3xl font-bold">08</p>
            <p className="mt-1 text-xs text-neutral-500">
              De 24 veículos alocados
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-neutral-500">Nível de SLA da Filial</p>
            <p className="mt-2 text-3xl font-bold">98,6%</p>
            <p className="mt-1 text-xs text-emerald-700">
              +0,6 p.p. acima da meta de 98%
            </p>
          </div>
        </div>

        {/* Movimentação + Gerente */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="rounded-xl border bg-white p-5 lg:col-span-7">
            <h2 className="font-semibold">Movimentação de cargas</h2>
            <p className="text-xs text-neutral-500">
              Fluxo por horário · 54 entradas e 48 saídas hoje
            </p>

            <div className="mt-6 flex h-44 items-end justify-around gap-3 border-b pb-2">
              {FLUXO_HORARIO.map((f) => (
                <div key={f.hora} className="flex flex-col items-center">
                  <div className="flex items-end gap-1">
                    <span className="text-[10px] text-neutral-500">
                      {f.entrando}
                    </span>
                    <div
                      style={{ height: `${f.entrando * 6}px` }}
                      className="w-4 rounded-t bg-emerald-200"
                    />
                    <div
                      style={{ height: `${f.saindo * 6}px` }}
                      className="w-4 rounded-t bg-[#234E39]"
                    />
                    <span className="text-[10px] font-semibold">
                      {f.saindo}
                    </span>
                  </div>
                  <span className="mt-2 text-xs text-neutral-500">
                    {f.hora}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border bg-white p-5 lg:col-span-5">
            <h2 className="font-semibold">Gerente responsável</h2>
            <div>
              <p className="text-sm font-bold">Rafael Lima</p>
              <p className="text-xs text-neutral-500">
                Gerente de operações · {id}
              </p>
              <p className="mt-2 text-xs text-neutral-600">(11) 99845-2210</p>
              <p className="text-xs text-neutral-600">
                rafael.lima@logmagna.com.br
              </p>
            </div>

            <div className="border-t pt-3">
              <p className="text-xs font-semibold">Equipe de plantão</p>
              <ul className="mt-2 space-y-1.5 text-xs text-neutral-600">
                <li>• Carla Mendes — Líder de operação · 14 operadores</li>
                <li>• Diego Santos — Conferência · 6 conferentes</li>
                <li>• Ana Paula — Apoio e gestão · 4 profissionais</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
