import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Focus, Square } from "lucide-react";
import {
  INITIAL_RATINGS,
  INITIAL_TASKS,
  TODAY,
  WEIGHT_TARGET,
  momentumSeries,
  toKey,
  weightOf,
  type Category,
  type DayRating,
  type Task,
} from "@/lib/productivity-data";
import { HorizonStrip } from "@/components/productivity/horizon-strip";
import { TaskList } from "@/components/productivity/task-list";
import { MomentumCard } from "@/components/productivity/momentum-card";
import { RatingRitual } from "@/components/productivity/rating-ritual";
import { MiniCalendar } from "@/components/productivity/mini-calendar";

const TITLE = "Terminal — Daily Task & Momentum Tracker";
const DESC =
  "A minimalist bento-grid productivity terminal: 15-day sprint horizon, weighted task ribbons, momentum ticker and month-in-pixels day ratings.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Index,
});

function Index() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [ratings, setRatings] = useState<DayRating[]>(INITIAL_RATINGS);
  const [active, setActive] = useState(toKey(TODAY));
  const [zen, setZen] = useState(false);

  const dayTasks = tasks.filter((t) => t.date === active);
  const series = useMemo(() => momentumSeries(tasks), [tasks]);
  const closedWeight = weightOf(dayTasks.filter((t) => t.done));
  const velocity = useMemo(() => {
    const last = series[series.length - 1]?.closed ?? 0;
    const prev = series[series.length - 2]?.closed ?? 0;
    if (!prev) return last ? 100 : 0;
    return ((last - prev) / prev) * 100;
  }, [series]);

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const add = (title: string, weight: 1 | 2 | 3, category: Category) =>
    setTasks((prev) => [
      { id: `${Date.now()}`, title, weight, category, minutes: weight * 30, done: false, date: active },
      ...prev,
    ]);

  const reorder = (fromId: string, toId: string) =>
    setTasks((prev) => {
      const next = [...prev];
      const from = next.findIndex((t) => t.id === fromId);
      const to = next.findIndex((t) => t.id === toId);
      if (from < 0 || to < 0) return prev;
      const [moved] = next.splice(from, 1);
      if (moved) next.splice(to, 0, moved);
      return next;
    });

  const rate = (rating: 1 | 2 | 3 | 4 | 5, note: string) =>
    setRatings((prev) => {
      const key = toKey(TODAY);
      const completed = tasks.filter((t) => t.date === key && t.done).length;
      const entry: DayRating = { date: key, rating, note: note || undefined, completed };
      return prev.some((r) => r.date === key)
        ? prev.map((r) => (r.date === key ? entry : r))
        : [...prev, entry];
    });

  const activeDate = new Date(`${active}T00:00:00`);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink">
              <Square className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold tracking-tight text-ink">Terminal</h1>
              <p className="num truncate text-[11px] text-ink-mute">
                {activeDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setZen((z) => !z)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                zen
                  ? "border-ink bg-ink text-primary-foreground"
                  : "border-hairline bg-surface text-ink-soft hover:bg-accent"
              }`}
            >
              <Focus className="h-3.5 w-3.5" /> Zen Focus
            </button>
            <span className="num grid h-9 w-9 place-items-center rounded-full border border-hairline bg-surface text-[11px] font-semibold text-ink">
              KG
            </span>
          </div>
        </header>

        {!zen && <HorizonStrip tasks={tasks} active={active} onSelect={setActive} />}

        <motion.div
          layout
          className={
            zen
              ? "mx-auto max-w-2xl pt-10"
              : "grid grid-cols-1 gap-5 lg:grid-cols-[65fr_35fr] lg:items-start"
          }
        >
          <motion.div layout className="min-w-0">
            <TaskList tasks={dayTasks} onToggle={toggle} onAdd={add} onReorder={reorder} zen={zen} />
          </motion.div>

          {!zen && (
            <div className="min-w-0 space-y-5">
              <MomentumCard
                series={series}
                velocity={velocity}
                closedWeight={closedWeight}
                target={WEIGHT_TARGET}
              />
              <RatingRitual ratings={ratings} tasks={tasks} onRate={rate} />
              <MiniCalendar tasks={tasks} active={active} onSelect={setActive} />
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}