import { useState } from "react";
import { motion } from "framer-motion";
import {
  RATING_COLORS,
  RATING_LABELS,
  TODAY,
  toKey,
  type DayRating,
  type Task,
} from "@/lib/productivity-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function RatingRitual({
  ratings,
  tasks,
  onRate,
}: {
  ratings: DayRating[];
  tasks: Task[];
  onRate: (rating: 1 | 2 | 3 | 4 | 5, note: string) => void;
}) {
  const [note, setNote] = useState("");
  const [pending, setPending] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const todayKey = toKey(TODAY);
  const today = ratings.find((r) => r.date === todayKey);

  const year = TODAY.getFullYear();
  const month = TODAY.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <section className="card-surface p-4">
      <div className="flex items-center justify-between">
        <p className="num text-[11px] uppercase tracking-[0.18em] text-ink-mute">Daily rating</p>
        <p className="num text-[11px] text-ink-soft">
          {today ? RATING_LABELS[today.rating] : "Unrated"}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {([1, 2, 3, 4, 5] as const).map((r) => (
          <Popover
            key={r}
            open={pending === r}
            onOpenChange={(o) => {
              setPending(o ? r : null);
              if (o) setNote(today?.note ?? "");
            }}
          >
            <PopoverTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.94 }}
                aria-label={`Rate ${RATING_LABELS[r]}`}
                className="h-8 w-8 rounded-full border-2 transition-all"
                style={{
                  backgroundColor: RATING_COLORS[r],
                  borderColor: today?.rating === r ? "#111111" : "transparent",
                  opacity: today && today.rating !== r ? 0.45 : 1,
                }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-64 rounded-2xl border-hairline p-3" align="start">
              <p className="text-xs font-medium text-ink">{RATING_LABELS[r]} day</p>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="One line about today…"
                className="mt-2 w-full rounded-lg border border-hairline bg-background px-2.5 py-2 text-xs text-ink outline-none placeholder:text-ink-mute"
              />
              <button
                onClick={() => {
                  onRate(r, note.trim());
                  setPending(null);
                }}
                className="mt-2 w-full rounded-lg bg-ink px-3 py-2 text-xs font-medium text-primary-foreground"
              >
                Save rating
              </button>
            </PopoverContent>
          </Popover>
        ))}
      </div>

      <p className="num mt-5 text-[11px] uppercase tracking-[0.18em] text-ink-mute">
        Month in pixels
      </p>
      <TooltipProvider delayDuration={80}>
        <div className="mt-2 grid grid-cols-10 gap-1.5">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const d = new Date(year, month, i + 1);
            const key = toKey(d);
            const rating = ratings.find((r) => r.date === key);
            const completed = tasks.filter((t) => t.date === key && t.done).length;
            return (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.18 }}
                    className="aspect-square rounded-[5px]"
                    style={{
                      backgroundColor: rating ? RATING_COLORS[rating.rating] : "#ECECE8",
                      outline: key === todayKey ? "1.5px solid #111111" : "none",
                      outlineOffset: 1,
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent className="rounded-xl">
                  <p className="num text-[11px]">{key}</p>
                  <p className="text-[11px]">
                    {rating ? RATING_LABELS[rating.rating] : "No rating"} · {completed} closed
                  </p>
                  {rating?.note && <p className="mt-0.5 max-w-44 text-[11px] opacity-80">{rating.note}</p>}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </section>
  );
}