import { TODAY, toKey, type Task } from "@/lib/productivity-data";

const WD = ["M", "T", "W", "T", "F", "S", "S"];

export function MiniCalendar({
  tasks,
  active,
  onSelect,
}: {
  tasks: Task[];
  active: string;
  onSelect: (key: string) => void;
}) {
  const year = TODAY.getFullYear();
  const month = TODAY.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7;

  return (
    <section className="card-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="num text-[11px] uppercase tracking-[0.18em] text-ink-mute">Calendar</p>
        <p className="num text-[11px] text-ink-soft">
          {first.toLocaleString("en-US", { month: "long" })} {year}
        </p>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WD.map((w, i) => (
          <span key={i} className="num text-[10px] text-ink-mute">
            {w}
          </span>
        ))}
        {Array.from({ length: offset }).map((_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = new Date(year, month, i + 1);
          const key = toKey(d);
          const count = tasks.filter((t) => t.date === key).length;
          const isActive = key === active;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`mx-auto flex h-7 w-7 flex-col items-center justify-center rounded-lg transition-colors ${
                isActive ? "bg-ink text-primary-foreground" : "text-ink-soft hover:bg-accent"
              }`}
            >
              <span className="num text-[10px] leading-none">{i + 1}</span>
              <span className="mt-0.5 flex gap-[2px]">
                {Array.from({ length: Math.min(3, count) }).map((_, k) => (
                  <span
                    key={k}
                    className={`h-[3px] w-[3px] rounded-full ${
                      isActive ? "bg-primary-foreground" : count > 2 ? "bg-ink" : "bg-ink-mute"
                    }`}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}