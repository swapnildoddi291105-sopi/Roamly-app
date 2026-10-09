# Roamly — Agent Rules

> Mirrors docs/RULES.md. This file is placed here for automatic discovery by agent systems.
> The canonical version is docs/RULES.md — keep both in sync.

## Core Rules (Summary)

1. **Stack is fixed**: React 18 + Vite (JS), FastAPI, Leaflet + OSM, Recharts, Framer Motion, Vanilla CSS
2. **Free only**: No paid APIs, no hardcoded keys. Read secrets from `.env`, keep `.env.example` updated.
3. **All external HTTP calls go through the backend** — frontend calls `/api/*` only
4. **Nominatim**: User-Agent = `Roamly-student-project/1.0`, debounce 300ms, 1hr cache
5. **Overpass**: 10-min cache, 15s timeout, graceful empty on failure
6. **Missing data = `null` → "Not available" in UI** — never guess
7. **Label data sources honestly**: "Live: OpenStreetMap", "Demo data", "Sample data", "Estimated", "Unverified", "Verified"
8. **AI assistant returns only places from backend data** — never invented
9. **Never label area "unsafe"** without 3+ independent reports + evidence count shown
10. **Never commit `.env`** — `.env.example` always committed and updated
11. **Never rename/delete existing API endpoints**
12. **Run tests before committing**
13. **Every external call**: loading state + error state + graceful fallback (no blank screens)
14. **Components target < 200 lines** — split when larger
15. **No `console.log` in production paths** — use `console.warn`/`console.error`

## Before Any Code

Read in order:
1. `docs/RULES.md`
2. `docs/MEMORY.md`
3. `docs/TASKS.md`
4. `PROGRESS.md`

## After Any Code

Update:
1. `docs/TASKS.md` (mark done, add new)
2. `docs/MEMORY.md` (decisions, bugs, packages)
3. `PROGRESS.md` (append dated entry)
