# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@rules/core.md
@rules/output.md
@rules/standards.md
@rules/architecture.md
@rules/ui.md
@rules/coding.md
@rules/modes.md

## Commands

```bash
pnpm dev        # Start dev server at localhost:3000
pnpm build      # Production build
pnpm lint       # Run ESLint
```

No test suite is configured. There is no backend — all data is persisted to `localStorage`.

## Architecture

Single-page Next.js 16 App Router app. All logic lives in `app/page.tsx` (client component). No server actions, no API routes.

**Data flow:**
- `Task[]` and `Tab[]` state live in `page.tsx` and sync to `localStorage` via `useEffect`
- `Tab` is a class (`classes/Tab.ts`) with getters/setters; serialize with `.toPlain()` / `Tab.fromPlain()` before storing to state or localStorage — React cannot detect mutations on class instances, so always return `Tab.fromPlain(t.toPlain())` after mutating
- `Month` class (`classes/Month.ts`) is a stub — unused in the current UI

**Key types** (`lib/types.ts`):
- `Task.completedDates` — `string[]` of `YYYY-MM-DD` ISO dates; toggling a date cell adds/removes from this array
- `Task.sheetId` — links a task to a `Tab` by ID; tasks with no `sheetId` fall back to the first tab
- `Task.chartData` — optional `ChartDataPoint[]` for per-task bar charts (Recharts); rendered in `TaskCard.tsx`
- `Task.description` — Markdown string; rendered via `react-markdown` in the side drawer

**UI structure in `page.tsx`:**
- Header (sticky)
- Date-grid table: 30 columns generated from `startDate`; today column highlighted in blue; clicking a cell calls `toggleTaskDate`
- `TaskForm` modal — creates new tasks; supports title, markdown description, and chart data points
- Side drawer — opens when a task with a description is clicked (red corner indicator)
- Sheet tabs bar at table bottom — add/rename/delete sheets; active tab filters the task rows
- Edit sheet modal — inline name + color picker

**Date navigation:** `startDate` defaults to 7 days before today. `adjustStartDate(±7)` shifts the window; "Today" resets it.

## Patterns to follow

- Use `cn()` from `lib/utils` for conditional class merging (wraps `clsx` + `tailwind-merge`)
- `INITIAL_TASKS` in `lib/constants.ts` is the seed data shown before any localStorage data exists
- No Zustand, no React Hook Form, no Zod is used yet despite the stack defaults — keep new state local to `page.tsx` or colocated with the component that owns it
- No shadcn/ui components are installed; use Tailwind + Lucide directly
- Task IDs are generated with `Math.random().toString(36)` inline in `addTask`; Tab IDs use `uuid v4` via `Tab.generateTabId()`
