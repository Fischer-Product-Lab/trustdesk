"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
} from "lucide-react";
import type { AnswerStatus, EvidenceStatus, Reviewer } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { EvidenceBadge } from "@/components/evidence-badge";
import { ANSWER_STATUS_ORDER } from "@/lib/metrics";

export interface WorkspaceRow {
  questionnaireId: string;
  questionId: string;
  customer: string;
  prompt: string;
  category: string;
  score: number;
  status: AnswerStatus;
  reviewer: Reviewer;
  evidence: EvidenceStatus | "No Evidence";
  mappedCount: number;
}

type SortKey = "customer" | "category" | "score";
type SortDir = "asc" | "desc";

type Filter = AnswerStatus | "All";

const FILTERS: Filter[] = ["All", ...ANSWER_STATUS_ORDER];

export function WorkspaceTable({ rows }: { rows: WorkspaceRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = rows.filter((row) => {
      if (filter !== "All" && row.status !== filter) return false;
      if (!q) return true;
      return (
        row.prompt.toLowerCase().includes(q) ||
        row.customer.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q)
      );
    });
    filtered.sort((a, b) => {
      let cmp: number;
      if (sortKey === "score") cmp = a.score - b.score;
      else if (sortKey === "customer") cmp = a.customer.localeCompare(b.customer);
      else cmp = a.category.localeCompare(b.category);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return filtered;
  }, [rows, query, filter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "score" ? "desc" : "asc");
    }
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: "customer", label: "Customer" },
    { key: "category", label: "Category" },
    { key: "score", label: "Confidence" },
  ];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, customers, categories…"
            aria-label="Search questions"
            className="w-full rounded-lg border border-hairline bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-gold/50 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "border-gold/50 bg-gold/15 text-gold-soft"
                  : "border-hairline bg-surface text-ink-muted hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-hairline bg-surface">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-hairline">
              <th scope="col" className="px-4 py-3 text-left font-medium">
                <span className="text-xs uppercase tracking-wider text-ink-faint">
                  Question
                </span>
              </th>
              {columns.map((col) => {
                const active = col.key === sortKey;
                const SortIcon = !active
                  ? ChevronsUpDown
                  : sortDir === "asc"
                    ? ChevronUp
                    : ChevronDown;
                return (
                  <th key={col.key} scope="col" className="px-4 py-3 text-left font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={`group inline-flex items-center gap-1.5 text-xs uppercase tracking-wider transition-colors ${
                        active ? "text-ink" : "text-ink-faint hover:text-ink-muted"
                      }`}
                      aria-label={`Sort by ${col.label}`}
                    >
                      {col.label}
                      <SortIcon
                        className={`h-3.5 w-3.5 ${active ? "text-gold" : "opacity-60"}`}
                      />
                    </button>
                  </th>
                );
              })}
              <th scope="col" className="px-4 py-3 text-left font-medium">
                <span className="text-xs uppercase tracking-wider text-ink-faint">
                  Evidence
                </span>
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium">
                <span className="text-xs uppercase tracking-wider text-ink-faint">
                  Reviewer
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr
                key={row.questionId}
                onClick={() =>
                  router.push(`/questionnaires/${row.questionnaireId}#${row.questionId}`)
                }
                className="cursor-pointer border-b border-hairline/60 transition-colors last:border-0 hover:bg-surface-2"
              >
                <td className="max-w-md px-4 py-3">
                  <div className="truncate text-ink">{row.prompt}</div>
                  <div className="text-xs text-ink-faint">
                    {row.questionId} · {row.mappedCount} mapped control
                    {row.mappedCount === 1 ? "" : "s"}
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-muted">{row.customer}</td>
                <td className="px-4 py-3 text-ink-muted">{row.category}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <StatusBadge status={row.status} />
                    <span className="text-xs tabular-nums text-ink-faint">
                      {row.score}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <EvidenceBadge status={row.evidence} />
                </td>
                <td className="px-4 py-3 text-ink-muted">{row.reviewer}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibleRows.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ink-faint">
            No questions match the current filters.
          </p>
        )}
      </div>

      <p className="text-xs text-ink-faint">
        Showing {visibleRows.length} of {rows.length} questions. Click any row to
        open the drafted answer, mapped evidence, and routing reasons.
      </p>
    </div>
  );
}
