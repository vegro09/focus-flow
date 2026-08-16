import { Area, AreaChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function MomentumCard({
  series,
  velocity,
  closedWeight,
  target,
}: {
  series: { label: string; closed: number; avg: number }[];
  velocity: number;
  closedWeight: number;
  target: number;
}) {
  const up = velocity >= 0;
  return (
    <section className="card-surface p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="num text-[11px] uppercase tracking-[0.18em] text-ink-mute">
            Productivity ticker
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="num text-2xl font-semibold text-ink">
              {up ? "+" : ""}
              {velocity.toFixed(1)}%
            </span>
            <span className="text-xs text-ink-mute">Velocity</span>
          </div>
        </div>
        <span
          className="num flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
          style={{
            color: up ? "#10B981" : "#EF4444",
            backgroundColor: up ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
          }}
        >
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          7D
        </span>
      </div>

      <div className="mt-3 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="mom" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#111111" stopOpacity={0.16} />
                <stop offset="100%" stopColor="#111111" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#737373", fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E8E8E3",
                fontSize: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              labelFormatter={(l) => `Day ${l}`}
            />
            <Area
              type="monotone"
              dataKey="closed"
              name="Closed weight"
              stroke="#111111"
              strokeWidth={2}
              fill="url(#mom)"
            />
            <Line
              type="monotone"
              dataKey="avg"
              name="3D avg"
              stroke="#737373"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-between rounded-full bg-secondary px-3 py-2">
        <span className="text-[11px] text-ink-soft">Closed weight vs target</span>
        <span className="num text-[11px] font-semibold text-ink">
          {closedWeight} / {target}
        </span>
      </div>
    </section>
  );
}