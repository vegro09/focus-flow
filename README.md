# Focus Flow

Build a sleek, ultra-minimalist, high-performance Daily Productivity & Task Management Web Application inspired by modern Bento Grids and financial trading terminals.

### 1. Visual Design & Theme System (Editorial Monochrome & Cream)

- **Palette**:

  - Main Background: Soft warm creamy off-white (`#F9F9F6` / `bg-[#F9F9F6]`)

  - Card Surfaces: Crisp pure white (`#FFFFFF`) with subtle 1px border (`border-[#E8E8E3]`) and soft muted shadows (`shadow-[0_2px_8px_rgba(0,0,0,0.03)]`)

  - Accent / Primary Elements: Deep solid black (`#111111`) and neutral dark grays (`#2D2D2D`, `#737373`)

  - Daily Rating Colors (Accents): 5-tier mood scale [Tier 5: Emerald Green `#10B981`, Tier 4: Mint Green `#6EE7B7`, Tier 3: Warm Amber `#F59E0B`, Tier 2: Orange `#FB923C`, Tier 1: Crimson Red `#EF4444`]

- **Typography**: Minimalist modern sans-serif (Inter / Geist) paired with Monospace figures for all metrics, dates, and stock ticker percentages.

- **Interactions**: Smooth micro-animations using Framer Motion (checkbox fill animations, smooth tab transitions, hover scale effects).

---

### 2. Layout Structure (Bento Grid Architecture)

#### A. Top Header & 15-Day Sprint Horizon Bar

- **App Bar**: Clean minimalist logo, current date display, "Zen Focus Mode" toggle button (which hides sidebars/analytics and centers the active task), and user profile avatar.

- **15-Day Horizon Strip**:

  - A horizontal row of 15 interactive squircle boxes representing a bi-weekly sprint.

  - Each day box displays the day number, weekday initial, and a dynamic mini-fill / completion dot based on tasks completed on that date.

  - Clicking any box switches the active view to that specific date.

#### B. Main Workspace Layout (2-Column Grid: 65% Main Tasks | 35% Analytics & Sidebar)

**Left Column (Task Engine & Flow):**

- **Filter Tabs**: Minimal pills for "All", "High Priority", "Projects", "Routine".

- **Task Creation Input**: Quick-add bar with priority weight selector (1x, 2x, 3x weight) and tag assigner.

- **Task Ribbon List**:

  - Horizontal card rows with rounded corners.

  - **Checkmark Box**: Custom square box that smoothly fills in pure black with an animated white checkmark upon completion, triggering a subtle strikethrough animation on the task title.

  - Task item meta: Category tag badge, estimated time, and assigned priority weight.

  - Drag-and-drop reordering capability.

**Right Column (Analytics & Ritual Widgets):**

1. **Productivity Ticker / Stock Momentum Card**:

   - Styled like a financial stock card.

   - Large bold momentum score (e.g., `+14.8% Velocity`) with a dynamic green/red trending arrow indicator.

   - Interactive line chart (using Recharts or Lucide Sparkline) showing the 7-day productivity momentum curve vs. 7-day moving average.

   - Metric pill displaying "Closed Tasks Weight vs Target".

2. **Daily Rating Ritual & Month-in-Pixels Matrix**:

   - **Today's Score Selector**: A dedicated interactive row with 5 smooth colored circles (from Crimson to Emerald) to rate the day, active with a 1-line optional micro-note modal/popover.

   - **Monthly Heatmap Grid**: A 30/31-day compact square grid (Year/Month in Pixels) rendering past rated days in their respective color, with empty days in light cream (`#ECECE8`).

   - **Tooltip on Hover**: Hovering over any past day square displays: Date, Rating Level, Task Completion Count, and the Daily Note.

3. **Mini Calendar Matrix**:

   - Minimalist dot-calendar for monthly navigation with indicators for heavy vs. light task loads.

---

### 3. State Management & Technical Requirements

- **Tech Stack**: React, TypeScript, Tailwind CSS, Lucide-React icons, Framer Motion, Recharts / Lucide for trend visualizations, Radix UI / shadcn/ui primitives.

- **Responsive**: Fully responsive desktop layout that stacks smoothly into a clean mobile single-column stream.

- **Mock Data**: Pre-populate with realistic tasks, a week of past completed entries, and active mock data for the 15-day sprint and Month-in-Pixels grid.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/835399bf-6bb6-4c1a-a9ad-6c10856a39ee).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
