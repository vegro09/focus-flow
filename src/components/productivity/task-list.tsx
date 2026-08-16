import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, GripVertical, Plus } from "lucide-react";
import type { Category, Task } from "@/lib/productivity-data";

const FILTERS = ["All", "High Priority", "Projects", "Routine"] as const;
type Filter = (typeof FILTERS)[number];

const CATEGORIES: Category[] = ["Projects", "Deep Work", "Routine", "Admin"];

export function TaskList({
  tasks,
  onToggle,
  onAdd,
  onReorder,
  zen,
}: {
  tasks: Task[];
  onToggle: (id: string) => void;
  onAdd: (title: string, weight: 1 | 2 | 3, category: Category) => void;
  onReorder: (fromId: string, toId: string) => void;
  zen: boolean;
}) {
  const [filter, setFilter] = useState<Filter>("All");
  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<Category>("Projects");
  const [dragId, setDragId] = useState<string | null>(null);

  const visible = tasks.filter((t) => {
    if (filter === "High Priority") return t.weight === 3;
    if (filter === "Projects") return t.category === "Projects" || t.category === "Deep Work";
    if (filter === "Routine") return t.category === "Routine" || t.category === "Admin";
    return true;
  });

  const shown = zen ? visible.filter((t) => !t.done).slice(0, 1) : visible;

  return (
    <div className="space-y-4">
      {!zen && (
        <>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  filter === f
                    ? "border-ink bg-ink text-primary-foreground"
                    : "border-hairline bg-surface text-ink-soft hover:bg-accent"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim()) return;
              onAdd(title.trim(), weight, category);
              setTitle("");
            }}
            className="card-surface flex flex-col gap-2 p-2 sm:flex-row sm:items-center"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a task…"
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-ink outline-none placeholder:text-ink-mute"
            />
            <div className="flex shrink-0 items-center gap-1.5">
              <div className="flex overflow-hidden rounded-full border border-hairline">
                {([1, 2, 3] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeight(w)}
                    className={`num px-2.5 py-1 text-[11px] transition-colors ${
                      weight === w ? "bg-ink text-primary-foreground" : "text-ink-mute hover:bg-accent"
                    }`}
                  >
                    {w}x
                  </button>
                ))}
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="rounded-full border border-hairline bg-surface px-2.5 py-1.5 text-[11px] text-ink-soft outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-primary-foreground transition-transform hover:scale-105"
                aria-label="Add task"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </form>
        </>
      )}

      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {shown.map((task) => (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              draggable={!zen}
              onDragStart={() => setDragId(task.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId && dragId !== task.id) onReorder(dragId, task.id);
                setDragId(null);
              }}
              className={`card-surface group flex items-center gap-3 px-3 py-3 ${
                zen ? "px-6 py-8" : ""
              } ${dragId === task.id ? "opacity-50" : ""}`}
            >
              {!zen && (
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-pixel-empty transition-colors group-hover:text-ink-mute" />
              )}
              <button
                onClick={() => onToggle(task.id)}
                aria-label={task.done ? "Mark incomplete" : "Mark complete"}
                className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border transition-colors ${
                  task.done ? "border-ink bg-ink" : "border-hairline bg-surface hover:border-ink-mute"
                }`}
              >
                <AnimatePresence>
                  {task.done && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 24 }}
                    >
                      <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <div className="min-w-0 flex-1">
                <div className="relative inline-block max-w-full">
                  <span
                    className={`block truncate text-sm transition-colors ${
                      zen ? "text-lg font-semibold" : ""
                    } ${task.done ? "text-ink-mute" : "text-ink"}`}
                  >
                    {task.title}
                  </span>
                  <motion.span
                    className="absolute left-0 top-1/2 h-px bg-ink-mute"
                    initial={false}
                    animate={{ width: task.done ? "100%" : "0%" }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-soft">
                    {task.category}
                  </span>
                  <span className="num flex items-center gap-1 text-[11px] text-ink-mute">
                    <Clock className="h-3 w-3" /> {task.minutes}m
                  </span>
                  <span className="num text-[11px] text-ink-mute">{task.weight}x weight</span>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {shown.length === 0 && (
        <p className="card-surface px-4 py-10 text-center text-sm text-ink-mute">
          Nothing here. A clear board is a good board.
        </p>
      )}
    </div>
  );
}