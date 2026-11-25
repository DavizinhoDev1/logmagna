/** @format */

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/logo";
import type { TarefaItem } from "../page";

export default function NovaTarefaPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("Emissão de CTe");
  const [prioridade, setPrioridade] = useState<"Baixa" | "Média" | "Alta">(
    "Média",
  );
  const [prazo, setPrazo] = useState("15 out. 2026 · 14h00");
  const [responsavel, setResponsavel] = useState("Rafael Lima");
  const [documento, setDocumento] = useState("");
  const [codigoCarga, setCodigoCarga] = useState("");
  const [origemDestino, setOrigemDestino] = useState("");
  const [instrucoes, setInstrucoes] = useState("");

  function salvar(e: FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;

    const atual = JSON.parse(
      localStorage.getItem("logmagna_tarefas") || "[]",
    ) as TarefaItem[];

    const nova: TarefaItem = {
      id: `#TRK-${Math.floor(8922 + Math.random() * 70)}`,
      titulo: titulo.trim(),
      subtitulo: `${codigoCarga || origemDestino || "Operação"} · Pendente`,
      categoria,
      responsavel,
      prazo: prazo || "A definir",
      slaDetalhe: documento ? `Doc: ${documento}` : "Dentro do prazo",
      prioridade,
      status: "Pendente",
    };

    localStorage.setItem("logmagna_tarefas", JSON.stringify([nova, ...atual]));
    router.push("/tarefas");
  }

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
              className="block rounded-lg bg-[#244B38] px-3 py-2 font-medium"
            >
              ☰ Tarefas
            </Link>
            <Link
              href="/unidades"
              className="block rounded-lg px-3 py-2 text-emerald-100/80 hover:bg-white/5"
            >
              🏢 Unidades
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 space-y-5 p-6">
        <Link
          href="/tarefas"
          className="text-xs font-medium text-neutral-600 hover:underline"
        >
          ← Voltar para Tarefas
        </Link>

        <div>
          <h1 className="text-2xl font-bold">
            Cadastrar Nova Tarefa Logística
          </h1>
          <p className="text-sm text-neutral-500">
            Centralize as informações da demanda e mantenha sua operação em
            movimento.
          </p>
        </div>

        <form onSubmit={salvar} className="space-y-5">
          {/* Informações Básicas */}
          <section className="space-y-4 rounded-xl border bg-white p-5">
            <h2 className="font-semibold">Informações Básicas</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium">
                  Título da Tarefa *
                </label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex.: Emitir CTe da carga para Curitiba"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium">Categoria *</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm"
                >
                  <option>Emissão de CTe</option>
                  <option>Liberação de Carga</option>
                  <option>Manutenção</option>
                  <option>Monitoramento</option>
                  <option>Documentação</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block text-xs font-medium">
                  Prioridade *
                </label>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {(["Baixa", "Média", "Alta"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPrioridade(p)}
                      className={`rounded-lg border py-2 text-xs font-medium ${
                        prioridade === p
                          ? "border-[#234E39] bg-emerald-50 text-[#234E39]"
                          : "text-neutral-600"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium">
                  Prazo Final / SLA *
                </label>
                <input
                  type="text"
                  value={prazo}
                  onChange={(e) => setPrazo(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium">
                  Responsável *
                </label>
                <select
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm"
                >
                  <option>Rafael Lima</option>
                  <option>Ana Ribeiro</option>
                  <option>Lucas Santos</option>
                  <option>Juliana Alves</option>
                </select>
              </div>
            </div>
          </section>

          {/* Vinculação Logística */}
          <section className="space-y-4 rounded-xl border bg-white p-5">
            <h2 className="font-semibold">Vinculação Logística</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block text-xs font-medium">
                  Número da Nota Fiscal / CTe
                </label>
                <input
                  type="text"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  placeholder="Informe o número do documento"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium">
                  Código da Carga
                </label>
                <input
                  type="text"
                  value={codigoCarga}
                  onChange={(e) => setCodigoCarga(e.target.value)}
                  placeholder="Ex.: CRG-0842"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium">
                  Unidade Origem / Destino
                </label>
                <input
                  type="text"
                  value={origemDestino}
                  onChange={(e) => setOrigemDestino(e.target.value)}
                  placeholder="Ex.: São Paulo → Curitiba"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
            </div>
          </section>

          {/* Descrição */}
          <section className="space-y-3 rounded-xl border bg-white p-5">
            <h2 className="font-semibold">Descrição e Anexos</h2>
            <textarea
              rows={3}
              value={instrucoes}
              onChange={(e) => setInstrucoes(e.target.value)}
              placeholder="Descreva o que precisa ser feito..."
              className="w-full rounded-lg border p-3 text-sm"
            />
            <div className="flex justify-end gap-3">
              <Link
                href="/tarefas"
                className="rounded-lg border px-4 py-2 text-xs font-medium"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="rounded-lg bg-[#234E39] px-5 py-2 text-xs font-semibold text-white hover:bg-[#183728]"
              >
                Salvar Tarefa
              </button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}
