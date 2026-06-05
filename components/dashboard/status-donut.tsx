"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { STATUS_HEX } from "@/components/status-badge";
import type { AnswerStatus } from "@/lib/types";

const TOOLTIP_STYLE = {
  background: "#0f1521",
  border: "1px solid #1e2738",
  borderRadius: 8,
  color: "#f5efe1",
  fontSize: 12,
} as const;

export function StatusDonut({
  data,
  total,
}: {
  data: { status: AnswerStatus; count: number }[];
  total: number;
}) {
  const [mounted, setMounted] = useState(false);
  // Defer the mount flag to a frame after paint so Recharts only renders on the
  // client (no layout to measure during static generation) without calling
  // setState synchronously inside the effect body.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) return <div className="h-56" aria-hidden />;

  const slices = data.filter((d) => d.count > 0);

  return (
    <div className="relative h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={slices}
            dataKey="count"
            nameKey="status"
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={2}
            stroke="none"
          >
            {slices.map((d) => (
              <Cell key={d.status} fill={STATUS_HEX[d.status]} />
            ))}
          </Pie>
          <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={{ color: "#f5efe1" }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-semibold tabular-nums text-ink">
          {total}
        </span>
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          Questions
        </span>
      </div>
    </div>
  );
}
