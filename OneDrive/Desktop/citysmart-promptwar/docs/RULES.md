# Roamly — Coding Rules (Treat as Law)

> Every agent session MUST read this file before touching code.

---

## 1. Stack (Fixed — Do Not Change Without Approval)
- **Frontend**: React 18 + Vite (JavaScript only — no TypeScript unless asked)
- **Backend**: Python FastAPI + uvicorn
- **Maps**: Leaflet + react-leaflet + OpenStreetMap tiles (no Google Maps SDK)
- **Charts**: Recharts only
- **Animation**: Framer Motion only (no GSAP, no CSS animation libraries)
- **State**: React Context (lift state); Zustand only if context becomes unwieldy (document the decision)
- **CSS**: Vanilla CSS in `index.css` + per-component inline styles where minimal. No Tailwind unless user approves AND it can be layered without rewriting existing styles.
- **Icons**: Lucide-react + emoji fallbacks; all categories defined in `frontend/src/config/categories.js`

---

## 2. Free-Only Rule
- **NO paid APIs, NO credit cards, NO keys from paid tiers.**
- Preferred keyless: Open-Meteo, Overpass, Nominatim, OSRM, Wikipedia REST, Wikimedia Commons.
- If a key is needed (e.g., Gemini): read from `.env`, keep `.env.example` updated with blank placeholders, NEVER hardcode or log keys.
- App must still function (with graceful fallbacks) when no Gemini key is set.

---

## 3. External API Rules
- All external HTTP calls go through the **backend** (FastAPI handles caching, rate limits, User-Agent).
- Frontend fetches only from `/api/*` endpoints.
- **Nominatim**: User-Agent = `Roamly-student-project/1.0`, max 1 req/sec, debounce search inputs ≥ 300 ms, cache results.
- **Overpass**: cache TTL = 10 min, timeout = 15 s, never crash on failure — return graceful empty.
- **Open-Meteo**: cache TTL = 10 min, timeout = 5 s, return fallback payload on failure.
- **Wikipedia REST**: cache in memory, timeout = 5 s, skip silently on failure (non-critical enrichment).

---

## 4. Caching Rules
- Backend: in-memory dict keyed by (lat_rounded_2dp, lng_rounded_2dp, radius) + TTL check.
- Frontend: memory cache per session + localStorage with TTL for places list. Key format: `roamly_cache_{endpoint}_{params_hash}`.
- TTL values: places = 10 min, weather = 10 min, geocode = 1 hour.

---

## 5. Error Handling Rules
- Every API call must have: **loading state**, **error state**, **graceful fallback** (never blank screen).
- Backend: log warnings for non-critical failures, log errors for critical ones. Return safe fallback JSON — never crash uvicorn.
- Frontend: show skeleton loaders during fetch, error banners on failure, empty state messages (never a white blank).
- Network timeouts are NOT errors — they are expected. Log at WARNING level and fall through to fallback.

---

## 6. Data Integrity Rules (Zero Fabrication)
- **Missing/unknown data = `null` in JSON = "Not available" in UI.** Never guess, never default to 0.
- Label data sources honestly on every card and in every drawer:
  - `"Live: OpenStreetMap"` — from Overpass, fetched today
  - `"Demo data"` — from `places.json` seed file
  - `"Sample data"` — synthetic/illustrative data (reports demo set)
  - `"Estimated"` — heuristic (e.g., traffic mood from time-of-day)
  - `"Unverified"` — single citizen report, not cross-checked
  - `"Verified"` — 3+ independent reports or confirmed by upvotes
- The AI assistant must mention **only places returned by the backend**. It must explicitly say when price or rating is not available.
- **Never label an area "unsafe"** without a minimum of 3 independent citizen reports or a documented dataset. Always show: evidence count + confidence level.

---

## 7. Secrets Rule
- `.env` is git-ignored. NEVER commit it.
- `.env.example` must be committed and kept in sync with any new env vars.
- Never `print()` or `logger.info()` an API key or any secret value.

---

## 8. Naming & Folder Rules
- All components: `PascalCase.jsx` in `frontend/src/components/`
- All pages/tabs: `PascalCase.jsx` in `frontend/src/pages/` (or keep in `App.jsx` if small)
- Config/constants: `camelCase.js` in `frontend/src/config/`
- Backend helpers: functions in `main.py` until it exceeds ~600 lines, then split into `backend/routers/` and `backend/services/`
- Category config single source of truth: `frontend/src/config/categories.js`

---

## 9. Code Quality Rules
- Components: aim for < 200 lines. Split when bigger.
- Non-obvious logic must have a brief comment (1 line).
- No `console.log` in production paths — use `console.warn` / `console.error` only.
- No `any` types (JS: use JSDoc comments for complex shapes if needed).
- Keep `import` paths relative and explicit (no barrel index files unless large scale).

---

## 10. Accessibility Rules
- Every interactive element: `aria-label` or visible label.
- Color contrast: minimum AA (4.5:1 for text, 3:1 for UI components).
- Keyboard navigation: Tab order logical, no keyboard traps.
- Map markers: include tooltip/popup text (screen-reader fallback).

---

## 11. Commit Style
```
phase(N): short description of what changed

- file1.ext: what changed
- file2.ext: what changed
[No breaking changes / Breaking: describe if any]
```
- Never commit `.env`
- Never commit `node_modules/`, `__pycache__/`, `.venv/`

---

## 12. NEVER DO List
- Never hardcode coordinates except `PUNE_LAT/PUNE_LNG` default constants (always overridable)
- Never return seed/demo data as if it were live without the `"data_source"` field
- Never call Overpass or Nominatim directly from the frontend
- Never skip the fallback path — every external call needs one
- Never invent places, prices, ratings, incidents, or safety claims
- Never add a new npm package or pip package without noting it in MEMORY.md
- Never rename or delete existing API endpoints (backwards compatibility)
- Never commit a broken state — run tests before committing
