import { motion } from "framer-motion";
import { addDays, toKey, TODAY, type Task } from "@/lib/productivity-data";

const WD = ["S", "M", "T", "W", "T", "F", "S"];

export function HorizonStrip({
  tasks,
  active,
  onSelect,
}: {
  tasks: Task[];
  active: string;
  onSelect: (key: string) => void;
}) {
  const days = Array.from({ length: 15 }, (_, i) => addDays(TODAY, i - 7));

  return (
    <div className="card-surface p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="num text-[11px] uppercase tracking-[0.18em] text-ink-mute">
          Sprint horizon · 15d
        </span>
        <span className="num text-[11px] text-ink-mute">
          {toKey(days[0])} → {toKey(days[14])}
        </span>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {days.map((d) => {
          const key = toKey(d);
          const dayTasks = tasks.filter((t) => t.date === key);
          const done = dayTasks.filter((t) => t.done).length;
          const pct = dayTasks.length ? done / dayTasks.length : 0;
          const isActive = key === active;
          const isToday = key === toKey(TODAY);
          return (
            <motion.button
              key={key}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(key)}
              className={`squircle relative flex h-[68px] min-w-[52px] flex-1 flex-col items-center justify-center gap-1 border transition-colors ${
                isActive
                  ? "border-ink bg-ink text-primary-foreground"
                  : "border-hairline bg-surface text-ink hover:bg-accent"
              }`}
            >
              <span
                className={`num text-[10px] uppercase ${isActive ? "opacity-70" : "text-ink-mute"}`}
              >
                {WD[d.getDay()]}
              </span>
              <span className="num text-base font-semibold">{d.getDate()}</span>
              <span className="h-1 w-6 overflow-hidden rounded-full bg-pixel-empty">
                <motion.span
                  className={`block h-full ${isActive ? "bg-primary-foreground" : "bg-ink"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </span>
              {isToday && !isActive && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-ink" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}