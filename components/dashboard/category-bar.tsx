"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TOOLTIP_STYLE = {
  background: "#0f1521",
  border: "1px solid #1e2738",
  borderRadius: 8,
  color: "#f5efe1",
  fontSize: 12,
} as const;

export interface CategoryBarRow {
  label: string;
  count: number;
  /** Full category name — shown in the tooltip when the axis label is shortened. */
  fullLabel?: string;
}

export function CategoryBar({ data }: { data: CategoryBarRow[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) return <div className="h-72" aria-hidden />;

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
        >
          <CartesianGrid horizontal={false} stroke="#1e2738" />
          <XAxis
            type="number"
            stroke="#6c7689"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            stroke="#a7aebc"
            fontSize={12}
            width={140}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(245,239,225,0.04)" }}
            contentStyle={TOOLTIP_STYLE}
            itemStyle={{ color: "#f5efe1" }}
            labelFormatter={(_label, payload) => {
              const row = payload?.[0]?.payload as CategoryBarRow | undefined;
              return row?.fullLabel ?? row?.label ?? _label;
            }}
            formatter={(value) => [`${value} questions`, "Volume"]}
          />
          <Bar dataKey="count" fill="#c9a45c" radius={[0, 4, 4, 0]} maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
