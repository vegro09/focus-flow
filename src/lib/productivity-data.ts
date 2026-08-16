export type Category = "Projects" | "Routine" | "Deep Work" | "Admin";

export type Task = {
  id: string;
  title: string;
  category: Category;
  weight: 1 | 2 | 3;
  minutes: number;
  done: boolean;
  date: string; // yyyy-mm-dd
};

export type DayRating = {
  date: string;
  rating: 1 | 2 | 3 | 4 | 5;
  note?: string;
  completed: number;
};

export const TODAY = new Date(2026, 7, 16);

export const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export const RATING_COLORS: Record<number, string> = {
  5: "#10B981",
  4: "#6EE7B7",
  3: "#F59E0B",
  2: "#FB923C",
  1: "#EF4444",
};

export const RATING_LABELS: Record<number, string> = {
  5: "Excellent",
  4: "Good",
  3: "Steady",
  2: "Rough",
  1: "Draining",
};

const T = (
  offset: number,
  title: string,
  category: Category,
  weight: 1 | 2 | 3,
  minutes: number,
  done: boolean,
): Task => ({
  id: `${offset}-${title.slice(0, 8)}-${Math.abs(offset) + minutes}`,
  title,
  category,
  weight,
  minutes,
  done,
  date: toKey(addDays(TODAY, offset)),
});

export const INITIAL_TASKS: Task[] = [
  T(0, "Ship pricing page revamp", "Projects", 3, 90, false),
  T(0, "Review Q3 growth model", "Deep Work", 3, 60, false),
  T(0, "Morning run — 5km", "Routine", 1, 35, true),
  T(0, "Inbox to zero", "Admin", 1, 20, true),
  T(0, "Draft investor update", "Projects", 2, 45, false),
  T(0, "Read 20 pages", "Routine", 1, 30, false),
  T(-1, "Refactor billing service", "Deep Work", 3, 120, true),
  T(-1, "Standup notes", "Admin", 1, 15, true),
  T(-1, "Stretch + mobility", "Routine", 1, 20, true),
  T(-2, "Design system audit", "Projects", 2, 75, true),
  T(-2, "Weekly meal prep", "Routine", 1, 45, true),
  T(-3, "Customer interviews x3", "Deep Work", 3, 90, true),
  T(-3, "Update roadmap board", "Admin", 1, 25, true),
  T(-4, "Landing page copy pass", "Projects", 2, 50, true),
  T(-5, "Quarterly tax filing", "Admin", 2, 60, true),
  T(-6, "Long form writing block", "Deep Work", 3, 110, true),
  T(1, "Prep sprint review deck", "Projects", 2, 40, false),
  T(2, "1:1 with design lead", "Admin", 1, 30, false),
  T(3, "Deep work: search ranking", "Deep Work", 3, 120, false),
];

export const INITIAL_RATINGS: DayRating[] = [
  { date: toKey(addDays(TODAY, -1)), rating: 5, note: "Deep flow all afternoon.", completed: 3 },
  { date: toKey(addDays(TODAY, -2)), rating: 4, note: "Solid, slightly scattered.", completed: 2 },
  { date: toKey(addDays(TODAY, -3)), rating: 5, note: "Interviews went great.", completed: 2 },
  { date: toKey(addDays(TODAY, -4)), rating: 3, note: "Meetings ate the morning.", completed: 1 },
  { date: toKey(addDays(TODAY, -5)), rating: 2, note: "Admin drag.", completed: 1 },
  { date: toKey(addDays(TODAY, -6)), rating: 4, note: "Good writing session.", completed: 1 },
  { date: toKey(addDays(TODAY, -7)), rating: 3, completed: 2 },
  { date: toKey(addDays(TODAY, -8)), rating: 1, note: "Sick day.", completed: 0 },
  { date: toKey(addDays(TODAY, -9)), rating: 4, completed: 3 },
  { date: toKey(addDays(TODAY, -10)), rating: 5, note: "Best shipping day of the month.", completed: 4 },
  { date: toKey(addDays(TODAY, -11)), rating: 3, completed: 2 },
  { date: toKey(addDays(TODAY, -12)), rating: 4, completed: 2 },
  { date: toKey(addDays(TODAY, -13)), rating: 2, completed: 1 },
  { date: toKey(addDays(TODAY, -14)), rating: 5, completed: 3 },
];

export const WEIGHT_TARGET = 9;

export const weightOf = (tasks: Task[]) => tasks.reduce((s, t) => s + t.weight, 0);

export function momentumSeries(tasks: Task[]) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(TODAY, i - 6));
  const points = days.map((d) => {
    const key = toKey(d);
    const closed = weightOf(tasks.filter((t) => t.date === key && t.done));
    return { key, label: `${d.getDate()}`, closed };
  });
  return points.map((p, i) => {
    const window = points.slice(Math.max(0, i - 2), i + 1);
    const avg = window.reduce((s, w) => s + w.closed, 0) / window.length;
    return { ...p, avg: Math.round(avg * 10) / 10 };
  });
}